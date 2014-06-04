/*
    Cubic Lens Distortion GLSL Shader

    Original Lens Distortion Algorithm from SSontech (Syntheyes)
    http://www.ssontech.com/content/lensalg.htm

    r2 = image_aspect*image_aspect*u*u + v*v
    f = 1 + r2*(k + kcube*sqrt(r2))
    u' = f*u
    v' = f*v

    author : Francois Tarlier
    website : www.francois-tarlier.com/blog/index.php/2009/11/cubic-lens-distortion-shader
        
    modified by Martins Upitis  
*/

/*
Film Grain post-process shader v1.1 
Martins Upitis (martinsh) devlog-martinsh.blogspot.com
2013

--------------------------
This work is licensed under a Creative Commons Attribution 3.0 Unported License.
So you are free to share, modify and adapt it for your needs, and even use it for commercial use.
I would also love to hear about a project you are using it.

Have fun,
Martins
--------------------------

Perlin noise shader by toneburst:
http://machinesdontcare.wordpress.com/2009/06/25/3d-perlin-noise-sphere-vertex-shader-sourcecode/
*/

uniform float timer;

const float permTexUnit = 1.0/256.0;        // Perm texture texel-size
const float permTexUnitHalf = 0.5/256.0;    // Half perm texture texel-size

uniform float grainamount; //grain amount
uniform bool colored; //colored noise?
uniform float coloramount;
uniform float grainsize; //grain particle size (1.5 - 2.5)
uniform float lumamount; //
uniform float filterStrength;

varying vec2 vUv;
varying vec2 vCanvasUv;
uniform vec2 resolution;
uniform sampler2D texture;

uniform float k, kcube, scale, dispersion, blurAmount; //k = 0.2, kcube = 0.3, scale = 0.9, dispersion = 0.01
uniform bool blurEnabled;
uniform float scratches;
uniform float burn;

#define LOOKUP_FILTER

uniform sampler2D lookupTexture;

const float vignette_size = 1.1; // vignette size
const float tolerance = 0.7; //edge softness


float width = resolution.x;
float height = resolution.y;

vec2 rand(vec2 co) //needed for fast noise based blurring
{ //TODO: use a 1D nearest-neighbour texture lookup ? 
    float noise1 =  (fract(sin(dot(co ,vec2(12.9898,78.233))) * 43758.5453));
    float noise2 =  (fract(sin(dot(co ,vec2(12.9898,78.233)*2.0)) * 43758.5453));
    return clamp(vec2(noise1,noise2),0.0,1.0);
}

highp float hash(vec2 co)
{
    highp float a = 12.9898;
    highp float b = 78.233;
    highp float c = 43758.5453;
    highp float dt= dot(co.xy ,vec2(a,b));
    highp float sn= mod(dt,3.14);
    return fract(sin(sn) * c);
}


vec3 blur(vec2 coords)
{ 
    //TODO: the below vignette code can be pulled out of this function and reused
    vec2 noise = rand(vUv.xy);
    float tolerance = 0.2;
    float vignette_size = 0.5;
    vec2 powers = pow(abs(vec2(vCanvasUv.s - 0.5,vCanvasUv.t - 0.5)),vec2(2.0));
    float radiusSqrd = pow(vignette_size,2.0);
    float gradient = smoothstep(radiusSqrd-tolerance, radiusSqrd+tolerance, powers.x+powers.y);
    
    vec4 col = vec4(0.0);

    float X1 = coords.x + blurAmount * noise.x*0.004 * gradient;
    float Y1 = coords.y + blurAmount * noise.y*0.004 * gradient;
    float X2 = coords.x - blurAmount * noise.x*0.004 * gradient;
    float Y2 = coords.y - blurAmount * noise.y*0.004 * gradient;
    
    float invX1 = coords.x + blurAmount * ((1.0-noise.x)*0.004) * (gradient * 0.5);
    float invY1 = coords.y + blurAmount * ((1.0-noise.y)*0.004) * (gradient * 0.5);
    float invX2 = coords.x - blurAmount * ((1.0-noise.x)*0.004) * (gradient * 0.5);
    float invY2 = coords.y - blurAmount * ((1.0-noise.y)*0.004) * (gradient * 0.5);

    //TODO: optimize the blur --> dependent texture reads and texel centers...
    col += texture2D(texture, vec2(X1, Y1))*0.1;
    col += texture2D(texture, vec2(X2, Y2))*0.1;
    col += texture2D(texture, vec2(X1, Y2))*0.1;
    col += texture2D(texture, vec2(X2, Y1))*0.1;
    
    col += texture2D(texture, vec2(invX1, invY1))*0.15;
    col += texture2D(texture, vec2(invX2, invY2))*0.15;
    col += texture2D(texture, vec2(invX1, invY2))*0.15;
    col += texture2D(texture, vec2(invX2, invY1))*0.15;
    
    return col.rgb;
}


//a random texture generator, but you can also use a pre-computed perturbation texture
vec4 rnm(in vec2 tc) 
{
    float noise =  sin(dot(tc + vec2(timer,timer),vec2(12.9898,78.233))) * 43758.5453;

    float noiseR =  fract(noise)*2.0-1.0;
    float noiseG =  fract(noise*1.2154)*2.0-1.0; 
    float noiseB =  fract(noise*1.3453)*2.0-1.0;
    float noiseA =  fract(noise*1.3647)*2.0-1.0;
    
    return vec4(noiseR,noiseG,noiseB,noiseA);
}

float fade(in float t) {
    return t*t*t*(t*(t*6.0-15.0)+10.0);
}

float pnoise3D(in vec3 p)
{
    vec3 pi = permTexUnit*floor(p)+permTexUnitHalf; // Integer part, scaled so +1 moves permTexUnit texel
    // and offset 1/2 texel to sample texel centers
    vec3 pf = fract(p);     // Fractional part for interpolation

    // Noise contributions from (x=0, y=0), z=0 and z=1
    float perm00 = rnm(pi.xy).a ;
    vec3  grad000 = rnm(vec2(perm00, pi.z)).rgb * 4.0 - 1.0;
    float n000 = dot(grad000, pf);
    vec3  grad001 = rnm(vec2(perm00, pi.z + permTexUnit)).rgb * 4.0 - 1.0;
    float n001 = dot(grad001, pf - vec3(0.0, 0.0, 1.0));

    // Noise contributions from (x=0, y=1), z=0 and z=1
    float perm01 = rnm(pi.xy + vec2(0.0, permTexUnit)).a ;
    vec3  grad010 = rnm(vec2(perm01, pi.z)).rgb * 4.0 - 1.0;
    float n010 = dot(grad010, pf - vec3(0.0, 1.0, 0.0));
    vec3  grad011 = rnm(vec2(perm01, pi.z + permTexUnit)).rgb * 4.0 - 1.0;
    float n011 = dot(grad011, pf - vec3(0.0, 1.0, 1.0));

    // Noise contributions from (x=1, y=0), z=0 and z=1
    float perm10 = rnm(pi.xy + vec2(permTexUnit, 0.0)).a ;
    vec3  grad100 = rnm(vec2(perm10, pi.z)).rgb * 4.0 - 1.0;
    float n100 = dot(grad100, pf - vec3(1.0, 0.0, 0.0));
    vec3  grad101 = rnm(vec2(perm10, pi.z + permTexUnit)).rgb * 4.0 - 1.0;
    float n101 = dot(grad101, pf - vec3(1.0, 0.0, 1.0));

    // Noise contributions from (x=1, y=1), z=0 and z=1
    float perm11 = rnm(pi.xy + vec2(permTexUnit, permTexUnit)).a ;
    vec3  grad110 = rnm(vec2(perm11, pi.z)).rgb * 4.0 - 1.0;
    float n110 = dot(grad110, pf - vec3(1.0, 1.0, 0.0));
    vec3  grad111 = rnm(vec2(perm11, pi.z + permTexUnit)).rgb * 4.0 - 1.0;
    float n111 = dot(grad111, pf - vec3(1.0, 1.0, 1.0));

    // Blend contributions along x
    vec4 n_x = mix(vec4(n000, n001, n010, n011), vec4(n100, n101, n110, n111), fade(pf.x));

    // Blend contributions along y
    vec2 n_xy = mix(n_x.xy, n_x.zw, fade(pf.y));

    // Blend contributions along z
    float n_xyz = mix(n_xy.x, n_xy.y, fade(pf.z));

    // We're done, return the final noise value.
    return n_xyz;
}

//2d coordinate orientation thing
vec2 coordRot(in vec2 tc, in float angle)
{
    float aspect = width/height;
    float rotX = ((tc.x*2.0-1.0)*aspect*cos(angle)) - ((tc.y*2.0-1.0)*sin(angle));
    float rotY = ((tc.y*2.0-1.0)*cos(angle)) + ((tc.x*2.0-1.0)*aspect*sin(angle));
    rotX = ((rotX/aspect)*0.5+0.5);
    rotY = rotY*0.5+0.5;
    return vec2(rotX,rotY);
}



//good for large clumps of smooth looking noise, but too repetitive
//for small grains
float fastNoise(vec2 n) {
    const vec2 d = vec2(0.0, 1.0);
    vec2 b = floor(n), f = smoothstep(vec2(0.0), vec2(1.0), fract(n));
    return mix(mix(hash(b), hash(b + d.yx ), f.x), mix(hash(b + d.xy ), hash(b + d.yy ), f.x), f.y);
}







void main(void)
{
    //index of refraction of each color channel, causing chromatic dispersion
    vec3 eta = vec3(1.0+dispersion*0.9, 1.0+dispersion*0.6, 1.0+dispersion*0.3);
    
    //texture coordinates
    vec2 texcoord = vUv;
    
    //canvas coordinates to get the center of rendered viewport
    //vec2 cancoord = vUv.st;
    vec2 cancoord = vCanvasUv;

    float r2 = (cancoord.x-0.5) * (cancoord.x-0.5) + (cancoord.y-0.5) * (cancoord.y-0.5);       

    float f = 0.0;

    //only compute the cubic distortion if necessary
    
    if( kcube == 0.0)
    {
        f = 1.0 + r2 * k;
    }else{
        f = 1.0 + r2 * (k + kcube * sqrt(r2));
    }
  
    

    // get the right pixel for the current position
    
    vec2 rCoords = (f*eta.r)*scale*(texcoord.xy-0.5)+0.5;
    vec2 gCoords = (f*eta.g)*scale*(texcoord.xy-0.5)+0.5;
    vec2 bCoords = (f*eta.b)*scale*(texcoord.xy-0.5)+0.5;

    vec3 inputDistort = vec3(0.0); 
        

    inputDistort.r = texture2D(texture,rCoords).r;
    inputDistort.g = texture2D(texture,gCoords).g;
    inputDistort.b = texture2D(texture,bCoords).b;
    
    if (blurEnabled)
    {
        inputDistort.r = blur(rCoords).r;
        inputDistort.g = blur(gCoords).g;
        inputDistort.b = blur(bCoords).b;
    }
    
    gl_FragColor = vec4(inputDistort.r,inputDistort.g,inputDistort.b,1.0);

        
    //mix in vignette
    float aspectratio = width/height;
    vec2 powers = pow(abs(vec2((vUv.s - 0.5)*aspectratio,vUv.t - 0.5)),vec2(2.0));
    float radiusSqrd = pow(vignette_size,2.0);
    float gradient = smoothstep(radiusSqrd-tolerance, radiusSqrd+tolerance, powers.x+powers.y);
        
    gl_FragColor = mix(gl_FragColor, vec4(0.0), gradient);


    
    vec2 texCoord = vUv.st;
    
    vec3 rotOffset = vec3(1.425,3.892,5.835); //rotation offset values  
    vec2 rotCoordsR = coordRot(texCoord, timer + rotOffset.x);
    vec3 noise = vec3(pnoise3D(vec3(rotCoordsR*vec2(width/grainsize,height/grainsize),0.0)));
    

    if (colored)
    {
        vec2 rotCoordsG = coordRot(texCoord, timer + rotOffset.y);
        vec2 rotCoordsB = coordRot(texCoord, timer + rotOffset.z);
        noise.g = mix(noise.r,pnoise3D(vec3(rotCoordsG*vec2(width/grainsize,height/grainsize),1.0)),coloramount);
        noise.b = mix(noise.r,pnoise3D(vec3(rotCoordsB*vec2(width/grainsize,height/grainsize),2.0)),coloramount);
    }

    // noise = vec3( fastNoise(texCoord*sin(timer*0.1)*3.0 + fastNoise(timer*0.4+texCoord*2.0)) )*burn;
    noise += vec3( smoothstep(0.0, 0.6, fastNoise(texCoord*sin(timer*0.1)*5.0 + fastNoise(timer*0.4+texCoord*2.0))) )*burn;

    vec3 col = gl_FragColor.rgb;
    // vec3 col = texture2D(texture, texCoord).rgb;

    //noisiness response curve based on scene luminance
    vec3 lumcoeff = vec3(0.299,0.587,0.114);
    float luminance = mix(0.0,dot(col, lumcoeff),lumamount);
    float lum = smoothstep(0.2,0.0,luminance);
    lum += luminance;

    noise = mix(noise,vec3(0.0),pow(lum,4.0));
    col = col+noise*grainamount;

    if (scratches > 0.0001) {

        //large occasional burns
        float specs = fastNoise(texCoord*(10.0+sin(timer)*5.0) + fastNoise(timer+texCoord*50.0) );
        col -= vec3( smoothstep(0.955, 0.96, specs*sin(timer*4.0)  ) )*scratches*0.5; //0.05   
        specs = fastNoise(texCoord*1.0*(10.0+sin(timer)*5.0) - fastNoise(timer+texCoord*40.0) );
        col -= (1.-vec3( smoothstep(0.99, 0.96, (specs)*(sin(cos(timer)*4.0)/2.+0.5)) ))*scratches*0.7; //0.07
        
        // // //this is really crappy and should be revisited...
        col -= clamp( scratches*vec3( smoothstep(0.000001, 0.0000, hash(texCoord.xx*timer) ) * (abs(cos(timer)*sin(timer*1.5))-0.5) ), 0.0, 1.0 );
    }



    gl_FragColor =  vec4(col,1.0);

    //mix in lookup filter
    #ifdef LOOKUP_FILTER
        lowp vec4 textureColor = clamp(gl_FragColor,0.0, 1.0);
        // lowp vec4 textureColor = texture2D(inputImageTexture, textureCoordinate);
     
        mediump float blueColor = textureColor.b * 63.0;

        mediump vec2 quad1;
        quad1.y = floor(floor(blueColor) / 8.0);
        quad1.x = floor(blueColor) - (quad1.y * 8.0);

        mediump vec2 quad2;
        quad2.y = floor(ceil(blueColor) / 8.0);
        quad2.x = ceil(blueColor) - (quad2.y * 8.0);

        highp vec2 texPos1;
        texPos1.x = (quad1.x * 0.125) + 0.5/512.0 + ((0.125 - 1.0/512.0) * textureColor.r);
        texPos1.y = (quad1.y * 0.125) + 0.5/512.0 + ((0.125 - 1.0/512.0) * textureColor.g);

        texPos1.y = 1.0-texPos1.y;

        highp vec2 texPos2;
        texPos2.x = (quad2.x * 0.125) + 0.5/512.0 + ((0.125 - 1.0/512.0) * textureColor.r);
        texPos2.y = (quad2.y * 0.125) + 0.5/512.0 + ((0.125 - 1.0/512.0) * textureColor.g);

        texPos2.y = 1.0-texPos2.y;

        lowp vec4 newColor1 = texture2D(lookupTexture, texPos1);
        lowp vec4 newColor2 = texture2D(lookupTexture, texPos2);

        lowp vec4 newColor = mix(newColor1, newColor2, fract(blueColor));
        gl_FragColor.rgb = mix(gl_FragColor.rgb, newColor.rgb, filterStrength);
    #endif
}