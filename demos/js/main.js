(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
;__browserify_shim_require__=require;(function browserifyShim(module, exports, require, define, browserify_shim__define__module__export__) {
/**
 * @author mrdoob / http://mrdoob.com/
 */

var Stats = function () {

	var startTime = Date.now(), prevTime = startTime;
	var ms = 0, msMin = Infinity, msMax = 0;
	var fps = 0, fpsMin = Infinity, fpsMax = 0;
	var frames = 0, mode = 0;

	var container = document.createElement( 'div' );
	container.id = 'stats';
	container.addEventListener( 'mousedown', function ( event ) { event.preventDefault(); setMode( ++ mode % 2 ) }, false );
	container.style.cssText = 'width:80px;opacity:0.9;cursor:pointer';

	var fpsDiv = document.createElement( 'div' );
	fpsDiv.id = 'fps';
	fpsDiv.style.cssText = 'padding:0 0 3px 3px;text-align:left;background-color:#002';
	container.appendChild( fpsDiv );

	var fpsText = document.createElement( 'div' );
	fpsText.id = 'fpsText';
	fpsText.style.cssText = 'color:#0ff;font-family:Helvetica,Arial,sans-serif;font-size:9px;font-weight:bold;line-height:15px';
	fpsText.innerHTML = 'FPS';
	fpsDiv.appendChild( fpsText );

	var fpsGraph = document.createElement( 'div' );
	fpsGraph.id = 'fpsGraph';
	fpsGraph.style.cssText = 'position:relative;width:74px;height:30px;background-color:#0ff';
	fpsDiv.appendChild( fpsGraph );

	while ( fpsGraph.children.length < 74 ) {

		var bar = document.createElement( 'span' );
		bar.style.cssText = 'width:1px;height:30px;float:left;background-color:#113';
		fpsGraph.appendChild( bar );

	}

	var msDiv = document.createElement( 'div' );
	msDiv.id = 'ms';
	msDiv.style.cssText = 'padding:0 0 3px 3px;text-align:left;background-color:#020;display:none';
	container.appendChild( msDiv );

	var msText = document.createElement( 'div' );
	msText.id = 'msText';
	msText.style.cssText = 'color:#0f0;font-family:Helvetica,Arial,sans-serif;font-size:9px;font-weight:bold;line-height:15px';
	msText.innerHTML = 'MS';
	msDiv.appendChild( msText );

	var msGraph = document.createElement( 'div' );
	msGraph.id = 'msGraph';
	msGraph.style.cssText = 'position:relative;width:74px;height:30px;background-color:#0f0';
	msDiv.appendChild( msGraph );

	while ( msGraph.children.length < 74 ) {

		var bar = document.createElement( 'span' );
		bar.style.cssText = 'width:1px;height:30px;float:left;background-color:#131';
		msGraph.appendChild( bar );

	}

	var setMode = function ( value ) {

		mode = value;

		switch ( mode ) {

			case 0:
				fpsDiv.style.display = 'block';
				msDiv.style.display = 'none';
				break;
			case 1:
				fpsDiv.style.display = 'none';
				msDiv.style.display = 'block';
				break;
		}

	}

	var updateGraph = function ( dom, value ) {

		var child = dom.appendChild( dom.firstChild );
		child.style.height = value + 'px';

	}

	return {

		REVISION: 11,

		domElement: container,

		setMode: setMode,

		begin: function () {

			startTime = Date.now();

		},

		end: function () {

			var time = Date.now();

			ms = time - startTime;
			msMin = Math.min( msMin, ms );
			msMax = Math.max( msMax, ms );

			msText.textContent = ms + ' MS (' + msMin + '-' + msMax + ')';
			updateGraph( msGraph, Math.min( 30, 30 - ( ms / 200 ) * 30 ) );

			frames ++;

			if ( time > prevTime + 1000 ) {

				fps = Math.round( ( frames * 1000 ) / ( time - prevTime ) );
				fpsMin = Math.min( fpsMin, fps );
				fpsMax = Math.max( fpsMax, fps );

				fpsText.textContent = fps + ' FPS (' + fpsMin + '-' + fpsMax + ')';
				updateGraph( fpsGraph, Math.min( 30, 30 - ( fps / 100 ) * 30 ) );

				prevTime = time;
				frames = 0;

			}

			return time;

		},

		update: function () {

			startTime = this.end();

		}

	}

};

; browserify_shim__define__module__export__(typeof Stats != "undefined" ? Stats : window.Stats);

}).call(global, undefined, undefined, undefined, undefined, function defineExport(ex) { module.exports = ex; });

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],2:[function(require,module,exports){
var domready = require('domready');
var THREE = (window.THREE);
var Stats = require('stats');
require('raf.js');

var lensShader = require('./shaders/lens');
var fxaaShader = require('./shaders/fxaa');
var grainShader = require('./shaders/grain');
console.log(lensShader);

function addLights(scene) {
    var light = new THREE.AmbientLight(0x14031b);
    scene.add(light);

    var point = new THREE.PointLight(0xaf581e, 1.0, 1000);
    point.position.x = -5;
    point.position.y = 80;
    scene.add(point);

    var hemi = new THREE.HemisphereLight(0x5babc2, 0x8d5f2e, 1);

    var dir = new THREE.DirectionalLight(0x5babc2, 0.5);
    dir.position.y = 50;
    dir.position.x = 10;
    dir.position.z = -10;
    dir.castShadow = true;
    dir.shadowMapWidth = 2048;
    dir.shadowMapHeight = 2048;

    
    dir.shadowCameraNear = 5;
    dir.shadowCameraFar = 1000;
    
    var far = 500;
    dir.shadowCameraLeft = -far;
    dir.shadowCameraRight = far;
    dir.shadowCameraTop = far;
    dir.shadowCameraBottom = -far;
    dir.shadowCameraFov = 50;
    dir.shadowDarkness = 0.5;


    scene.add(dir);
}

function createScene() {
    var scene = new THREE.Scene();


    var path = "img/cube/SwedishRoyalCastle/";
    var format = '.jpg';
    var urls = [
            path + 'px' + format, path + 'nx' + format,
            path + 'py' + format, path + 'ny' + format,
            path + 'pz' + format, path + 'nz' + format
        ];

    var reflectionCube = THREE.ImageUtils.loadTextureCube( urls );
    reflectionCube.format = THREE.RGBFormat;

    var refractionCube = new THREE.Texture( reflectionCube.image, new THREE.CubeRefractionMapping() );
    refractionCube.format = THREE.RGBFormat;

    var r = 10;
    var sphereGeo = new THREE.SphereGeometry(r, 50, 50);
    var colors = [
        0x9e735f,
        0xFFFFFF,
        0x5babc2
    ];
    var count = 5;
    for (var i=0; i<count; i++) {
        var c = colors[i%colors.length];
        var sphere = new THREE.Mesh(
            sphereGeo,
            new THREE.MeshLambertMaterial({
                color: c, envMap: reflectionCube, 
                combine: THREE.MixOperation, reflectivity: Math.random()*0.5,
                shading:THREE.SmoothShading})
        );
        sphere.position.x = (i/count*2-1) * 55;
        // sphere.position.z = (Math.random()*2-1)*100;
        sphere.castShadow = true;
        scene.add(sphere);    
    }
        
    var ground = THREE.ImageUtils.loadTexture("img/ground.jpg");
    ground.wrapS = THREE.RepeatWrapping;
    ground.wrapT = THREE.RepeatWrapping;
    ground.repeat.x = 15;
    ground.repeat.y = 15;

    var planeGeo = new THREE.PlaneGeometry(1000, 1000, 10, 10);
    planeGeo.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI/2));
    var floor = new THREE.Mesh(
        planeGeo, new THREE.MeshLambertMaterial({map:ground})
    );
    floor.position.y = -r;
    floor.receiveShadow = true;
    scene.add(floor);

    addLights(scene);

    return scene;
}

function createRenderTarget(renderer, width, height) {
    var rtWidth = width||2,
        rtHeight = height||2;

    var gl = renderer.getContext();
    var maxRenderTargetSize = gl.getParameter(gl.MAX_RENDERBUFFER_SIZE);

    rtWidth = Math.min(rtWidth, maxRenderTargetSize);
    rtHeight = Math.min(rtHeight, maxRenderTargetSize);

    var renderTarget = new THREE.WebGLRenderTarget(rtWidth, rtHeight, {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBFormat,
        generateMipmaps: false
    });
    return renderTarget;
}

function setupPostProcessing(renderer, width, height) {
    var renderTarget = createRenderTarget(renderer, width, height);
    var renderTarget2 = createRenderTarget(renderer, width, height);

    var fxaaMaterial = new THREE.ShaderMaterial({
        uniforms: {
            //the scene texture...
            texture: {type:'t', value: renderTarget},
            resolution: {type:'v2', value: new THREE.Vector2(width, height)}
        },
        vertexShader: fxaaShader.vertex,
        fragmentShader: fxaaShader.fragment
    });

    var lookupTexture = THREE.ImageUtils.loadTexture("img/lookup_film.png");
    lookupTexture.genMipmaps = false;
    lookupTexture.minFilter = THREE.LinearFilter;
    lookupTexture.magFilter = THREE.LinearFilter;
    lookupTexture.wrapS = THREE.ClampToEdgeWrapping;
    lookupTexture.wrapT = THREE.ClampToEdgeWrapping;

    var postMaterial = new THREE.ShaderMaterial({
        uniforms: {
            //lens distortion
            resolution: {type: 'v2', value: new THREE.Vector2(width, height)},
            k: {type: 'f', value: 0.05},
            kcube: { type: 'f', value: 0.1},
            scale: { type: 'f', value: 0.9},
            dispersion: {type:'f', value:0.01},
            blurAmount: {type: 'f', value: 1.0},
            blurEnabled: {type:'i', value: 1},

            //film grain..
            grainamount: {type: 'f', value: 0.03},
            colored: {type: 'i', value: 0},
            coloramount: {type: 'f', value:0.6},
            grainsize: {type:'f', value:1.9},
            lumamount: {type: 'f', value:1.0},
            timer: {type: 'f', value: 0.0},

            //film dust, scratches, burn
            scratches: {type: 'f', value: 0.1},
            burn: {type: 'f', value: 0.3},

            //filter
            filterStrength: {type: 'f', value: 1},

            //the scene texture...
            texture: {type:'t', value: renderTarget2},

            //the filter lookup texture
            lookupTexture: {type: 't', value: lookupTexture },
        },
        vertexShader: lensShader.vertex,
        fragmentShader: lensShader.fragment
    });
    
    postQuad = new THREE.Mesh(new THREE.PlaneGeometry( 2, 2 ), postMaterial);
    
    postCamera = new THREE.OrthographicCamera( -1, 1, 1, -1, 0, 1 );
    postCamera.updateProjectionMatrix();

    postScene = new THREE.Scene();
    postScene.add(postQuad);

    return {
        camera: postCamera,
        scene: postScene,
        quad: postQuad,
        postMaterial: postMaterial,
        fxaaMaterial: fxaaMaterial,
        target: renderTarget,
        target2: renderTarget2,

        resize: function(width, height) {
            this.target = this.target.clone();
            this.target2 = this.target2.clone();

            this.target.width = width;
            this.target.height = height;
            this.target2.width = width;
            this.target2.height = height;

            this.postMaterial.uniforms.texture.value = this.target2;
            this.fxaaMaterial.uniforms.texture.value = this.target;
        }
    };
}

domready(function() {
    var width = 720,
        height = 480;


    var renderer = new THREE.WebGLRenderer({ 
        antialias: false,
        canvas: document.getElementById("canvas")
    });
    renderer.setSize(width, height);
    renderer.shadowMapEnabled = true;
    renderer.shadowMapType = THREE.PCFSoftShadowMap;
    renderer.gammaInput = true;
    renderer.gammaOutput = true;

    var stats = new Stats();
    stats.setMode(0); // 0: fps, 1: ms

    // Align top-left
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = (10+width-80)+'px';
    stats.domElement.style.top = '10px';
    document.body.appendChild(stats.domElement);

    var post = setupPostProcessing(renderer, width, height);

    var useFXAA = true,
        usePost = true;

    function updateLabels() {
        document.querySelector('.post').style.display = usePost ? 'block' : 'none';
        document.querySelector('.fxaa-on').style.display = !useFXAA ? 'block' : 'none';
        document.querySelector('.fxaa-off').style.display = useFXAA ? 'block' : 'none';
    }
    
    updateLabels();

    window.addEventListener("keydown", function(ev) {
        var chr = String.fromCharCode(ev.which||ev.keyCode).toLowerCase();
        if (chr==='p') {
            usePost = !usePost;
        } else if (chr === 'f') {
            useFXAA = !useFXAA;
        } 
        //Disabled for now..
        // else if (chr === 'n') {
        //     //bit flip 0 to 1 and vice versa
        //     post.postMaterial.uniforms.colored.value ^= 1; 
        // }

        updateLabels();
    });

    var scene = createScene();
    var camera = new THREE.PerspectiveCamera( 60, width/height, 1, 1000 );

    var clock = new THREE.Clock();

    requestAnimationFrame(render);

    function render() {
        requestAnimationFrame(render);
        stats.begin();

        var time = clock.getElapsedTime();

        post.postMaterial.uniforms.timer.value = time;

        //orbit camera
        var radius = 50;

        camera.position.x = Math.cos(time*0.4) * radius;
        camera.position.z = Math.sin(time*0.4) * radius;
        camera.position.y = Math.sin(time*0.25) * 1 + 25;
        camera.lookAt(new THREE.Vector3(0,0,0));
        
        if (usePost) {
            

            //render scene to first target if FXAA is enabled
            renderer.render(scene, camera, useFXAA ? post.target : post.target2);

            if (useFXAA) {
                //render FXAA to second target
                post.quad.material = post.fxaaMaterial;
                renderer.render(post.scene, post.camera, post.target2);
            }

            //render lens effects to screen
            post.quad.material = post.postMaterial;
            renderer.render(post.scene, post.camera);
        }  else {
            renderer.render(scene, camera);
        }
            
        stats.end();
    }
});
},{"./shaders/fxaa":3,"./shaders/grain":4,"./shaders/lens":5,"domready":6,"raf.js":9,"stats":1}],3:[function(require,module,exports){


module.exports = {
    vertex: "varying vec2 vUv;\n\nvarying vec2 v_rgbNW;\nvarying vec2 v_rgbNE;\nvarying vec2 v_rgbSW;\nvarying vec2 v_rgbSE;\nvarying vec2 v_rgbM;\n\nuniform vec2 resolution;\n\nvoid main() {\n\tvUv = uv;  \n\tvec2 inverseVP = vec2(1.0 / resolution.x, 1.0 / resolution.y);\n\tvec2 fragCoord = uv * resolution;\n\tv_rgbNW = (fragCoord + vec2(-1.0, -1.0)) * inverseVP;\n\tv_rgbNE = (fragCoord + vec2(1.0, -1.0)) * inverseVP;\n\tv_rgbSW = (fragCoord + vec2(-1.0, 1.0)) * inverseVP;\n\tv_rgbSE = (fragCoord + vec2(1.0, 1.0)) * inverseVP;\n\tv_rgbM = vec2(fragCoord * inverseVP);\n\tgl_Position = projectionMatrix *\n\t            modelViewMatrix *\n\t            vec4(position,1.0);\n}\n",
    fragment: "varying vec2 vUv;\n\nvarying mediump vec2 v_rgbNW;\nvarying mediump vec2 v_rgbNE;\nvarying mediump vec2 v_rgbSW;\nvarying mediump vec2 v_rgbSE;\nvarying mediump vec2 v_rgbM;\n\nuniform vec2 resolution;\nuniform sampler2D texture;\n\n\n/* Basic FXAA implementation based on the code on geeks3d.com with the\n   modification that the texture2DLod stuff was removed since it's\n   unsupported by WebGL. */\n\n#define FXAA_REDUCE_MIN   (1.0/ 128.0)\n#define FXAA_REDUCE_MUL   (1.0 / 8.0)\n#define FXAA_SPAN_MAX     8.0\n\n\nvoid main(void)\n{\n    mediump vec2 fragCoord = vUv*resolution; \n\n    vec4 color;\n    mediump vec2 inverseVP = vec2(1.0 / resolution.x, 1.0 / resolution.y);\n    vec3 rgbNW = texture2D(texture, v_rgbNW).xyz;\n    vec3 rgbNE = texture2D(texture, v_rgbNE).xyz;\n    vec3 rgbSW = texture2D(texture, v_rgbSW).xyz;\n    vec3 rgbSE = texture2D(texture, v_rgbSE).xyz;\n    vec3 rgbM  = texture2D(texture, v_rgbM).xyz;\n    vec3 luma = vec3(0.299, 0.587, 0.114);\n    float lumaNW = dot(rgbNW, luma);\n    float lumaNE = dot(rgbNE, luma);\n    float lumaSW = dot(rgbSW, luma);\n    float lumaSE = dot(rgbSE, luma);\n    float lumaM  = dot(rgbM,  luma);\n    float lumaMin = min(lumaM, min(min(lumaNW, lumaNE), min(lumaSW, lumaSE)));\n    float lumaMax = max(lumaM, max(max(lumaNW, lumaNE), max(lumaSW, lumaSE)));\n    \n    mediump vec2 dir;\n    dir.x = -((lumaNW + lumaNE) - (lumaSW + lumaSE));\n    dir.y =  ((lumaNW + lumaSW) - (lumaNE + lumaSE));\n    \n    float dirReduce = max((lumaNW + lumaNE + lumaSW + lumaSE) *\n                          (0.25 * FXAA_REDUCE_MUL), FXAA_REDUCE_MIN);\n    \n    float rcpDirMin = 1.0 / (min(abs(dir.x), abs(dir.y)) + dirReduce);\n    dir = min(vec2(FXAA_SPAN_MAX, FXAA_SPAN_MAX),\n              max(vec2(-FXAA_SPAN_MAX, -FXAA_SPAN_MAX),\n              dir * rcpDirMin)) * inverseVP;\n    \n    vec3 rgbA = 0.5 * (\n        texture2D(texture, fragCoord * inverseVP + dir * (1.0 / 3.0 - 0.5)).xyz +\n        texture2D(texture, fragCoord * inverseVP + dir * (2.0 / 3.0 - 0.5)).xyz);\n    vec3 rgbB = rgbA * 0.5 + 0.25 * (\n        texture2D(texture, fragCoord * inverseVP + dir * -0.5).xyz +\n        texture2D(texture, fragCoord * inverseVP + dir * 0.5).xyz);\n\n    float lumaB = dot(rgbB, luma);\n    if ((lumaB < lumaMin) || (lumaB > lumaMax))\n        color = vec4(rgbA, 1.0);\n    else\n        color = vec4(rgbB, 1.0);\n    gl_FragColor = color;\n}\n",
};
},{}],4:[function(require,module,exports){


module.exports = {
    vertex: "varying vec2 vUv;\nvarying vec2 vCanvasUv;\n\nvoid main() {\n  vUv = uv;  \n  vCanvasUv = uv;\n  \n  gl_Position = projectionMatrix *\n                modelViewMatrix *\n                vec4(position,1.0);\n}\n",
    fragment: "#ifdef GL_ES\nprecision mediump float;\n#endif\n\n\n/*\nmaking it look more like actual film grain:\n- a constant undulating \"burn\"\n- occasional specks flashing in semi-random looking places\n\ntodo:\n- revisit horizontal scratches.. kinda hack right now\n- hairline specks\n- grain animation should be independent of constant burn animation\n\nUsing Gorilla Grain's free \"Clean\" overlay as a reference:\nhttp://gorillagrain.com/features\n\nHow it might work in practice in a game:\n- Use two shaders; one for the \"grain\" (which is pretty expensive)\n  This only needs to be updated once every 40-50ms\n- Another for the constantly moving grain and burns/scratches, which is relatively cheaper\n- A move advanced system might add scratches/etc using textures. \n\n@mattdesl\n*/\n\n/*\nFilm Grain post-process shader v1.1 \nMartins Upitis (martinsh) devlog-martinsh.blogspot.com\n2013\n\n--------------------------\nThis work is licensed under a Creative Commons Attribution 3.0 Unported License.\nSo you are free to share, modify and adapt it for your needs, and even use it for commercial use.\nI would also love to hear about a project you are using it.\n\nHave fun,\nMartins\n--------------------------\n\nPerlin noise shader by toneburst:\nhttp://machinesdontcare.wordpress.com/2009/06/25/3d-perlin-noise-sphere-vertex-shader-sourcecode/\n*/\n\nvarying vec2 vUv;\nuniform sampler2D texture;\n\nuniform float timer;\nuniform vec2 resolution;\n\nfloat width = resolution.x;\nfloat height = resolution.y;\n\nconst float permTexUnit = 1.0/256.0;        // Perm texture texel-size\nconst float permTexUnitHalf = 0.5/256.0;    // Half perm texture texel-size\n\nuniform float grainamount; //grain amount\nuniform bool colored; //colored noise?\nuniform float coloramount;\nuniform float grainsize; //grain particle size (1.5 - 2.5)\nuniform float lumamount; //\n\n//the grain animation\nfloat anim = timer; //too fast right now.. should be more like 41.66 ms\n\n#define Blend(base, blend, funcf)       vec3(funcf(base.r, blend.r), funcf(base.g, blend.g), funcf(base.b, blend.b))\n#define BlendSoftLightf(base, blend)    ((blend < 0.5) ? (2.0 * base * blend + base * base * (1.0 - 2.0 * blend)) : (sqrt(base) * (2.0 * blend - 1.0) + 2.0 * base * (1.0 - blend)))\n#define BlendLightenf(base, blend)      max(blend, base)\n\n#define BlendSoftLight(base, blend)     Blend(base, blend, BlendSoftLightf)\n#define BlendLighten                    BlendLightenf\n\n//a random texture generator, but you can also use a pre-computed perturbation texture\nvec4 rnm(in vec2 tc) \n{\n    float noise =  sin(dot(tc,vec2(anim)+vec2(12.9898,78.233))) * 43758.5453;\n    float noiseR =  fract(noise)*2.0-1.0;\n    float noiseG =  fract(noise*1.2154)*2.0-1.0; \n    float noiseB =  fract(noise*1.3453)*2.0-1.0;\n    float noiseA =  fract(noise*1.3647)*2.0-1.0;\n    \n    return vec4(noiseR,noiseG,noiseB,noiseA);\n}\n\nfloat fade(in float t) {\n    return t*t*t*(t*(t*6.0-15.0)+10.0);\n}\n\nfloat pnoise3D(in vec3 p)\n{\n    vec3 pi = permTexUnit*floor(p)+permTexUnitHalf; // Integer part, scaled so +1 moves permTexUnit texel\n    // and offset 1/2 texel to sample texel centers\n    vec3 pf = fract(p);     // Fractional part for interpolation\n\n    // Noise contributions from (x=0, y=0), z=0 and z=1\n    float perm00 = rnm(pi.xy).a ;\n    vec3  grad000 = rnm(vec2(perm00, pi.z)).rgb * 4.0 - 1.0;\n    float n000 = dot(grad000, pf);\n    vec3  grad001 = rnm(vec2(perm00, pi.z + permTexUnit)).rgb * 4.0 - 1.0;\n    float n001 = dot(grad001, pf - vec3(0.0, 0.0, 1.0));\n\n    // Noise contributions from (x=0, y=1), z=0 and z=1\n    float perm01 = rnm(pi.xy + vec2(0.0, permTexUnit)).a ;\n    vec3  grad010 = rnm(vec2(perm01, pi.z)).rgb * 4.0 - 1.0;\n    float n010 = dot(grad010, pf - vec3(0.0, 1.0, 0.0));\n    vec3  grad011 = rnm(vec2(perm01, pi.z + permTexUnit)).rgb * 4.0 - 1.0;\n    float n011 = dot(grad011, pf - vec3(0.0, 1.0, 1.0));\n\n    // Noise contributions from (x=1, y=0), z=0 and z=1\n    float perm10 = rnm(pi.xy + vec2(permTexUnit, 0.0)).a ;\n    vec3  grad100 = rnm(vec2(perm10, pi.z)).rgb * 4.0 - 1.0;\n    float n100 = dot(grad100, pf - vec3(1.0, 0.0, 0.0));\n    vec3  grad101 = rnm(vec2(perm10, pi.z + permTexUnit)).rgb * 4.0 - 1.0;\n    float n101 = dot(grad101, pf - vec3(1.0, 0.0, 1.0));\n\n    // Noise contributions from (x=1, y=1), z=0 and z=1\n    float perm11 = rnm(pi.xy + vec2(permTexUnit, permTexUnit)).a ;\n    vec3  grad110 = rnm(vec2(perm11, pi.z)).rgb * 4.0 - 1.0;\n    float n110 = dot(grad110, pf - vec3(1.0, 1.0, 0.0));\n    vec3  grad111 = rnm(vec2(perm11, pi.z + permTexUnit)).rgb * 4.0 - 1.0;\n    float n111 = dot(grad111, pf - vec3(1.0, 1.0, 1.0));\n\n    // Blend contributions along x\n    vec4 n_x = mix(vec4(n000, n001, n010, n011), vec4(n100, n101, n110, n111), fade(pf.x));\n\n    // Blend contributions along y\n    vec2 n_xy = mix(n_x.xy, n_x.zw, fade(pf.y));\n\n    // Blend contributions along z\n    float n_xyz = mix(n_xy.x, n_xy.y, fade(pf.z));\n\n    // We're done, return the final noise value.\n    return n_xyz;\n}\n\n//2d coordinate orientation thing\nvec2 coordRot(in vec2 tc, in float angle)\n{\n    float aspect = width/height;\n    float rotX = ((tc.x*2.0-1.0)*aspect*cos(angle)) - ((tc.y*2.0-1.0)*sin(angle));\n    float rotY = ((tc.y*2.0-1.0)*cos(angle)) + ((tc.x*2.0-1.0)*aspect*sin(angle));\n    rotX = ((rotX/aspect)*0.5+0.5);\n    rotY = rotY*0.5+0.5;\n    return vec2(rotX,rotY);\n}\n\n\nhighp float rand(vec2 co)\n{\n    highp float a = 12.9898;\n    highp float b = 78.233;\n    highp float c = 43758.5453;\n    highp float dt= dot(co.xy ,vec2(a,b));\n    highp float sn= mod(dt,3.14);\n    return fract(sin(sn) * c);\n}\n\n//good for large clumps of smooth looking noise, but too repetitive\n//for small grains\nfloat fastNoise(vec2 n) {\n\tconst vec2 d = vec2(0.0, 1.0);\n\tvec2 b = floor(n), f = smoothstep(vec2(0.0), vec2(1.0), fract(n));\n\treturn mix(mix(rand(b), rand(b + d.yx ), f.x), mix(rand(b + d.xy ), rand(b + d.yy ), f.x), f.y);\n}\n\n\n\nvoid main( void ) {\n\n\tvec2 position = vUv;\n\n\t\n\t//float c = grain(position, 1.0);\n\tfloat c = 1.0;\n\tvec3 color = vec3(c);\n\t\n\tvec2 texCoord = position.st;\n\t\n\t\n\t\n\tvec3 rotOffset = vec3(1.425,3.892,5.835); //rotation offset values  \n\tvec2 rotCoordsR = coordRot(texCoord, anim+rotOffset.x);\n\tvec3 noise = vec3(pnoise3D(vec3(rotCoordsR*vec2(width/grainsize,height/grainsize),0.0)));\n\t\n\tif (colored)\n\t{\n\t\tvec2 rotCoordsG = coordRot(texCoord,anim+ rotOffset.y);\n\t\tvec2 rotCoordsB = coordRot(texCoord,anim+ rotOffset.z);\n\t\t\n\t\tnoise.g = mix(noise.r,pnoise3D(vec3(rotCoordsG*vec2(width/grainsize,height/grainsize),1.0)),coloramount);\n\t\tnoise.b = mix(noise.r,pnoise3D(vec3(rotCoordsB*vec2(width/grainsize,height/grainsize),2.0)),coloramount);\n\t}\n\n\n    vec4 diffuse = texture2D(texture, vUv);\n    vec3 col = diffuse.rgb;\n    \n\n\tcolor = noise;\n\t//constant moving burn\n    color += vec3( fastNoise(texCoord*sin(timer*0.1)*3.0 + fastNoise(timer*0.4+texCoord*2.0)) )*0.2;\n    \n\t\n    vec3 lumcoeff = vec3(0.299,0.587,0.114);\n    float luminance = mix(0.0,dot(col, lumcoeff),lumamount);\n    float lum = smoothstep(0.2,0.0,luminance);\n    lum += luminance;\n\n    color = mix(color,vec3(0.0),pow(lum,4.0));\t\n    col += color*grainamount;\n    \n    col = mix(col, BlendSoftLight(col, color), grainamount );\n\n    \n    //large occasional burns\n    float specs = fastNoise(texCoord*(10.0+sin(timer)*5.0) + fastNoise(timer+texCoord*50.0) );\n    col -= vec3( smoothstep(0.955, 0.96, specs*sin(timer*4.0)  ) )*0.05;   \n    specs = fastNoise(texCoord*1.0*(10.0+sin(timer)*5.0) - fastNoise(timer+texCoord*40.0) );\n    col -= (1.-vec3( smoothstep(0.99, 0.96, (specs)*(sin(cos(timer)*4.0)/2.+0.5)) ))*0.07;\n    \n    // // //this is really crappy and should be revisited...\n    col -= clamp( 0.1*vec3( smoothstep(0.000001, 0.0000, rand(texCoord.xx*timer) ) * (abs(cos(timer)*sin(timer*1.5))-0.5) ), 0.0, 1.0 );\n\n\n\n    // col = color;\n    //col = color*grainamount;\n    // col = col+color*grainamount;\n\n\tgl_FragColor = vec4( col, diffuse.a );\n}",
};
},{}],5:[function(require,module,exports){
var glslify = require("glslify");
module.exports = require("glslify/simple-adapter.js")("\n#define GLSLIFY 1\n\nvarying vec2 vUv;\nvarying vec2 vCanvasUv;\nvoid main() {\n  vUv = uv;\n  vCanvasUv = uv;\n  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n}", "\n#define GLSLIFY 1\n\nuniform float timer;\nconst float permTexUnit = 1.0 / 256.0;\nconst float permTexUnitHalf = 0.5 / 256.0;\nuniform float grainamount;\nuniform bool colored;\nuniform float coloramount;\nuniform float grainsize;\nuniform float lumamount;\nuniform float filterStrength;\nvarying vec2 vUv;\nvarying vec2 vCanvasUv;\nuniform vec2 resolution;\nuniform sampler2D texture;\nuniform float k, kcube, scale, dispersion, blurAmount;\nuniform bool blurEnabled;\nuniform float scratches;\nuniform float burn;\n#define LOOKUP_FILTER\n\n#define LUT_INVERT\n\nvec4 b_x_lookup(in vec4 textureColor, in sampler2D lookupTable) {\n  \n  #ifndef LUT_NO_CLAMP\n  textureColor = clamp(textureColor, 0.0, 1.0);\n  #endif\n  mediump float blueColor = textureColor.b * 63.0;\n  mediump vec2 quad1;\n  quad1.y = floor(floor(blueColor) / 8.0);\n  quad1.x = floor(blueColor) - (quad1.y * 8.0);\n  mediump vec2 quad2;\n  quad2.y = floor(ceil(blueColor) / 8.0);\n  quad2.x = ceil(blueColor) - (quad2.y * 8.0);\n  highp vec2 texPos1;\n  texPos1.x = (quad1.x * 0.125) + 0.5 / 512.0 + ((0.125 - 1.0 / 512.0) * textureColor.r);\n  texPos1.y = (quad1.y * 0.125) + 0.5 / 512.0 + ((0.125 - 1.0 / 512.0) * textureColor.g);\n  #ifdef LUT_INVERT\n  texPos1.y = 1.0 - texPos1.y;\n  #endif\n  highp vec2 texPos2;\n  texPos2.x = (quad2.x * 0.125) + 0.5 / 512.0 + ((0.125 - 1.0 / 512.0) * textureColor.r);\n  texPos2.y = (quad2.y * 0.125) + 0.5 / 512.0 + ((0.125 - 1.0 / 512.0) * textureColor.g);\n  #ifdef LUT_INVERT\n  texPos2.y = 1.0 - texPos2.y;\n  #endif\n  lowp vec4 newColor1 = texture2D(lookupTable, texPos1);\n  lowp vec4 newColor2 = texture2D(lookupTable, texPos2);\n  lowp vec4 newColor = mix(newColor1, newColor2, fract(blueColor));\n  return newColor;\n}\nuniform sampler2D lookupTexture;\nconst float vignette_size = 1.1;\nconst float tolerance = 0.7;\nfloat width = resolution.x;\nfloat height = resolution.y;\nvec2 rand(vec2 co) {\n  float noise1 = (fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453));\n  float noise2 = (fract(sin(dot(co, vec2(12.9898, 78.233) * 2.0)) * 43758.5453));\n  return clamp(vec2(noise1, noise2), 0.0, 1.0);\n}\nhighp float hash(vec2 co) {\n  highp float a = 12.9898;\n  highp float b = 78.233;\n  highp float c = 43758.5453;\n  highp float dt = dot(co.xy, vec2(a, b));\n  highp float sn = mod(dt, 3.14);\n  return fract(sin(sn) * c);\n}\nvec3 blur(vec2 coords) {\n  vec2 noise = rand(vUv.xy);\n  float tolerance = 0.2;\n  float vignette_size = 0.5;\n  vec2 powers = pow(abs(vec2(vCanvasUv.s - 0.5, vCanvasUv.t - 0.5)), vec2(2.0));\n  float radiusSqrd = pow(vignette_size, 2.0);\n  float gradient = smoothstep(radiusSqrd - tolerance, radiusSqrd + tolerance, powers.x + powers.y);\n  vec4 col = vec4(0.0);\n  float X1 = coords.x + blurAmount * noise.x * 0.004 * gradient;\n  float Y1 = coords.y + blurAmount * noise.y * 0.004 * gradient;\n  float X2 = coords.x - blurAmount * noise.x * 0.004 * gradient;\n  float Y2 = coords.y - blurAmount * noise.y * 0.004 * gradient;\n  float invX1 = coords.x + blurAmount * ((1.0 - noise.x) * 0.004) * (gradient * 0.5);\n  float invY1 = coords.y + blurAmount * ((1.0 - noise.y) * 0.004) * (gradient * 0.5);\n  float invX2 = coords.x - blurAmount * ((1.0 - noise.x) * 0.004) * (gradient * 0.5);\n  float invY2 = coords.y - blurAmount * ((1.0 - noise.y) * 0.004) * (gradient * 0.5);\n  col += texture2D(texture, vec2(X1, Y1)) * 0.1;\n  col += texture2D(texture, vec2(X2, Y2)) * 0.1;\n  col += texture2D(texture, vec2(X1, Y2)) * 0.1;\n  col += texture2D(texture, vec2(X2, Y1)) * 0.1;\n  col += texture2D(texture, vec2(invX1, invY1)) * 0.15;\n  col += texture2D(texture, vec2(invX2, invY2)) * 0.15;\n  col += texture2D(texture, vec2(invX1, invY2)) * 0.15;\n  col += texture2D(texture, vec2(invX2, invY1)) * 0.15;\n  return col.rgb;\n}\nvec4 rnm(in vec2 tc) {\n  float noise = sin(dot(tc + vec2(timer, timer), vec2(12.9898, 78.233))) * 43758.5453;\n  float noiseR = fract(noise) * 2.0 - 1.0;\n  float noiseG = fract(noise * 1.2154) * 2.0 - 1.0;\n  float noiseB = fract(noise * 1.3453) * 2.0 - 1.0;\n  float noiseA = fract(noise * 1.3647) * 2.0 - 1.0;\n  return vec4(noiseR, noiseG, noiseB, noiseA);\n}\nfloat fade(in float t) {\n  return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);\n}\nfloat pnoise3D(in vec3 p) {\n  vec3 pi = permTexUnit * floor(p) + permTexUnitHalf;\n  vec3 pf = fract(p);\n  float perm00 = rnm(pi.xy).a;\n  vec3 grad000 = rnm(vec2(perm00, pi.z)).rgb * 4.0 - 1.0;\n  float n000 = dot(grad000, pf);\n  vec3 grad001 = rnm(vec2(perm00, pi.z + permTexUnit)).rgb * 4.0 - 1.0;\n  float n001 = dot(grad001, pf - vec3(0.0, 0.0, 1.0));\n  float perm01 = rnm(pi.xy + vec2(0.0, permTexUnit)).a;\n  vec3 grad010 = rnm(vec2(perm01, pi.z)).rgb * 4.0 - 1.0;\n  float n010 = dot(grad010, pf - vec3(0.0, 1.0, 0.0));\n  vec3 grad011 = rnm(vec2(perm01, pi.z + permTexUnit)).rgb * 4.0 - 1.0;\n  float n011 = dot(grad011, pf - vec3(0.0, 1.0, 1.0));\n  float perm10 = rnm(pi.xy + vec2(permTexUnit, 0.0)).a;\n  vec3 grad100 = rnm(vec2(perm10, pi.z)).rgb * 4.0 - 1.0;\n  float n100 = dot(grad100, pf - vec3(1.0, 0.0, 0.0));\n  vec3 grad101 = rnm(vec2(perm10, pi.z + permTexUnit)).rgb * 4.0 - 1.0;\n  float n101 = dot(grad101, pf - vec3(1.0, 0.0, 1.0));\n  float perm11 = rnm(pi.xy + vec2(permTexUnit, permTexUnit)).a;\n  vec3 grad110 = rnm(vec2(perm11, pi.z)).rgb * 4.0 - 1.0;\n  float n110 = dot(grad110, pf - vec3(1.0, 1.0, 0.0));\n  vec3 grad111 = rnm(vec2(perm11, pi.z + permTexUnit)).rgb * 4.0 - 1.0;\n  float n111 = dot(grad111, pf - vec3(1.0, 1.0, 1.0));\n  vec4 n_x = mix(vec4(n000, n001, n010, n011), vec4(n100, n101, n110, n111), fade(pf.x));\n  vec2 n_xy = mix(n_x.xy, n_x.zw, fade(pf.y));\n  float n_xyz = mix(n_xy.x, n_xy.y, fade(pf.z));\n  return n_xyz;\n}\nvec2 coordRot(in vec2 tc, in float angle) {\n  float aspect = width / height;\n  float rotX = ((tc.x * 2.0 - 1.0) * aspect * cos(angle)) - ((tc.y * 2.0 - 1.0) * sin(angle));\n  float rotY = ((tc.y * 2.0 - 1.0) * cos(angle)) + ((tc.x * 2.0 - 1.0) * aspect * sin(angle));\n  rotX = ((rotX / aspect) * 0.5 + 0.5);\n  rotY = rotY * 0.5 + 0.5;\n  return vec2(rotX, rotY);\n}\nfloat fastNoise(vec2 n) {\n  const vec2 d = vec2(0.0, 1.0);\n  vec2 b = floor(n), f = smoothstep(vec2(0.0), vec2(1.0), fract(n));\n  return mix(mix(hash(b), hash(b + d.yx), f.x), mix(hash(b + d.xy), hash(b + d.yy), f.x), f.y);\n}\nvoid main(void) {\n  vec3 eta = vec3(1.0 + dispersion * 0.9, 1.0 + dispersion * 0.6, 1.0 + dispersion * 0.3);\n  vec2 texcoord = vUv;\n  vec2 cancoord = vCanvasUv;\n  float r2 = (cancoord.x - 0.5) * (cancoord.x - 0.5) + (cancoord.y - 0.5) * (cancoord.y - 0.5);\n  float f = 0.0;\n  if(kcube == 0.0) {\n    f = 1.0 + r2 * k;\n  } else {\n    f = 1.0 + r2 * (k + kcube * sqrt(r2));\n  }\n  vec2 rCoords = (f * eta.r) * scale * (texcoord.xy - 0.5) + 0.5;\n  vec2 gCoords = (f * eta.g) * scale * (texcoord.xy - 0.5) + 0.5;\n  vec2 bCoords = (f * eta.b) * scale * (texcoord.xy - 0.5) + 0.5;\n  vec3 inputDistort = vec3(0.0);\n  inputDistort.r = texture2D(texture, rCoords).r;\n  inputDistort.g = texture2D(texture, gCoords).g;\n  inputDistort.b = texture2D(texture, bCoords).b;\n  if(blurEnabled) {\n    inputDistort.r = blur(rCoords).r;\n    inputDistort.g = blur(gCoords).g;\n    inputDistort.b = blur(bCoords).b;\n  }\n  gl_FragColor = vec4(inputDistort.r, inputDistort.g, inputDistort.b, 1.0);\n  float aspectratio = width / height;\n  vec2 powers = pow(abs(vec2((vUv.s - 0.5) * aspectratio, vUv.t - 0.5)), vec2(2.0));\n  float radiusSqrd = pow(vignette_size, 2.0);\n  float gradient = smoothstep(radiusSqrd - tolerance, radiusSqrd + tolerance, powers.x + powers.y);\n  gl_FragColor = mix(gl_FragColor, vec4(0.0), gradient);\n  vec2 texCoord = vUv.st;\n  vec3 rotOffset = vec3(1.425, 3.892, 5.835);\n  vec2 rotCoordsR = coordRot(texCoord, timer + rotOffset.x);\n  vec3 noise = vec3(pnoise3D(vec3(rotCoordsR * vec2(width / grainsize, height / grainsize), 0.0)));\n  if(colored) {\n    vec2 rotCoordsG = coordRot(texCoord, timer + rotOffset.y);\n    vec2 rotCoordsB = coordRot(texCoord, timer + rotOffset.z);\n    noise.g = mix(noise.r, pnoise3D(vec3(rotCoordsG * vec2(width / grainsize, height / grainsize), 1.0)), coloramount);\n    noise.b = mix(noise.r, pnoise3D(vec3(rotCoordsB * vec2(width / grainsize, height / grainsize), 2.0)), coloramount);\n  }\n  noise += vec3(smoothstep(0.0, 0.6, fastNoise(texCoord * sin(timer * 0.1) * 5.0 + fastNoise(timer * 0.4 + texCoord * 2.0)))) * burn;\n  vec3 col = gl_FragColor.rgb;\n  vec3 lumcoeff = vec3(0.299, 0.587, 0.114);\n  float luminance = mix(0.0, dot(col, lumcoeff), lumamount);\n  float lum = smoothstep(0.2, 0.0, luminance);\n  lum += luminance;\n  noise = mix(noise, vec3(0.0), pow(lum, 4.0));\n  col = col + noise * grainamount;\n  if(scratches > 0.0001) {\n    float specs = fastNoise(texCoord * (10.0 + sin(timer) * 5.0) + fastNoise(timer + texCoord * 50.0));\n    col -= vec3(smoothstep(0.955, 0.96, specs * sin(timer * 4.0))) * scratches * 0.5;\n    specs = fastNoise(texCoord * 1.0 * (10.0 + sin(timer) * 5.0) - fastNoise(timer + texCoord * 40.0));\n    col -= (1. - vec3(smoothstep(0.99, 0.96, (specs) * (sin(cos(timer) * 4.0) / 2. + 0.5)))) * scratches * 0.7;\n    col -= clamp(scratches * vec3(smoothstep(0.000001, 0.0000, hash(texCoord.xx * timer)) * (abs(cos(timer) * sin(timer * 1.5)) - 0.5)), 0.0, 1.0);\n  }\n  gl_FragColor = vec4(col, 1.0);\n  #ifdef LOOKUP_FILTER\n  lowp vec4 newColor = b_x_lookup(gl_FragColor, lookupTexture);\n  gl_FragColor.rgb = mix(gl_FragColor.rgb, newColor.rgb, filterStrength);\n  #endif\n  \n}", [{"name":"timer","type":"float"},{"name":"grainamount","type":"float"},{"name":"colored","type":"bool"},{"name":"coloramount","type":"float"},{"name":"grainsize","type":"float"},{"name":"lumamount","type":"float"},{"name":"filterStrength","type":"float"},{"name":"resolution","type":"vec2"},{"name":"texture","type":"sampler2D"},{"name":"k","type":"float"},{"name":"kcube","type":"float"},{"name":"scale","type":"float"},{"name":"dispersion","type":"float"},{"name":"blurAmount","type":"float"},{"name":"blurEnabled","type":"bool"},{"name":"scratches","type":"float"},{"name":"burn","type":"float"},{"name":"lookupTexture","type":"sampler2D"}], []);
},{"glslify":7,"glslify/simple-adapter.js":8}],6:[function(require,module,exports){
/*!
  * domready (c) Dustin Diaz 2014 - License MIT
  */
!function (name, definition) {

  if (typeof module != 'undefined') module.exports = definition()
  else if (typeof define == 'function' && typeof define.amd == 'object') define(definition)
  else this[name] = definition()

}('domready', function () {

  var fns = [], listener
    , doc = document
    , domContentLoaded = 'DOMContentLoaded'
    , loaded = /^loaded|^i|^c/.test(doc.readyState)

  if (!loaded)
  doc.addEventListener(domContentLoaded, listener = function () {
    doc.removeEventListener(domContentLoaded, listener)
    loaded = 1
    while (listener = fns.shift()) listener()
  })

  return function (fn) {
    loaded ? fn() : fns.push(fn)
  }

});

},{}],7:[function(require,module,exports){
module.exports = noop

function noop() {
  throw new Error(
      'You should bundle your code ' +
      'using `glslify` as a transform.'
  )
}

},{}],8:[function(require,module,exports){
module.exports = programify

function programify(vertex, fragment, uniforms, attributes) {
  return {
    vertex: vertex, 
    fragment: fragment,
    uniforms: uniforms, 
    attributes: attributes
  };
}

},{}],9:[function(require,module,exports){
/*
 * raf.js
 * https://github.com/ngryman/raf.js
 *
 * original requestAnimationFrame polyfill by Erik Möller
 * inspired from paul_irish gist and post
 *
 * Copyright (c) 2013 ngryman
 * Licensed under the MIT license.
 */

(function(window) {
	var lastTime = 0,
		vendors = ['webkit', 'moz'],
		requestAnimationFrame = window.requestAnimationFrame,
		cancelAnimationFrame = window.cancelAnimationFrame,
		i = vendors.length;

	// try to un-prefix existing raf
	while (--i >= 0 && !requestAnimationFrame) {
		requestAnimationFrame = window[vendors[i] + 'RequestAnimationFrame'];
		cancelAnimationFrame = window[vendors[i] + 'CancelAnimationFrame'];
	}

	// polyfill with setTimeout fallback
	// heavily inspired from @darius gist mod: https://gist.github.com/paulirish/1579671#comment-837945
	if (!requestAnimationFrame || !cancelAnimationFrame) {
		requestAnimationFrame = function(callback) {
			var now = +new Date(), nextTime = Math.max(lastTime + 16, now);
			return setTimeout(function() {
				callback(lastTime = nextTime);
			}, nextTime - now);
		};

		cancelAnimationFrame = clearTimeout;
	}

	// export to window
	window.requestAnimationFrame = requestAnimationFrame;
	window.cancelAnimationFrame = cancelAnimationFrame;
}(window));

},{}]},{},[2])