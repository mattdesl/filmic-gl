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
        vertexShader: fxaaShader.vertexShader,
        fragmentShader: fxaaShader.fragmentShader
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
        vertexShader: lensShader.vertexShader,
        fragmentShader: lensShader.fragmentShader
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
},{"./shaders/fxaa":3,"./shaders/grain":4,"./shaders/lens":5,"domready":6,"raf.js":7,"stats":1}],3:[function(require,module,exports){


module.exports = {
    vertexShader: "varying vec2 vUv;\n\nvarying vec2 v_rgbNW;\nvarying vec2 v_rgbNE;\nvarying vec2 v_rgbSW;\nvarying vec2 v_rgbSE;\nvarying vec2 v_rgbM;\n\nuniform vec2 resolution;\n\nvoid main() {\n\tvUv = uv;  \n\tvec2 inverseVP = vec2(1.0 / resolution.x, 1.0 / resolution.y);\n\tvec2 fragCoord = uv * resolution;\n\tv_rgbNW = (fragCoord + vec2(-1.0, -1.0)) * inverseVP;\n\tv_rgbNE = (fragCoord + vec2(1.0, -1.0)) * inverseVP;\n\tv_rgbSW = (fragCoord + vec2(-1.0, 1.0)) * inverseVP;\n\tv_rgbSE = (fragCoord + vec2(1.0, 1.0)) * inverseVP;\n\tv_rgbM = vec2(fragCoord * inverseVP);\n\tgl_Position = projectionMatrix *\n\t            modelViewMatrix *\n\t            vec4(position,1.0);\n}\n",
    fragmentShader: "varying vec2 vUv;\n\nvarying mediump vec2 v_rgbNW;\nvarying mediump vec2 v_rgbNE;\nvarying mediump vec2 v_rgbSW;\nvarying mediump vec2 v_rgbSE;\nvarying mediump vec2 v_rgbM;\n\nuniform vec2 resolution;\nuniform sampler2D texture;\n\n\n/* Basic FXAA implementation based on the code on geeks3d.com with the\n   modification that the texture2DLod stuff was removed since it's\n   unsupported by WebGL. */\n\n#define FXAA_REDUCE_MIN   (1.0/ 128.0)\n#define FXAA_REDUCE_MUL   (1.0 / 8.0)\n#define FXAA_SPAN_MAX     8.0\n\n\nvoid main(void)\n{\n    mediump vec2 fragCoord = vUv*resolution; \n\n    vec4 color;\n    mediump vec2 inverseVP = vec2(1.0 / resolution.x, 1.0 / resolution.y);\n    vec3 rgbNW = texture2D(texture, v_rgbNW).xyz;\n    vec3 rgbNE = texture2D(texture, v_rgbNE).xyz;\n    vec3 rgbSW = texture2D(texture, v_rgbSW).xyz;\n    vec3 rgbSE = texture2D(texture, v_rgbSE).xyz;\n    vec3 rgbM  = texture2D(texture, v_rgbM).xyz;\n    vec3 luma = vec3(0.299, 0.587, 0.114);\n    float lumaNW = dot(rgbNW, luma);\n    float lumaNE = dot(rgbNE, luma);\n    float lumaSW = dot(rgbSW, luma);\n    float lumaSE = dot(rgbSE, luma);\n    float lumaM  = dot(rgbM,  luma);\n    float lumaMin = min(lumaM, min(min(lumaNW, lumaNE), min(lumaSW, lumaSE)));\n    float lumaMax = max(lumaM, max(max(lumaNW, lumaNE), max(lumaSW, lumaSE)));\n    \n    mediump vec2 dir;\n    dir.x = -((lumaNW + lumaNE) - (lumaSW + lumaSE));\n    dir.y =  ((lumaNW + lumaSW) - (lumaNE + lumaSE));\n    \n    float dirReduce = max((lumaNW + lumaNE + lumaSW + lumaSE) *\n                          (0.25 * FXAA_REDUCE_MUL), FXAA_REDUCE_MIN);\n    \n    float rcpDirMin = 1.0 / (min(abs(dir.x), abs(dir.y)) + dirReduce);\n    dir = min(vec2(FXAA_SPAN_MAX, FXAA_SPAN_MAX),\n              max(vec2(-FXAA_SPAN_MAX, -FXAA_SPAN_MAX),\n              dir * rcpDirMin)) * inverseVP;\n    \n    vec3 rgbA = 0.5 * (\n        texture2D(texture, fragCoord * inverseVP + dir * (1.0 / 3.0 - 0.5)).xyz +\n        texture2D(texture, fragCoord * inverseVP + dir * (2.0 / 3.0 - 0.5)).xyz);\n    vec3 rgbB = rgbA * 0.5 + 0.25 * (\n        texture2D(texture, fragCoord * inverseVP + dir * -0.5).xyz +\n        texture2D(texture, fragCoord * inverseVP + dir * 0.5).xyz);\n\n    float lumaB = dot(rgbB, luma);\n    if ((lumaB < lumaMin) || (lumaB > lumaMax))\n        color = vec4(rgbA, 1.0);\n    else\n        color = vec4(rgbB, 1.0);\n    gl_FragColor = color;\n}\n",
};
},{}],4:[function(require,module,exports){


module.exports = {
    vertexShader: "varying vec2 vUv;\nvarying vec2 vCanvasUv;\n\nvoid main() {\n  vUv = uv;  \n  vCanvasUv = uv;\n  gl_Position = projectionMatrix *\n                modelViewMatrix *\n                vec4(position,1.0);\n}\n",
    fragmentShader: "#ifdef GL_ES\nprecision mediump float;\n#endif\n\n\n/*\nmaking it look more like actual film grain:\n- a constant undulating \"burn\"\n- occasional specks flashing in semi-random looking places\n\ntodo:\n- revisit horizontal scratches.. kinda hack right now\n- hairline specks\n- grain animation should be independent of constant burn animation\n\nUsing Gorilla Grain's free \"Clean\" overlay as a reference:\nhttp://gorillagrain.com/features\n\nHow it might work in practice in a game:\n- Use two shaders; one for the \"grain\" (which is pretty expensive)\n  This only needs to be updated once every 40-50ms\n- Another for the constantly moving grain and burns/scratches, which is relatively cheaper\n- A move advanced system might add scratches/etc using textures. \n\n@mattdesl\n*/\n\n/*\nFilm Grain post-process shader v1.1 \nMartins Upitis (martinsh) devlog-martinsh.blogspot.com\n2013\n\n--------------------------\nThis work is licensed under a Creative Commons Attribution 3.0 Unported License.\nSo you are free to share, modify and adapt it for your needs, and even use it for commercial use.\nI would also love to hear about a project you are using it.\n\nHave fun,\nMartins\n--------------------------\n\nPerlin noise shader by toneburst:\nhttp://machinesdontcare.wordpress.com/2009/06/25/3d-perlin-noise-sphere-vertex-shader-sourcecode/\n*/\n\nvarying vec2 vUv;\nuniform sampler2D texture;\n\nuniform float timer;\nuniform vec2 resolution;\n\nfloat width = resolution.x;\nfloat height = resolution.y;\n\nconst float permTexUnit = 1.0/256.0;        // Perm texture texel-size\nconst float permTexUnitHalf = 0.5/256.0;    // Half perm texture texel-size\n\nuniform float grainamount; //grain amount\nuniform bool colored; //colored noise?\nuniform float coloramount;\nuniform float grainsize; //grain particle size (1.5 - 2.5)\nuniform float lumamount; //\n\n//the grain animation\nfloat anim = timer; //too fast right now.. should be more like 41.66 ms\n\n#define Blend(base, blend, funcf)       vec3(funcf(base.r, blend.r), funcf(base.g, blend.g), funcf(base.b, blend.b))\n#define BlendSoftLightf(base, blend)    ((blend < 0.5) ? (2.0 * base * blend + base * base * (1.0 - 2.0 * blend)) : (sqrt(base) * (2.0 * blend - 1.0) + 2.0 * base * (1.0 - blend)))\n#define BlendLightenf(base, blend)      max(blend, base)\n\n#define BlendSoftLight(base, blend)     Blend(base, blend, BlendSoftLightf)\n#define BlendLighten                    BlendLightenf\n\n//a random texture generator, but you can also use a pre-computed perturbation texture\nvec4 rnm(in vec2 tc) \n{\n    float noise =  sin(dot(tc,vec2(anim)+vec2(12.9898,78.233))) * 43758.5453;\n    float noiseR =  fract(noise)*2.0-1.0;\n    float noiseG =  fract(noise*1.2154)*2.0-1.0; \n    float noiseB =  fract(noise*1.3453)*2.0-1.0;\n    float noiseA =  fract(noise*1.3647)*2.0-1.0;\n    \n    return vec4(noiseR,noiseG,noiseB,noiseA);\n}\n\nfloat fade(in float t) {\n    return t*t*t*(t*(t*6.0-15.0)+10.0);\n}\n\nfloat pnoise3D(in vec3 p)\n{\n    vec3 pi = permTexUnit*floor(p)+permTexUnitHalf; // Integer part, scaled so +1 moves permTexUnit texel\n    // and offset 1/2 texel to sample texel centers\n    vec3 pf = fract(p);     // Fractional part for interpolation\n\n    // Noise contributions from (x=0, y=0), z=0 and z=1\n    float perm00 = rnm(pi.xy).a ;\n    vec3  grad000 = rnm(vec2(perm00, pi.z)).rgb * 4.0 - 1.0;\n    float n000 = dot(grad000, pf);\n    vec3  grad001 = rnm(vec2(perm00, pi.z + permTexUnit)).rgb * 4.0 - 1.0;\n    float n001 = dot(grad001, pf - vec3(0.0, 0.0, 1.0));\n\n    // Noise contributions from (x=0, y=1), z=0 and z=1\n    float perm01 = rnm(pi.xy + vec2(0.0, permTexUnit)).a ;\n    vec3  grad010 = rnm(vec2(perm01, pi.z)).rgb * 4.0 - 1.0;\n    float n010 = dot(grad010, pf - vec3(0.0, 1.0, 0.0));\n    vec3  grad011 = rnm(vec2(perm01, pi.z + permTexUnit)).rgb * 4.0 - 1.0;\n    float n011 = dot(grad011, pf - vec3(0.0, 1.0, 1.0));\n\n    // Noise contributions from (x=1, y=0), z=0 and z=1\n    float perm10 = rnm(pi.xy + vec2(permTexUnit, 0.0)).a ;\n    vec3  grad100 = rnm(vec2(perm10, pi.z)).rgb * 4.0 - 1.0;\n    float n100 = dot(grad100, pf - vec3(1.0, 0.0, 0.0));\n    vec3  grad101 = rnm(vec2(perm10, pi.z + permTexUnit)).rgb * 4.0 - 1.0;\n    float n101 = dot(grad101, pf - vec3(1.0, 0.0, 1.0));\n\n    // Noise contributions from (x=1, y=1), z=0 and z=1\n    float perm11 = rnm(pi.xy + vec2(permTexUnit, permTexUnit)).a ;\n    vec3  grad110 = rnm(vec2(perm11, pi.z)).rgb * 4.0 - 1.0;\n    float n110 = dot(grad110, pf - vec3(1.0, 1.0, 0.0));\n    vec3  grad111 = rnm(vec2(perm11, pi.z + permTexUnit)).rgb * 4.0 - 1.0;\n    float n111 = dot(grad111, pf - vec3(1.0, 1.0, 1.0));\n\n    // Blend contributions along x\n    vec4 n_x = mix(vec4(n000, n001, n010, n011), vec4(n100, n101, n110, n111), fade(pf.x));\n\n    // Blend contributions along y\n    vec2 n_xy = mix(n_x.xy, n_x.zw, fade(pf.y));\n\n    // Blend contributions along z\n    float n_xyz = mix(n_xy.x, n_xy.y, fade(pf.z));\n\n    // We're done, return the final noise value.\n    return n_xyz;\n}\n\n//2d coordinate orientation thing\nvec2 coordRot(in vec2 tc, in float angle)\n{\n    float aspect = width/height;\n    float rotX = ((tc.x*2.0-1.0)*aspect*cos(angle)) - ((tc.y*2.0-1.0)*sin(angle));\n    float rotY = ((tc.y*2.0-1.0)*cos(angle)) + ((tc.x*2.0-1.0)*aspect*sin(angle));\n    rotX = ((rotX/aspect)*0.5+0.5);\n    rotY = rotY*0.5+0.5;\n    return vec2(rotX,rotY);\n}\n\n\nhighp float rand(vec2 co)\n{\n    highp float a = 12.9898;\n    highp float b = 78.233;\n    highp float c = 43758.5453;\n    highp float dt= dot(co.xy ,vec2(a,b));\n    highp float sn= mod(dt,3.14);\n    return fract(sin(sn) * c);\n}\n\n//good for large clumps of smooth looking noise, but too repetitive\n//for small grains\nfloat fastNoise(vec2 n) {\n\tconst vec2 d = vec2(0.0, 1.0);\n\tvec2 b = floor(n), f = smoothstep(vec2(0.0), vec2(1.0), fract(n));\n\treturn mix(mix(rand(b), rand(b + d.yx ), f.x), mix(rand(b + d.xy ), rand(b + d.yy ), f.x), f.y);\n}\n\n\n\nvoid main( void ) {\n\n\tvec2 position = vUv;\n\n\t\n\t//float c = grain(position, 1.0);\n\tfloat c = 1.0;\n\tvec3 color = vec3(c);\n\t\n\tvec2 texCoord = position.st;\n\t\n\t\n\t\n\tvec3 rotOffset = vec3(1.425,3.892,5.835); //rotation offset values  \n\tvec2 rotCoordsR = coordRot(texCoord, anim+rotOffset.x);\n\tvec3 noise = vec3(pnoise3D(vec3(rotCoordsR*vec2(width/grainsize,height/grainsize),0.0)));\n\t\n\tif (colored)\n\t{\n\t\tvec2 rotCoordsG = coordRot(texCoord,anim+ rotOffset.y);\n\t\tvec2 rotCoordsB = coordRot(texCoord,anim+ rotOffset.z);\n\t\t\n\t\tnoise.g = mix(noise.r,pnoise3D(vec3(rotCoordsG*vec2(width/grainsize,height/grainsize),1.0)),coloramount);\n\t\tnoise.b = mix(noise.r,pnoise3D(vec3(rotCoordsB*vec2(width/grainsize,height/grainsize),2.0)),coloramount);\n\t}\n\n\n    vec4 diffuse = texture2D(texture, vUv);\n    vec3 col = diffuse.rgb;\n    \n\n\tcolor = noise;\n\t//constant moving burn\n    color += vec3( fastNoise(texCoord*sin(timer*0.1)*3.0 + fastNoise(timer*0.4+texCoord*2.0)) )*0.2;\n    \n\t\n    vec3 lumcoeff = vec3(0.299,0.587,0.114);\n    float luminance = mix(0.0,dot(col, lumcoeff),lumamount);\n    float lum = smoothstep(0.2,0.0,luminance);\n    lum += luminance;\n\n    color = mix(color,vec3(0.0),pow(lum,4.0));\t\n    col += color*grainamount;\n    \n    col = mix(col, BlendSoftLight(col, color), grainamount );\n\n    \n    //large occasional burns\n    float specs = fastNoise(texCoord*(10.0+sin(timer)*5.0) + fastNoise(timer+texCoord*50.0) );\n    col -= vec3( smoothstep(0.955, 0.96, specs*sin(timer*4.0)  ) )*0.05;   \n    specs = fastNoise(texCoord*1.0*(10.0+sin(timer)*5.0) - fastNoise(timer+texCoord*40.0) );\n    col -= (1.-vec3( smoothstep(0.99, 0.96, (specs)*(sin(cos(timer)*4.0)/2.+0.5)) ))*0.07;\n    \n    // // //this is really crappy and should be revisited...\n    col -= clamp( 0.1*vec3( smoothstep(0.000001, 0.0000, rand(texCoord.xx*timer) ) * (abs(cos(timer)*sin(timer*1.5))-0.5) ), 0.0, 1.0 );\n\n\n\n    // col = color;\n    //col = color*grainamount;\n    // col = col+color*grainamount;\n\n\tgl_FragColor = vec4( col, diffuse.a );\n}",
};
},{}],5:[function(require,module,exports){


module.exports = {
    vertexShader: "varying vec2 vUv;\nvarying vec2 vCanvasUv;\n\nvoid main() {\n  vUv = uv;  \n  vCanvasUv = uv;\n  gl_Position = projectionMatrix *\n                modelViewMatrix *\n                vec4(position,1.0);\n}\n",
    fragmentShader: "/*\n    Cubic Lens Distortion GLSL Shader\n\n    Original Lens Distortion Algorithm from SSontech (Syntheyes)\n    http://www.ssontech.com/content/lensalg.htm\n\n    r2 = image_aspect*image_aspect*u*u + v*v\n    f = 1 + r2*(k + kcube*sqrt(r2))\n    u' = f*u\n    v' = f*v\n\n    author : Francois Tarlier\n    website : www.francois-tarlier.com/blog/index.php/2009/11/cubic-lens-distortion-shader\n        \n    modified by Martins Upitis  \n*/\n\n/*\nFilm Grain post-process shader v1.1 \nMartins Upitis (martinsh) devlog-martinsh.blogspot.com\n2013\n\n--------------------------\nThis work is licensed under a Creative Commons Attribution 3.0 Unported License.\nSo you are free to share, modify and adapt it for your needs, and even use it for commercial use.\nI would also love to hear about a project you are using it.\n\nHave fun,\nMartins\n--------------------------\n\nPerlin noise shader by toneburst:\nhttp://machinesdontcare.wordpress.com/2009/06/25/3d-perlin-noise-sphere-vertex-shader-sourcecode/\n*/\n\nuniform float timer;\n\nconst float permTexUnit = 1.0/256.0;        // Perm texture texel-size\nconst float permTexUnitHalf = 0.5/256.0;    // Half perm texture texel-size\n\nuniform float grainamount; //grain amount\nuniform bool colored; //colored noise?\nuniform float coloramount;\nuniform float grainsize; //grain particle size (1.5 - 2.5)\nuniform float lumamount; //\nuniform float filterStrength;\n\nvarying vec2 vUv;\nvarying vec2 vCanvasUv;\nuniform vec2 resolution;\nuniform sampler2D texture;\n\nuniform float k, kcube, scale, dispersion, blurAmount; //k = 0.2, kcube = 0.3, scale = 0.9, dispersion = 0.01\nuniform bool blurEnabled;\nuniform float scratches;\nuniform float burn;\n\n#define LOOKUP_FILTER\n\nuniform sampler2D lookupTexture;\n\nconst float vignette_size = 1.1; // vignette size\nconst float tolerance = 0.7; //edge softness\n\n\nfloat width = resolution.x;\nfloat height = resolution.y;\n\nvec2 rand(vec2 co) //needed for fast noise based blurring\n{ //TODO: use a 1D nearest-neighbour texture lookup ? \n    float noise1 =  (fract(sin(dot(co ,vec2(12.9898,78.233))) * 43758.5453));\n    float noise2 =  (fract(sin(dot(co ,vec2(12.9898,78.233)*2.0)) * 43758.5453));\n    return clamp(vec2(noise1,noise2),0.0,1.0);\n}\n\nhighp float hash(vec2 co)\n{\n    highp float a = 12.9898;\n    highp float b = 78.233;\n    highp float c = 43758.5453;\n    highp float dt= dot(co.xy ,vec2(a,b));\n    highp float sn= mod(dt,3.14);\n    return fract(sin(sn) * c);\n}\n\n\nvec3 blur(vec2 coords)\n{ \n    //TODO: the below vignette code can be pulled out of this function and reused\n    vec2 noise = rand(vUv.xy);\n    float tolerance = 0.2;\n    float vignette_size = 0.5;\n    vec2 powers = pow(abs(vec2(vCanvasUv.s - 0.5,vCanvasUv.t - 0.5)),vec2(2.0));\n    float radiusSqrd = pow(vignette_size,2.0);\n    float gradient = smoothstep(radiusSqrd-tolerance, radiusSqrd+tolerance, powers.x+powers.y);\n    \n    vec4 col = vec4(0.0);\n\n    float X1 = coords.x + blurAmount * noise.x*0.004 * gradient;\n    float Y1 = coords.y + blurAmount * noise.y*0.004 * gradient;\n    float X2 = coords.x - blurAmount * noise.x*0.004 * gradient;\n    float Y2 = coords.y - blurAmount * noise.y*0.004 * gradient;\n    \n    float invX1 = coords.x + blurAmount * ((1.0-noise.x)*0.004) * (gradient * 0.5);\n    float invY1 = coords.y + blurAmount * ((1.0-noise.y)*0.004) * (gradient * 0.5);\n    float invX2 = coords.x - blurAmount * ((1.0-noise.x)*0.004) * (gradient * 0.5);\n    float invY2 = coords.y - blurAmount * ((1.0-noise.y)*0.004) * (gradient * 0.5);\n\n    //TODO: optimize the blur --> dependent texture reads and texel centers...\n    col += texture2D(texture, vec2(X1, Y1))*0.1;\n    col += texture2D(texture, vec2(X2, Y2))*0.1;\n    col += texture2D(texture, vec2(X1, Y2))*0.1;\n    col += texture2D(texture, vec2(X2, Y1))*0.1;\n    \n    col += texture2D(texture, vec2(invX1, invY1))*0.15;\n    col += texture2D(texture, vec2(invX2, invY2))*0.15;\n    col += texture2D(texture, vec2(invX1, invY2))*0.15;\n    col += texture2D(texture, vec2(invX2, invY1))*0.15;\n    \n    return col.rgb;\n}\n\n\n//a random texture generator, but you can also use a pre-computed perturbation texture\nvec4 rnm(in vec2 tc) \n{\n    float noise =  sin(dot(tc + vec2(timer,timer),vec2(12.9898,78.233))) * 43758.5453;\n\n    float noiseR =  fract(noise)*2.0-1.0;\n    float noiseG =  fract(noise*1.2154)*2.0-1.0; \n    float noiseB =  fract(noise*1.3453)*2.0-1.0;\n    float noiseA =  fract(noise*1.3647)*2.0-1.0;\n    \n    return vec4(noiseR,noiseG,noiseB,noiseA);\n}\n\nfloat fade(in float t) {\n    return t*t*t*(t*(t*6.0-15.0)+10.0);\n}\n\nfloat pnoise3D(in vec3 p)\n{\n    vec3 pi = permTexUnit*floor(p)+permTexUnitHalf; // Integer part, scaled so +1 moves permTexUnit texel\n    // and offset 1/2 texel to sample texel centers\n    vec3 pf = fract(p);     // Fractional part for interpolation\n\n    // Noise contributions from (x=0, y=0), z=0 and z=1\n    float perm00 = rnm(pi.xy).a ;\n    vec3  grad000 = rnm(vec2(perm00, pi.z)).rgb * 4.0 - 1.0;\n    float n000 = dot(grad000, pf);\n    vec3  grad001 = rnm(vec2(perm00, pi.z + permTexUnit)).rgb * 4.0 - 1.0;\n    float n001 = dot(grad001, pf - vec3(0.0, 0.0, 1.0));\n\n    // Noise contributions from (x=0, y=1), z=0 and z=1\n    float perm01 = rnm(pi.xy + vec2(0.0, permTexUnit)).a ;\n    vec3  grad010 = rnm(vec2(perm01, pi.z)).rgb * 4.0 - 1.0;\n    float n010 = dot(grad010, pf - vec3(0.0, 1.0, 0.0));\n    vec3  grad011 = rnm(vec2(perm01, pi.z + permTexUnit)).rgb * 4.0 - 1.0;\n    float n011 = dot(grad011, pf - vec3(0.0, 1.0, 1.0));\n\n    // Noise contributions from (x=1, y=0), z=0 and z=1\n    float perm10 = rnm(pi.xy + vec2(permTexUnit, 0.0)).a ;\n    vec3  grad100 = rnm(vec2(perm10, pi.z)).rgb * 4.0 - 1.0;\n    float n100 = dot(grad100, pf - vec3(1.0, 0.0, 0.0));\n    vec3  grad101 = rnm(vec2(perm10, pi.z + permTexUnit)).rgb * 4.0 - 1.0;\n    float n101 = dot(grad101, pf - vec3(1.0, 0.0, 1.0));\n\n    // Noise contributions from (x=1, y=1), z=0 and z=1\n    float perm11 = rnm(pi.xy + vec2(permTexUnit, permTexUnit)).a ;\n    vec3  grad110 = rnm(vec2(perm11, pi.z)).rgb * 4.0 - 1.0;\n    float n110 = dot(grad110, pf - vec3(1.0, 1.0, 0.0));\n    vec3  grad111 = rnm(vec2(perm11, pi.z + permTexUnit)).rgb * 4.0 - 1.0;\n    float n111 = dot(grad111, pf - vec3(1.0, 1.0, 1.0));\n\n    // Blend contributions along x\n    vec4 n_x = mix(vec4(n000, n001, n010, n011), vec4(n100, n101, n110, n111), fade(pf.x));\n\n    // Blend contributions along y\n    vec2 n_xy = mix(n_x.xy, n_x.zw, fade(pf.y));\n\n    // Blend contributions along z\n    float n_xyz = mix(n_xy.x, n_xy.y, fade(pf.z));\n\n    // We're done, return the final noise value.\n    return n_xyz;\n}\n\n//2d coordinate orientation thing\nvec2 coordRot(in vec2 tc, in float angle)\n{\n    float aspect = width/height;\n    float rotX = ((tc.x*2.0-1.0)*aspect*cos(angle)) - ((tc.y*2.0-1.0)*sin(angle));\n    float rotY = ((tc.y*2.0-1.0)*cos(angle)) + ((tc.x*2.0-1.0)*aspect*sin(angle));\n    rotX = ((rotX/aspect)*0.5+0.5);\n    rotY = rotY*0.5+0.5;\n    return vec2(rotX,rotY);\n}\n\n\n\n//good for large clumps of smooth looking noise, but too repetitive\n//for small grains\nfloat fastNoise(vec2 n) {\n    const vec2 d = vec2(0.0, 1.0);\n    vec2 b = floor(n), f = smoothstep(vec2(0.0), vec2(1.0), fract(n));\n    return mix(mix(hash(b), hash(b + d.yx ), f.x), mix(hash(b + d.xy ), hash(b + d.yy ), f.x), f.y);\n}\n\n\n\n\n\n\n\nvoid main(void)\n{\n    //index of refraction of each color channel, causing chromatic dispersion\n    vec3 eta = vec3(1.0+dispersion*0.9, 1.0+dispersion*0.6, 1.0+dispersion*0.3);\n    \n    //texture coordinates\n    vec2 texcoord = vUv;\n    \n    //canvas coordinates to get the center of rendered viewport\n    //vec2 cancoord = vUv.st;\n    vec2 cancoord = vCanvasUv;\n\n    float r2 = (cancoord.x-0.5) * (cancoord.x-0.5) + (cancoord.y-0.5) * (cancoord.y-0.5);       \n\n    float f = 0.0;\n\n    //only compute the cubic distortion if necessary\n    \n    if( kcube == 0.0)\n    {\n        f = 1.0 + r2 * k;\n    }else{\n        f = 1.0 + r2 * (k + kcube * sqrt(r2));\n    }\n  \n    \n\n    // get the right pixel for the current position\n    \n    vec2 rCoords = (f*eta.r)*scale*(texcoord.xy-0.5)+0.5;\n    vec2 gCoords = (f*eta.g)*scale*(texcoord.xy-0.5)+0.5;\n    vec2 bCoords = (f*eta.b)*scale*(texcoord.xy-0.5)+0.5;\n\n    vec3 inputDistort = vec3(0.0); \n        \n\n    inputDistort.r = texture2D(texture,rCoords).r;\n    inputDistort.g = texture2D(texture,gCoords).g;\n    inputDistort.b = texture2D(texture,bCoords).b;\n    \n    if (blurEnabled)\n    {\n        inputDistort.r = blur(rCoords).r;\n        inputDistort.g = blur(gCoords).g;\n        inputDistort.b = blur(bCoords).b;\n    }\n    \n    gl_FragColor = vec4(inputDistort.r,inputDistort.g,inputDistort.b,1.0);\n\n        \n    //mix in vignette\n    float aspectratio = width/height;\n    vec2 powers = pow(abs(vec2((vUv.s - 0.5)*aspectratio,vUv.t - 0.5)),vec2(2.0));\n    float radiusSqrd = pow(vignette_size,2.0);\n    float gradient = smoothstep(radiusSqrd-tolerance, radiusSqrd+tolerance, powers.x+powers.y);\n        \n    gl_FragColor = mix(gl_FragColor, vec4(0.0), gradient);\n\n\n    \n    vec2 texCoord = vUv.st;\n    \n    vec3 rotOffset = vec3(1.425,3.892,5.835); //rotation offset values  \n    vec2 rotCoordsR = coordRot(texCoord, timer + rotOffset.x);\n    vec3 noise = vec3(pnoise3D(vec3(rotCoordsR*vec2(width/grainsize,height/grainsize),0.0)));\n    \n\n    if (colored)\n    {\n        vec2 rotCoordsG = coordRot(texCoord, timer + rotOffset.y);\n        vec2 rotCoordsB = coordRot(texCoord, timer + rotOffset.z);\n        noise.g = mix(noise.r,pnoise3D(vec3(rotCoordsG*vec2(width/grainsize,height/grainsize),1.0)),coloramount);\n        noise.b = mix(noise.r,pnoise3D(vec3(rotCoordsB*vec2(width/grainsize,height/grainsize),2.0)),coloramount);\n    }\n\n    // noise = vec3( fastNoise(texCoord*sin(timer*0.1)*3.0 + fastNoise(timer*0.4+texCoord*2.0)) )*burn;\n    noise += vec3( smoothstep(0.0, 0.6, fastNoise(texCoord*sin(timer*0.1)*5.0 + fastNoise(timer*0.4+texCoord*2.0))) )*burn;\n\n    vec3 col = gl_FragColor.rgb;\n    // vec3 col = texture2D(texture, texCoord).rgb;\n\n    //noisiness response curve based on scene luminance\n    vec3 lumcoeff = vec3(0.299,0.587,0.114);\n    float luminance = mix(0.0,dot(col, lumcoeff),lumamount);\n    float lum = smoothstep(0.2,0.0,luminance);\n    lum += luminance;\n\n    noise = mix(noise,vec3(0.0),pow(lum,4.0));\n    col = col+noise*grainamount;\n\n    if (scratches > 0.0001) {\n\n        //large occasional burns\n        float specs = fastNoise(texCoord*(10.0+sin(timer)*5.0) + fastNoise(timer+texCoord*50.0) );\n        col -= vec3( smoothstep(0.955, 0.96, specs*sin(timer*4.0)  ) )*scratches*0.5; //0.05   \n        specs = fastNoise(texCoord*1.0*(10.0+sin(timer)*5.0) - fastNoise(timer+texCoord*40.0) );\n        col -= (1.-vec3( smoothstep(0.99, 0.96, (specs)*(sin(cos(timer)*4.0)/2.+0.5)) ))*scratches*0.7; //0.07\n        \n        // // //this is really crappy and should be revisited...\n        col -= clamp( scratches*vec3( smoothstep(0.000001, 0.0000, hash(texCoord.xx*timer) ) * (abs(cos(timer)*sin(timer*1.5))-0.5) ), 0.0, 1.0 );\n    }\n\n\n\n    gl_FragColor =  vec4(col,1.0);\n\n    //mix in lookup filter\n    #ifdef LOOKUP_FILTER\n        lowp vec4 textureColor = clamp(gl_FragColor,0.0, 1.0);\n        // lowp vec4 textureColor = texture2D(inputImageTexture, textureCoordinate);\n     \n        mediump float blueColor = textureColor.b * 63.0;\n\n        mediump vec2 quad1;\n        quad1.y = floor(floor(blueColor) / 8.0);\n        quad1.x = floor(blueColor) - (quad1.y * 8.0);\n\n        mediump vec2 quad2;\n        quad2.y = floor(ceil(blueColor) / 8.0);\n        quad2.x = ceil(blueColor) - (quad2.y * 8.0);\n\n        highp vec2 texPos1;\n        texPos1.x = (quad1.x * 0.125) + 0.5/512.0 + ((0.125 - 1.0/512.0) * textureColor.r);\n        texPos1.y = (quad1.y * 0.125) + 0.5/512.0 + ((0.125 - 1.0/512.0) * textureColor.g);\n\n        texPos1.y = 1.0-texPos1.y;\n\n        highp vec2 texPos2;\n        texPos2.x = (quad2.x * 0.125) + 0.5/512.0 + ((0.125 - 1.0/512.0) * textureColor.r);\n        texPos2.y = (quad2.y * 0.125) + 0.5/512.0 + ((0.125 - 1.0/512.0) * textureColor.g);\n\n        texPos2.y = 1.0-texPos2.y;\n\n        lowp vec4 newColor1 = texture2D(lookupTexture, texPos1);\n        lowp vec4 newColor2 = texture2D(lookupTexture, texPos2);\n\n        lowp vec4 newColor = mix(newColor1, newColor2, fract(blueColor));\n        gl_FragColor.rgb = mix(gl_FragColor.rgb, newColor.rgb, filterStrength);\n    #endif\n}",
};
},{}],6:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvdXNyL2xvY2FsL2xpYi9ub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9wcm9qZWN0cy9ucG11dGlscy9maWxtaWMtZ2wvYm93ZXJfY29tcG9uZW50cy9zdGF0cy5qcy9zcmMvU3RhdHMuanMiLCIvcHJvamVjdHMvbnBtdXRpbHMvZmlsbWljLWdsL2RlbW9zL21haW4uanMiLCIvcHJvamVjdHMvbnBtdXRpbHMvZmlsbWljLWdsL2RlbW9zL3NoYWRlcnMvZnhhYS5qcyIsIi9wcm9qZWN0cy9ucG11dGlscy9maWxtaWMtZ2wvZGVtb3Mvc2hhZGVycy9ncmFpbi5qcyIsIi9wcm9qZWN0cy9ucG11dGlscy9maWxtaWMtZ2wvZGVtb3Mvc2hhZGVycy9sZW5zLmpzIiwiL3Byb2plY3RzL25wbXV0aWxzL2ZpbG1pYy1nbC9ub2RlX21vZHVsZXMvZG9tcmVhZHkvcmVhZHkuanMiLCIvcHJvamVjdHMvbnBtdXRpbHMvZmlsbWljLWdsL25vZGVfbW9kdWxlcy9yYWYuanMvcmFmLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdFRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiKGZ1bmN0aW9uIChnbG9iYWwpe1xuO19fYnJvd3NlcmlmeV9zaGltX3JlcXVpcmVfXz1yZXF1aXJlOyhmdW5jdGlvbiBicm93c2VyaWZ5U2hpbShtb2R1bGUsIGV4cG9ydHMsIHJlcXVpcmUsIGRlZmluZSwgYnJvd3NlcmlmeV9zaGltX19kZWZpbmVfX21vZHVsZV9fZXhwb3J0X18pIHtcbi8qKlxuICogQGF1dGhvciBtcmRvb2IgLyBodHRwOi8vbXJkb29iLmNvbS9cbiAqL1xuXG52YXIgU3RhdHMgPSBmdW5jdGlvbiAoKSB7XG5cblx0dmFyIHN0YXJ0VGltZSA9IERhdGUubm93KCksIHByZXZUaW1lID0gc3RhcnRUaW1lO1xuXHR2YXIgbXMgPSAwLCBtc01pbiA9IEluZmluaXR5LCBtc01heCA9IDA7XG5cdHZhciBmcHMgPSAwLCBmcHNNaW4gPSBJbmZpbml0eSwgZnBzTWF4ID0gMDtcblx0dmFyIGZyYW1lcyA9IDAsIG1vZGUgPSAwO1xuXG5cdHZhciBjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCAnZGl2JyApO1xuXHRjb250YWluZXIuaWQgPSAnc3RhdHMnO1xuXHRjb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lciggJ21vdXNlZG93bicsIGZ1bmN0aW9uICggZXZlbnQgKSB7IGV2ZW50LnByZXZlbnREZWZhdWx0KCk7IHNldE1vZGUoICsrIG1vZGUgJSAyICkgfSwgZmFsc2UgKTtcblx0Y29udGFpbmVyLnN0eWxlLmNzc1RleHQgPSAnd2lkdGg6ODBweDtvcGFjaXR5OjAuOTtjdXJzb3I6cG9pbnRlcic7XG5cblx0dmFyIGZwc0RpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoICdkaXYnICk7XG5cdGZwc0Rpdi5pZCA9ICdmcHMnO1xuXHRmcHNEaXYuc3R5bGUuY3NzVGV4dCA9ICdwYWRkaW5nOjAgMCAzcHggM3B4O3RleHQtYWxpZ246bGVmdDtiYWNrZ3JvdW5kLWNvbG9yOiMwMDInO1xuXHRjb250YWluZXIuYXBwZW5kQ2hpbGQoIGZwc0RpdiApO1xuXG5cdHZhciBmcHNUZXh0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggJ2RpdicgKTtcblx0ZnBzVGV4dC5pZCA9ICdmcHNUZXh0Jztcblx0ZnBzVGV4dC5zdHlsZS5jc3NUZXh0ID0gJ2NvbG9yOiMwZmY7Zm9udC1mYW1pbHk6SGVsdmV0aWNhLEFyaWFsLHNhbnMtc2VyaWY7Zm9udC1zaXplOjlweDtmb250LXdlaWdodDpib2xkO2xpbmUtaGVpZ2h0OjE1cHgnO1xuXHRmcHNUZXh0LmlubmVySFRNTCA9ICdGUFMnO1xuXHRmcHNEaXYuYXBwZW5kQ2hpbGQoIGZwc1RleHQgKTtcblxuXHR2YXIgZnBzR3JhcGggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCAnZGl2JyApO1xuXHRmcHNHcmFwaC5pZCA9ICdmcHNHcmFwaCc7XG5cdGZwc0dyYXBoLnN0eWxlLmNzc1RleHQgPSAncG9zaXRpb246cmVsYXRpdmU7d2lkdGg6NzRweDtoZWlnaHQ6MzBweDtiYWNrZ3JvdW5kLWNvbG9yOiMwZmYnO1xuXHRmcHNEaXYuYXBwZW5kQ2hpbGQoIGZwc0dyYXBoICk7XG5cblx0d2hpbGUgKCBmcHNHcmFwaC5jaGlsZHJlbi5sZW5ndGggPCA3NCApIHtcblxuXHRcdHZhciBiYXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCAnc3BhbicgKTtcblx0XHRiYXIuc3R5bGUuY3NzVGV4dCA9ICd3aWR0aDoxcHg7aGVpZ2h0OjMwcHg7ZmxvYXQ6bGVmdDtiYWNrZ3JvdW5kLWNvbG9yOiMxMTMnO1xuXHRcdGZwc0dyYXBoLmFwcGVuZENoaWxkKCBiYXIgKTtcblxuXHR9XG5cblx0dmFyIG1zRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggJ2RpdicgKTtcblx0bXNEaXYuaWQgPSAnbXMnO1xuXHRtc0Rpdi5zdHlsZS5jc3NUZXh0ID0gJ3BhZGRpbmc6MCAwIDNweCAzcHg7dGV4dC1hbGlnbjpsZWZ0O2JhY2tncm91bmQtY29sb3I6IzAyMDtkaXNwbGF5Om5vbmUnO1xuXHRjb250YWluZXIuYXBwZW5kQ2hpbGQoIG1zRGl2ICk7XG5cblx0dmFyIG1zVGV4dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoICdkaXYnICk7XG5cdG1zVGV4dC5pZCA9ICdtc1RleHQnO1xuXHRtc1RleHQuc3R5bGUuY3NzVGV4dCA9ICdjb2xvcjojMGYwO2ZvbnQtZmFtaWx5OkhlbHZldGljYSxBcmlhbCxzYW5zLXNlcmlmO2ZvbnQtc2l6ZTo5cHg7Zm9udC13ZWlnaHQ6Ym9sZDtsaW5lLWhlaWdodDoxNXB4Jztcblx0bXNUZXh0LmlubmVySFRNTCA9ICdNUyc7XG5cdG1zRGl2LmFwcGVuZENoaWxkKCBtc1RleHQgKTtcblxuXHR2YXIgbXNHcmFwaCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoICdkaXYnICk7XG5cdG1zR3JhcGguaWQgPSAnbXNHcmFwaCc7XG5cdG1zR3JhcGguc3R5bGUuY3NzVGV4dCA9ICdwb3NpdGlvbjpyZWxhdGl2ZTt3aWR0aDo3NHB4O2hlaWdodDozMHB4O2JhY2tncm91bmQtY29sb3I6IzBmMCc7XG5cdG1zRGl2LmFwcGVuZENoaWxkKCBtc0dyYXBoICk7XG5cblx0d2hpbGUgKCBtc0dyYXBoLmNoaWxkcmVuLmxlbmd0aCA8IDc0ICkge1xuXG5cdFx0dmFyIGJhciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoICdzcGFuJyApO1xuXHRcdGJhci5zdHlsZS5jc3NUZXh0ID0gJ3dpZHRoOjFweDtoZWlnaHQ6MzBweDtmbG9hdDpsZWZ0O2JhY2tncm91bmQtY29sb3I6IzEzMSc7XG5cdFx0bXNHcmFwaC5hcHBlbmRDaGlsZCggYmFyICk7XG5cblx0fVxuXG5cdHZhciBzZXRNb2RlID0gZnVuY3Rpb24gKCB2YWx1ZSApIHtcblxuXHRcdG1vZGUgPSB2YWx1ZTtcblxuXHRcdHN3aXRjaCAoIG1vZGUgKSB7XG5cblx0XHRcdGNhc2UgMDpcblx0XHRcdFx0ZnBzRGl2LnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuXHRcdFx0XHRtc0Rpdi5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgMTpcblx0XHRcdFx0ZnBzRGl2LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG5cdFx0XHRcdG1zRGl2LnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuXHRcdFx0XHRicmVhaztcblx0XHR9XG5cblx0fVxuXG5cdHZhciB1cGRhdGVHcmFwaCA9IGZ1bmN0aW9uICggZG9tLCB2YWx1ZSApIHtcblxuXHRcdHZhciBjaGlsZCA9IGRvbS5hcHBlbmRDaGlsZCggZG9tLmZpcnN0Q2hpbGQgKTtcblx0XHRjaGlsZC5zdHlsZS5oZWlnaHQgPSB2YWx1ZSArICdweCc7XG5cblx0fVxuXG5cdHJldHVybiB7XG5cblx0XHRSRVZJU0lPTjogMTEsXG5cblx0XHRkb21FbGVtZW50OiBjb250YWluZXIsXG5cblx0XHRzZXRNb2RlOiBzZXRNb2RlLFxuXG5cdFx0YmVnaW46IGZ1bmN0aW9uICgpIHtcblxuXHRcdFx0c3RhcnRUaW1lID0gRGF0ZS5ub3coKTtcblxuXHRcdH0sXG5cblx0XHRlbmQ6IGZ1bmN0aW9uICgpIHtcblxuXHRcdFx0dmFyIHRpbWUgPSBEYXRlLm5vdygpO1xuXG5cdFx0XHRtcyA9IHRpbWUgLSBzdGFydFRpbWU7XG5cdFx0XHRtc01pbiA9IE1hdGgubWluKCBtc01pbiwgbXMgKTtcblx0XHRcdG1zTWF4ID0gTWF0aC5tYXgoIG1zTWF4LCBtcyApO1xuXG5cdFx0XHRtc1RleHQudGV4dENvbnRlbnQgPSBtcyArICcgTVMgKCcgKyBtc01pbiArICctJyArIG1zTWF4ICsgJyknO1xuXHRcdFx0dXBkYXRlR3JhcGgoIG1zR3JhcGgsIE1hdGgubWluKCAzMCwgMzAgLSAoIG1zIC8gMjAwICkgKiAzMCApICk7XG5cblx0XHRcdGZyYW1lcyArKztcblxuXHRcdFx0aWYgKCB0aW1lID4gcHJldlRpbWUgKyAxMDAwICkge1xuXG5cdFx0XHRcdGZwcyA9IE1hdGgucm91bmQoICggZnJhbWVzICogMTAwMCApIC8gKCB0aW1lIC0gcHJldlRpbWUgKSApO1xuXHRcdFx0XHRmcHNNaW4gPSBNYXRoLm1pbiggZnBzTWluLCBmcHMgKTtcblx0XHRcdFx0ZnBzTWF4ID0gTWF0aC5tYXgoIGZwc01heCwgZnBzICk7XG5cblx0XHRcdFx0ZnBzVGV4dC50ZXh0Q29udGVudCA9IGZwcyArICcgRlBTICgnICsgZnBzTWluICsgJy0nICsgZnBzTWF4ICsgJyknO1xuXHRcdFx0XHR1cGRhdGVHcmFwaCggZnBzR3JhcGgsIE1hdGgubWluKCAzMCwgMzAgLSAoIGZwcyAvIDEwMCApICogMzAgKSApO1xuXG5cdFx0XHRcdHByZXZUaW1lID0gdGltZTtcblx0XHRcdFx0ZnJhbWVzID0gMDtcblxuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gdGltZTtcblxuXHRcdH0sXG5cblx0XHR1cGRhdGU6IGZ1bmN0aW9uICgpIHtcblxuXHRcdFx0c3RhcnRUaW1lID0gdGhpcy5lbmQoKTtcblxuXHRcdH1cblxuXHR9XG5cbn07XG5cbjsgYnJvd3NlcmlmeV9zaGltX19kZWZpbmVfX21vZHVsZV9fZXhwb3J0X18odHlwZW9mIFN0YXRzICE9IFwidW5kZWZpbmVkXCIgPyBTdGF0cyA6IHdpbmRvdy5TdGF0cyk7XG5cbn0pLmNhbGwoZ2xvYmFsLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIGZ1bmN0aW9uIGRlZmluZUV4cG9ydChleCkgeyBtb2R1bGUuZXhwb3J0cyA9IGV4OyB9KTtcblxufSkuY2FsbCh0aGlzLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSkiLCJ2YXIgZG9tcmVhZHkgPSByZXF1aXJlKCdkb21yZWFkeScpO1xudmFyIFRIUkVFID0gKHdpbmRvdy5USFJFRSk7XG52YXIgU3RhdHMgPSByZXF1aXJlKCdzdGF0cycpO1xucmVxdWlyZSgncmFmLmpzJyk7XG5cbnZhciBsZW5zU2hhZGVyID0gcmVxdWlyZSgnLi9zaGFkZXJzL2xlbnMnKTtcbnZhciBmeGFhU2hhZGVyID0gcmVxdWlyZSgnLi9zaGFkZXJzL2Z4YWEnKTtcbnZhciBncmFpblNoYWRlciA9IHJlcXVpcmUoJy4vc2hhZGVycy9ncmFpbicpO1xuXG5mdW5jdGlvbiBhZGRMaWdodHMoc2NlbmUpIHtcbiAgICB2YXIgbGlnaHQgPSBuZXcgVEhSRUUuQW1iaWVudExpZ2h0KDB4MTQwMzFiKTtcbiAgICBzY2VuZS5hZGQobGlnaHQpO1xuXG4gICAgdmFyIHBvaW50ID0gbmV3IFRIUkVFLlBvaW50TGlnaHQoMHhhZjU4MWUsIDEuMCwgMTAwMCk7XG4gICAgcG9pbnQucG9zaXRpb24ueCA9IC01O1xuICAgIHBvaW50LnBvc2l0aW9uLnkgPSA4MDtcbiAgICBzY2VuZS5hZGQocG9pbnQpO1xuXG4gICAgdmFyIGhlbWkgPSBuZXcgVEhSRUUuSGVtaXNwaGVyZUxpZ2h0KDB4NWJhYmMyLCAweDhkNWYyZSwgMSk7XG5cbiAgICB2YXIgZGlyID0gbmV3IFRIUkVFLkRpcmVjdGlvbmFsTGlnaHQoMHg1YmFiYzIsIDAuNSk7XG4gICAgZGlyLnBvc2l0aW9uLnkgPSA1MDtcbiAgICBkaXIucG9zaXRpb24ueCA9IDEwO1xuICAgIGRpci5wb3NpdGlvbi56ID0gLTEwO1xuICAgIGRpci5jYXN0U2hhZG93ID0gdHJ1ZTtcbiAgICBkaXIuc2hhZG93TWFwV2lkdGggPSAyMDQ4O1xuICAgIGRpci5zaGFkb3dNYXBIZWlnaHQgPSAyMDQ4O1xuXG4gICAgXG4gICAgZGlyLnNoYWRvd0NhbWVyYU5lYXIgPSA1O1xuICAgIGRpci5zaGFkb3dDYW1lcmFGYXIgPSAxMDAwO1xuICAgIFxuICAgIHZhciBmYXIgPSA1MDA7XG4gICAgZGlyLnNoYWRvd0NhbWVyYUxlZnQgPSAtZmFyO1xuICAgIGRpci5zaGFkb3dDYW1lcmFSaWdodCA9IGZhcjtcbiAgICBkaXIuc2hhZG93Q2FtZXJhVG9wID0gZmFyO1xuICAgIGRpci5zaGFkb3dDYW1lcmFCb3R0b20gPSAtZmFyO1xuICAgIGRpci5zaGFkb3dDYW1lcmFGb3YgPSA1MDtcbiAgICBkaXIuc2hhZG93RGFya25lc3MgPSAwLjU7XG5cblxuICAgIHNjZW5lLmFkZChkaXIpO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVTY2VuZSgpIHtcbiAgICB2YXIgc2NlbmUgPSBuZXcgVEhSRUUuU2NlbmUoKTtcblxuXG4gICAgdmFyIHBhdGggPSBcImltZy9jdWJlL1N3ZWRpc2hSb3lhbENhc3RsZS9cIjtcbiAgICB2YXIgZm9ybWF0ID0gJy5qcGcnO1xuICAgIHZhciB1cmxzID0gW1xuICAgICAgICAgICAgcGF0aCArICdweCcgKyBmb3JtYXQsIHBhdGggKyAnbngnICsgZm9ybWF0LFxuICAgICAgICAgICAgcGF0aCArICdweScgKyBmb3JtYXQsIHBhdGggKyAnbnknICsgZm9ybWF0LFxuICAgICAgICAgICAgcGF0aCArICdweicgKyBmb3JtYXQsIHBhdGggKyAnbnonICsgZm9ybWF0XG4gICAgICAgIF07XG5cbiAgICB2YXIgcmVmbGVjdGlvbkN1YmUgPSBUSFJFRS5JbWFnZVV0aWxzLmxvYWRUZXh0dXJlQ3ViZSggdXJscyApO1xuICAgIHJlZmxlY3Rpb25DdWJlLmZvcm1hdCA9IFRIUkVFLlJHQkZvcm1hdDtcblxuICAgIHZhciByZWZyYWN0aW9uQ3ViZSA9IG5ldyBUSFJFRS5UZXh0dXJlKCByZWZsZWN0aW9uQ3ViZS5pbWFnZSwgbmV3IFRIUkVFLkN1YmVSZWZyYWN0aW9uTWFwcGluZygpICk7XG4gICAgcmVmcmFjdGlvbkN1YmUuZm9ybWF0ID0gVEhSRUUuUkdCRm9ybWF0O1xuXG4gICAgdmFyIHIgPSAxMDtcbiAgICB2YXIgc3BoZXJlR2VvID0gbmV3IFRIUkVFLlNwaGVyZUdlb21ldHJ5KHIsIDUwLCA1MCk7XG4gICAgdmFyIGNvbG9ycyA9IFtcbiAgICAgICAgMHg5ZTczNWYsXG4gICAgICAgIDB4RkZGRkZGLFxuICAgICAgICAweDViYWJjMlxuICAgIF07XG4gICAgdmFyIGNvdW50ID0gNTtcbiAgICBmb3IgKHZhciBpPTA7IGk8Y291bnQ7IGkrKykge1xuICAgICAgICB2YXIgYyA9IGNvbG9yc1tpJWNvbG9ycy5sZW5ndGhdO1xuICAgICAgICB2YXIgc3BoZXJlID0gbmV3IFRIUkVFLk1lc2goXG4gICAgICAgICAgICBzcGhlcmVHZW8sXG4gICAgICAgICAgICBuZXcgVEhSRUUuTWVzaExhbWJlcnRNYXRlcmlhbCh7XG4gICAgICAgICAgICAgICAgY29sb3I6IGMsIGVudk1hcDogcmVmbGVjdGlvbkN1YmUsIFxuICAgICAgICAgICAgICAgIGNvbWJpbmU6IFRIUkVFLk1peE9wZXJhdGlvbiwgcmVmbGVjdGl2aXR5OiBNYXRoLnJhbmRvbSgpKjAuNSxcbiAgICAgICAgICAgICAgICBzaGFkaW5nOlRIUkVFLlNtb290aFNoYWRpbmd9KVxuICAgICAgICApO1xuICAgICAgICBzcGhlcmUucG9zaXRpb24ueCA9IChpL2NvdW50KjItMSkgKiA1NTtcbiAgICAgICAgLy8gc3BoZXJlLnBvc2l0aW9uLnogPSAoTWF0aC5yYW5kb20oKSoyLTEpKjEwMDtcbiAgICAgICAgc3BoZXJlLmNhc3RTaGFkb3cgPSB0cnVlO1xuICAgICAgICBzY2VuZS5hZGQoc3BoZXJlKTsgICAgXG4gICAgfVxuICAgICAgICBcbiAgICB2YXIgZ3JvdW5kID0gVEhSRUUuSW1hZ2VVdGlscy5sb2FkVGV4dHVyZShcImltZy9ncm91bmQuanBnXCIpO1xuICAgIGdyb3VuZC53cmFwUyA9IFRIUkVFLlJlcGVhdFdyYXBwaW5nO1xuICAgIGdyb3VuZC53cmFwVCA9IFRIUkVFLlJlcGVhdFdyYXBwaW5nO1xuICAgIGdyb3VuZC5yZXBlYXQueCA9IDE1O1xuICAgIGdyb3VuZC5yZXBlYXQueSA9IDE1O1xuXG4gICAgdmFyIHBsYW5lR2VvID0gbmV3IFRIUkVFLlBsYW5lR2VvbWV0cnkoMTAwMCwgMTAwMCwgMTAsIDEwKTtcbiAgICBwbGFuZUdlby5hcHBseU1hdHJpeChuZXcgVEhSRUUuTWF0cml4NCgpLm1ha2VSb3RhdGlvblgoLU1hdGguUEkvMikpO1xuICAgIHZhciBmbG9vciA9IG5ldyBUSFJFRS5NZXNoKFxuICAgICAgICBwbGFuZUdlbywgbmV3IFRIUkVFLk1lc2hMYW1iZXJ0TWF0ZXJpYWwoe21hcDpncm91bmR9KVxuICAgICk7XG4gICAgZmxvb3IucG9zaXRpb24ueSA9IC1yO1xuICAgIGZsb29yLnJlY2VpdmVTaGFkb3cgPSB0cnVlO1xuICAgIHNjZW5lLmFkZChmbG9vcik7XG5cbiAgICBhZGRMaWdodHMoc2NlbmUpO1xuXG4gICAgcmV0dXJuIHNjZW5lO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVSZW5kZXJUYXJnZXQocmVuZGVyZXIsIHdpZHRoLCBoZWlnaHQpIHtcbiAgICB2YXIgcnRXaWR0aCA9IHdpZHRofHwyLFxuICAgICAgICBydEhlaWdodCA9IGhlaWdodHx8MjtcblxuICAgIHZhciBnbCA9IHJlbmRlcmVyLmdldENvbnRleHQoKTtcbiAgICB2YXIgbWF4UmVuZGVyVGFyZ2V0U2l6ZSA9IGdsLmdldFBhcmFtZXRlcihnbC5NQVhfUkVOREVSQlVGRkVSX1NJWkUpO1xuXG4gICAgcnRXaWR0aCA9IE1hdGgubWluKHJ0V2lkdGgsIG1heFJlbmRlclRhcmdldFNpemUpO1xuICAgIHJ0SGVpZ2h0ID0gTWF0aC5taW4ocnRIZWlnaHQsIG1heFJlbmRlclRhcmdldFNpemUpO1xuXG4gICAgdmFyIHJlbmRlclRhcmdldCA9IG5ldyBUSFJFRS5XZWJHTFJlbmRlclRhcmdldChydFdpZHRoLCBydEhlaWdodCwge1xuICAgICAgICBtaW5GaWx0ZXI6IFRIUkVFLkxpbmVhckZpbHRlcixcbiAgICAgICAgbWFnRmlsdGVyOiBUSFJFRS5MaW5lYXJGaWx0ZXIsXG4gICAgICAgIGZvcm1hdDogVEhSRUUuUkdCRm9ybWF0LFxuICAgICAgICBnZW5lcmF0ZU1pcG1hcHM6IGZhbHNlXG4gICAgfSk7XG4gICAgcmV0dXJuIHJlbmRlclRhcmdldDtcbn1cblxuZnVuY3Rpb24gc2V0dXBQb3N0UHJvY2Vzc2luZyhyZW5kZXJlciwgd2lkdGgsIGhlaWdodCkge1xuICAgIHZhciByZW5kZXJUYXJnZXQgPSBjcmVhdGVSZW5kZXJUYXJnZXQocmVuZGVyZXIsIHdpZHRoLCBoZWlnaHQpO1xuICAgIHZhciByZW5kZXJUYXJnZXQyID0gY3JlYXRlUmVuZGVyVGFyZ2V0KHJlbmRlcmVyLCB3aWR0aCwgaGVpZ2h0KTtcblxuICAgIHZhciBmeGFhTWF0ZXJpYWwgPSBuZXcgVEhSRUUuU2hhZGVyTWF0ZXJpYWwoe1xuICAgICAgICB1bmlmb3Jtczoge1xuICAgICAgICAgICAgLy90aGUgc2NlbmUgdGV4dHVyZS4uLlxuICAgICAgICAgICAgdGV4dHVyZToge3R5cGU6J3QnLCB2YWx1ZTogcmVuZGVyVGFyZ2V0fSxcbiAgICAgICAgICAgIHJlc29sdXRpb246IHt0eXBlOid2MicsIHZhbHVlOiBuZXcgVEhSRUUuVmVjdG9yMih3aWR0aCwgaGVpZ2h0KX1cbiAgICAgICAgfSxcbiAgICAgICAgdmVydGV4U2hhZGVyOiBmeGFhU2hhZGVyLnZlcnRleFNoYWRlcixcbiAgICAgICAgZnJhZ21lbnRTaGFkZXI6IGZ4YWFTaGFkZXIuZnJhZ21lbnRTaGFkZXJcbiAgICB9KTtcblxuICAgIHZhciBsb29rdXBUZXh0dXJlID0gVEhSRUUuSW1hZ2VVdGlscy5sb2FkVGV4dHVyZShcImltZy9sb29rdXBfZmlsbS5wbmdcIik7XG4gICAgbG9va3VwVGV4dHVyZS5nZW5NaXBtYXBzID0gZmFsc2U7XG4gICAgbG9va3VwVGV4dHVyZS5taW5GaWx0ZXIgPSBUSFJFRS5MaW5lYXJGaWx0ZXI7XG4gICAgbG9va3VwVGV4dHVyZS5tYWdGaWx0ZXIgPSBUSFJFRS5MaW5lYXJGaWx0ZXI7XG4gICAgbG9va3VwVGV4dHVyZS53cmFwUyA9IFRIUkVFLkNsYW1wVG9FZGdlV3JhcHBpbmc7XG4gICAgbG9va3VwVGV4dHVyZS53cmFwVCA9IFRIUkVFLkNsYW1wVG9FZGdlV3JhcHBpbmc7XG5cbiAgICB2YXIgcG9zdE1hdGVyaWFsID0gbmV3IFRIUkVFLlNoYWRlck1hdGVyaWFsKHtcbiAgICAgICAgdW5pZm9ybXM6IHtcbiAgICAgICAgICAgIC8vbGVucyBkaXN0b3J0aW9uXG4gICAgICAgICAgICByZXNvbHV0aW9uOiB7dHlwZTogJ3YyJywgdmFsdWU6IG5ldyBUSFJFRS5WZWN0b3IyKHdpZHRoLCBoZWlnaHQpfSxcbiAgICAgICAgICAgIGs6IHt0eXBlOiAnZicsIHZhbHVlOiAwLjA1fSxcbiAgICAgICAgICAgIGtjdWJlOiB7IHR5cGU6ICdmJywgdmFsdWU6IDAuMX0sXG4gICAgICAgICAgICBzY2FsZTogeyB0eXBlOiAnZicsIHZhbHVlOiAwLjl9LFxuICAgICAgICAgICAgZGlzcGVyc2lvbjoge3R5cGU6J2YnLCB2YWx1ZTowLjAxfSxcbiAgICAgICAgICAgIGJsdXJBbW91bnQ6IHt0eXBlOiAnZicsIHZhbHVlOiAxLjB9LFxuICAgICAgICAgICAgYmx1ckVuYWJsZWQ6IHt0eXBlOidpJywgdmFsdWU6IDF9LFxuXG4gICAgICAgICAgICAvL2ZpbG0gZ3JhaW4uLlxuICAgICAgICAgICAgZ3JhaW5hbW91bnQ6IHt0eXBlOiAnZicsIHZhbHVlOiAwLjAzfSxcbiAgICAgICAgICAgIGNvbG9yZWQ6IHt0eXBlOiAnaScsIHZhbHVlOiAwfSxcbiAgICAgICAgICAgIGNvbG9yYW1vdW50OiB7dHlwZTogJ2YnLCB2YWx1ZTowLjZ9LFxuICAgICAgICAgICAgZ3JhaW5zaXplOiB7dHlwZTonZicsIHZhbHVlOjEuOX0sXG4gICAgICAgICAgICBsdW1hbW91bnQ6IHt0eXBlOiAnZicsIHZhbHVlOjEuMH0sXG4gICAgICAgICAgICB0aW1lcjoge3R5cGU6ICdmJywgdmFsdWU6IDAuMH0sXG5cbiAgICAgICAgICAgIC8vZmlsbSBkdXN0LCBzY3JhdGNoZXMsIGJ1cm5cbiAgICAgICAgICAgIHNjcmF0Y2hlczoge3R5cGU6ICdmJywgdmFsdWU6IDAuMX0sXG4gICAgICAgICAgICBidXJuOiB7dHlwZTogJ2YnLCB2YWx1ZTogMC4zfSxcblxuICAgICAgICAgICAgLy9maWx0ZXJcbiAgICAgICAgICAgIGZpbHRlclN0cmVuZ3RoOiB7dHlwZTogJ2YnLCB2YWx1ZTogMX0sXG5cbiAgICAgICAgICAgIC8vdGhlIHNjZW5lIHRleHR1cmUuLi5cbiAgICAgICAgICAgIHRleHR1cmU6IHt0eXBlOid0JywgdmFsdWU6IHJlbmRlclRhcmdldDJ9LFxuXG4gICAgICAgICAgICAvL3RoZSBmaWx0ZXIgbG9va3VwIHRleHR1cmVcbiAgICAgICAgICAgIGxvb2t1cFRleHR1cmU6IHt0eXBlOiAndCcsIHZhbHVlOiBsb29rdXBUZXh0dXJlIH0sXG4gICAgICAgIH0sXG4gICAgICAgIHZlcnRleFNoYWRlcjogbGVuc1NoYWRlci52ZXJ0ZXhTaGFkZXIsXG4gICAgICAgIGZyYWdtZW50U2hhZGVyOiBsZW5zU2hhZGVyLmZyYWdtZW50U2hhZGVyXG4gICAgfSk7XG4gICAgXG4gICAgcG9zdFF1YWQgPSBuZXcgVEhSRUUuTWVzaChuZXcgVEhSRUUuUGxhbmVHZW9tZXRyeSggMiwgMiApLCBwb3N0TWF0ZXJpYWwpO1xuICAgIFxuICAgIHBvc3RDYW1lcmEgPSBuZXcgVEhSRUUuT3J0aG9ncmFwaGljQ2FtZXJhKCAtMSwgMSwgMSwgLTEsIDAsIDEgKTtcbiAgICBwb3N0Q2FtZXJhLnVwZGF0ZVByb2plY3Rpb25NYXRyaXgoKTtcblxuICAgIHBvc3RTY2VuZSA9IG5ldyBUSFJFRS5TY2VuZSgpO1xuICAgIHBvc3RTY2VuZS5hZGQocG9zdFF1YWQpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgY2FtZXJhOiBwb3N0Q2FtZXJhLFxuICAgICAgICBzY2VuZTogcG9zdFNjZW5lLFxuICAgICAgICBxdWFkOiBwb3N0UXVhZCxcbiAgICAgICAgcG9zdE1hdGVyaWFsOiBwb3N0TWF0ZXJpYWwsXG4gICAgICAgIGZ4YWFNYXRlcmlhbDogZnhhYU1hdGVyaWFsLFxuICAgICAgICB0YXJnZXQ6IHJlbmRlclRhcmdldCxcbiAgICAgICAgdGFyZ2V0MjogcmVuZGVyVGFyZ2V0MixcblxuICAgICAgICByZXNpemU6IGZ1bmN0aW9uKHdpZHRoLCBoZWlnaHQpIHtcbiAgICAgICAgICAgIHRoaXMudGFyZ2V0ID0gdGhpcy50YXJnZXQuY2xvbmUoKTtcbiAgICAgICAgICAgIHRoaXMudGFyZ2V0MiA9IHRoaXMudGFyZ2V0Mi5jbG9uZSgpO1xuXG4gICAgICAgICAgICB0aGlzLnRhcmdldC53aWR0aCA9IHdpZHRoO1xuICAgICAgICAgICAgdGhpcy50YXJnZXQuaGVpZ2h0ID0gaGVpZ2h0O1xuICAgICAgICAgICAgdGhpcy50YXJnZXQyLndpZHRoID0gd2lkdGg7XG4gICAgICAgICAgICB0aGlzLnRhcmdldDIuaGVpZ2h0ID0gaGVpZ2h0O1xuXG4gICAgICAgICAgICB0aGlzLnBvc3RNYXRlcmlhbC51bmlmb3Jtcy50ZXh0dXJlLnZhbHVlID0gdGhpcy50YXJnZXQyO1xuICAgICAgICAgICAgdGhpcy5meGFhTWF0ZXJpYWwudW5pZm9ybXMudGV4dHVyZS52YWx1ZSA9IHRoaXMudGFyZ2V0O1xuICAgICAgICB9XG4gICAgfTtcbn1cblxuZG9tcmVhZHkoZnVuY3Rpb24oKSB7XG4gICAgdmFyIHdpZHRoID0gNzIwLFxuICAgICAgICBoZWlnaHQgPSA0ODA7XG5cblxuICAgIHZhciByZW5kZXJlciA9IG5ldyBUSFJFRS5XZWJHTFJlbmRlcmVyKHsgXG4gICAgICAgIGFudGlhbGlhczogZmFsc2UsXG4gICAgICAgIGNhbnZhczogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjYW52YXNcIilcbiAgICB9KTtcbiAgICByZW5kZXJlci5zZXRTaXplKHdpZHRoLCBoZWlnaHQpO1xuICAgIHJlbmRlcmVyLnNoYWRvd01hcEVuYWJsZWQgPSB0cnVlO1xuICAgIHJlbmRlcmVyLnNoYWRvd01hcFR5cGUgPSBUSFJFRS5QQ0ZTb2Z0U2hhZG93TWFwO1xuICAgIHJlbmRlcmVyLmdhbW1hSW5wdXQgPSB0cnVlO1xuICAgIHJlbmRlcmVyLmdhbW1hT3V0cHV0ID0gdHJ1ZTtcblxuICAgIHZhciBzdGF0cyA9IG5ldyBTdGF0cygpO1xuICAgIHN0YXRzLnNldE1vZGUoMCk7IC8vIDA6IGZwcywgMTogbXNcblxuICAgIC8vIEFsaWduIHRvcC1sZWZ0XG4gICAgc3RhdHMuZG9tRWxlbWVudC5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gICAgc3RhdHMuZG9tRWxlbWVudC5zdHlsZS5sZWZ0ID0gKDEwK3dpZHRoLTgwKSsncHgnO1xuICAgIHN0YXRzLmRvbUVsZW1lbnQuc3R5bGUudG9wID0gJzEwcHgnO1xuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoc3RhdHMuZG9tRWxlbWVudCk7XG5cbiAgICB2YXIgcG9zdCA9IHNldHVwUG9zdFByb2Nlc3NpbmcocmVuZGVyZXIsIHdpZHRoLCBoZWlnaHQpO1xuXG4gICAgdmFyIHVzZUZYQUEgPSB0cnVlLFxuICAgICAgICB1c2VQb3N0ID0gdHJ1ZTtcblxuICAgIGZ1bmN0aW9uIHVwZGF0ZUxhYmVscygpIHtcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBvc3QnKS5zdHlsZS5kaXNwbGF5ID0gdXNlUG9zdCA/ICdibG9jaycgOiAnbm9uZSc7XG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5meGFhLW9uJykuc3R5bGUuZGlzcGxheSA9ICF1c2VGWEFBID8gJ2Jsb2NrJyA6ICdub25lJztcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmZ4YWEtb2ZmJykuc3R5bGUuZGlzcGxheSA9IHVzZUZYQUEgPyAnYmxvY2snIDogJ25vbmUnO1xuICAgIH1cbiAgICBcbiAgICB1cGRhdGVMYWJlbHMoKTtcblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCBmdW5jdGlvbihldikge1xuICAgICAgICB2YXIgY2hyID0gU3RyaW5nLmZyb21DaGFyQ29kZShldi53aGljaHx8ZXYua2V5Q29kZSkudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgaWYgKGNocj09PSdwJykge1xuICAgICAgICAgICAgdXNlUG9zdCA9ICF1c2VQb3N0O1xuICAgICAgICB9IGVsc2UgaWYgKGNociA9PT0gJ2YnKSB7XG4gICAgICAgICAgICB1c2VGWEFBID0gIXVzZUZYQUE7XG4gICAgICAgIH0gXG4gICAgICAgIC8vRGlzYWJsZWQgZm9yIG5vdy4uXG4gICAgICAgIC8vIGVsc2UgaWYgKGNociA9PT0gJ24nKSB7XG4gICAgICAgIC8vICAgICAvL2JpdCBmbGlwIDAgdG8gMSBhbmQgdmljZSB2ZXJzYVxuICAgICAgICAvLyAgICAgcG9zdC5wb3N0TWF0ZXJpYWwudW5pZm9ybXMuY29sb3JlZC52YWx1ZSBePSAxOyBcbiAgICAgICAgLy8gfVxuXG4gICAgICAgIHVwZGF0ZUxhYmVscygpO1xuICAgIH0pO1xuXG4gICAgdmFyIHNjZW5lID0gY3JlYXRlU2NlbmUoKTtcbiAgICB2YXIgY2FtZXJhID0gbmV3IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhKCA2MCwgd2lkdGgvaGVpZ2h0LCAxLCAxMDAwICk7XG5cbiAgICB2YXIgY2xvY2sgPSBuZXcgVEhSRUUuQ2xvY2soKTtcblxuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShyZW5kZXIpO1xuXG4gICAgZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUocmVuZGVyKTtcbiAgICAgICAgc3RhdHMuYmVnaW4oKTtcblxuICAgICAgICB2YXIgdGltZSA9IGNsb2NrLmdldEVsYXBzZWRUaW1lKCk7XG5cbiAgICAgICAgcG9zdC5wb3N0TWF0ZXJpYWwudW5pZm9ybXMudGltZXIudmFsdWUgPSB0aW1lO1xuXG4gICAgICAgIC8vb3JiaXQgY2FtZXJhXG4gICAgICAgIHZhciByYWRpdXMgPSA1MDtcblxuICAgICAgICBjYW1lcmEucG9zaXRpb24ueCA9IE1hdGguY29zKHRpbWUqMC40KSAqIHJhZGl1cztcbiAgICAgICAgY2FtZXJhLnBvc2l0aW9uLnogPSBNYXRoLnNpbih0aW1lKjAuNCkgKiByYWRpdXM7XG4gICAgICAgIGNhbWVyYS5wb3NpdGlvbi55ID0gTWF0aC5zaW4odGltZSowLjI1KSAqIDEgKyAyNTtcbiAgICAgICAgY2FtZXJhLmxvb2tBdChuZXcgVEhSRUUuVmVjdG9yMygwLDAsMCkpO1xuICAgICAgICBcbiAgICAgICAgaWYgKHVzZVBvc3QpIHtcbiAgICAgICAgICAgIFxuXG4gICAgICAgICAgICAvL3JlbmRlciBzY2VuZSB0byBmaXJzdCB0YXJnZXQgaWYgRlhBQSBpcyBlbmFibGVkXG4gICAgICAgICAgICByZW5kZXJlci5yZW5kZXIoc2NlbmUsIGNhbWVyYSwgdXNlRlhBQSA/IHBvc3QudGFyZ2V0IDogcG9zdC50YXJnZXQyKTtcblxuICAgICAgICAgICAgaWYgKHVzZUZYQUEpIHtcbiAgICAgICAgICAgICAgICAvL3JlbmRlciBGWEFBIHRvIHNlY29uZCB0YXJnZXRcbiAgICAgICAgICAgICAgICBwb3N0LnF1YWQubWF0ZXJpYWwgPSBwb3N0LmZ4YWFNYXRlcmlhbDtcbiAgICAgICAgICAgICAgICByZW5kZXJlci5yZW5kZXIocG9zdC5zY2VuZSwgcG9zdC5jYW1lcmEsIHBvc3QudGFyZ2V0Mik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vcmVuZGVyIGxlbnMgZWZmZWN0cyB0byBzY3JlZW5cbiAgICAgICAgICAgIHBvc3QucXVhZC5tYXRlcmlhbCA9IHBvc3QucG9zdE1hdGVyaWFsO1xuICAgICAgICAgICAgcmVuZGVyZXIucmVuZGVyKHBvc3Quc2NlbmUsIHBvc3QuY2FtZXJhKTtcbiAgICAgICAgfSAgZWxzZSB7XG4gICAgICAgICAgICByZW5kZXJlci5yZW5kZXIoc2NlbmUsIGNhbWVyYSk7XG4gICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICBzdGF0cy5lbmQoKTtcbiAgICB9XG59KTsiLCJcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgdmVydGV4U2hhZGVyOiBcInZhcnlpbmcgdmVjMiB2VXY7XFxuXFxudmFyeWluZyB2ZWMyIHZfcmdiTlc7XFxudmFyeWluZyB2ZWMyIHZfcmdiTkU7XFxudmFyeWluZyB2ZWMyIHZfcmdiU1c7XFxudmFyeWluZyB2ZWMyIHZfcmdiU0U7XFxudmFyeWluZyB2ZWMyIHZfcmdiTTtcXG5cXG51bmlmb3JtIHZlYzIgcmVzb2x1dGlvbjtcXG5cXG52b2lkIG1haW4oKSB7XFxuXFx0dlV2ID0gdXY7ICBcXG5cXHR2ZWMyIGludmVyc2VWUCA9IHZlYzIoMS4wIC8gcmVzb2x1dGlvbi54LCAxLjAgLyByZXNvbHV0aW9uLnkpO1xcblxcdHZlYzIgZnJhZ0Nvb3JkID0gdXYgKiByZXNvbHV0aW9uO1xcblxcdHZfcmdiTlcgPSAoZnJhZ0Nvb3JkICsgdmVjMigtMS4wLCAtMS4wKSkgKiBpbnZlcnNlVlA7XFxuXFx0dl9yZ2JORSA9IChmcmFnQ29vcmQgKyB2ZWMyKDEuMCwgLTEuMCkpICogaW52ZXJzZVZQO1xcblxcdHZfcmdiU1cgPSAoZnJhZ0Nvb3JkICsgdmVjMigtMS4wLCAxLjApKSAqIGludmVyc2VWUDtcXG5cXHR2X3JnYlNFID0gKGZyYWdDb29yZCArIHZlYzIoMS4wLCAxLjApKSAqIGludmVyc2VWUDtcXG5cXHR2X3JnYk0gPSB2ZWMyKGZyYWdDb29yZCAqIGludmVyc2VWUCk7XFxuXFx0Z2xfUG9zaXRpb24gPSBwcm9qZWN0aW9uTWF0cml4ICpcXG5cXHQgICAgICAgICAgICBtb2RlbFZpZXdNYXRyaXggKlxcblxcdCAgICAgICAgICAgIHZlYzQocG9zaXRpb24sMS4wKTtcXG59XFxuXCIsXG4gICAgZnJhZ21lbnRTaGFkZXI6IFwidmFyeWluZyB2ZWMyIHZVdjtcXG5cXG52YXJ5aW5nIG1lZGl1bXAgdmVjMiB2X3JnYk5XO1xcbnZhcnlpbmcgbWVkaXVtcCB2ZWMyIHZfcmdiTkU7XFxudmFyeWluZyBtZWRpdW1wIHZlYzIgdl9yZ2JTVztcXG52YXJ5aW5nIG1lZGl1bXAgdmVjMiB2X3JnYlNFO1xcbnZhcnlpbmcgbWVkaXVtcCB2ZWMyIHZfcmdiTTtcXG5cXG51bmlmb3JtIHZlYzIgcmVzb2x1dGlvbjtcXG51bmlmb3JtIHNhbXBsZXIyRCB0ZXh0dXJlO1xcblxcblxcbi8qIEJhc2ljIEZYQUEgaW1wbGVtZW50YXRpb24gYmFzZWQgb24gdGhlIGNvZGUgb24gZ2Vla3MzZC5jb20gd2l0aCB0aGVcXG4gICBtb2RpZmljYXRpb24gdGhhdCB0aGUgdGV4dHVyZTJETG9kIHN0dWZmIHdhcyByZW1vdmVkIHNpbmNlIGl0J3NcXG4gICB1bnN1cHBvcnRlZCBieSBXZWJHTC4gKi9cXG5cXG4jZGVmaW5lIEZYQUFfUkVEVUNFX01JTiAgICgxLjAvIDEyOC4wKVxcbiNkZWZpbmUgRlhBQV9SRURVQ0VfTVVMICAgKDEuMCAvIDguMClcXG4jZGVmaW5lIEZYQUFfU1BBTl9NQVggICAgIDguMFxcblxcblxcbnZvaWQgbWFpbih2b2lkKVxcbntcXG4gICAgbWVkaXVtcCB2ZWMyIGZyYWdDb29yZCA9IHZVdipyZXNvbHV0aW9uOyBcXG5cXG4gICAgdmVjNCBjb2xvcjtcXG4gICAgbWVkaXVtcCB2ZWMyIGludmVyc2VWUCA9IHZlYzIoMS4wIC8gcmVzb2x1dGlvbi54LCAxLjAgLyByZXNvbHV0aW9uLnkpO1xcbiAgICB2ZWMzIHJnYk5XID0gdGV4dHVyZTJEKHRleHR1cmUsIHZfcmdiTlcpLnh5ejtcXG4gICAgdmVjMyByZ2JORSA9IHRleHR1cmUyRCh0ZXh0dXJlLCB2X3JnYk5FKS54eXo7XFxuICAgIHZlYzMgcmdiU1cgPSB0ZXh0dXJlMkQodGV4dHVyZSwgdl9yZ2JTVykueHl6O1xcbiAgICB2ZWMzIHJnYlNFID0gdGV4dHVyZTJEKHRleHR1cmUsIHZfcmdiU0UpLnh5ejtcXG4gICAgdmVjMyByZ2JNICA9IHRleHR1cmUyRCh0ZXh0dXJlLCB2X3JnYk0pLnh5ejtcXG4gICAgdmVjMyBsdW1hID0gdmVjMygwLjI5OSwgMC41ODcsIDAuMTE0KTtcXG4gICAgZmxvYXQgbHVtYU5XID0gZG90KHJnYk5XLCBsdW1hKTtcXG4gICAgZmxvYXQgbHVtYU5FID0gZG90KHJnYk5FLCBsdW1hKTtcXG4gICAgZmxvYXQgbHVtYVNXID0gZG90KHJnYlNXLCBsdW1hKTtcXG4gICAgZmxvYXQgbHVtYVNFID0gZG90KHJnYlNFLCBsdW1hKTtcXG4gICAgZmxvYXQgbHVtYU0gID0gZG90KHJnYk0sICBsdW1hKTtcXG4gICAgZmxvYXQgbHVtYU1pbiA9IG1pbihsdW1hTSwgbWluKG1pbihsdW1hTlcsIGx1bWFORSksIG1pbihsdW1hU1csIGx1bWFTRSkpKTtcXG4gICAgZmxvYXQgbHVtYU1heCA9IG1heChsdW1hTSwgbWF4KG1heChsdW1hTlcsIGx1bWFORSksIG1heChsdW1hU1csIGx1bWFTRSkpKTtcXG4gICAgXFxuICAgIG1lZGl1bXAgdmVjMiBkaXI7XFxuICAgIGRpci54ID0gLSgobHVtYU5XICsgbHVtYU5FKSAtIChsdW1hU1cgKyBsdW1hU0UpKTtcXG4gICAgZGlyLnkgPSAgKChsdW1hTlcgKyBsdW1hU1cpIC0gKGx1bWFORSArIGx1bWFTRSkpO1xcbiAgICBcXG4gICAgZmxvYXQgZGlyUmVkdWNlID0gbWF4KChsdW1hTlcgKyBsdW1hTkUgKyBsdW1hU1cgKyBsdW1hU0UpICpcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICgwLjI1ICogRlhBQV9SRURVQ0VfTVVMKSwgRlhBQV9SRURVQ0VfTUlOKTtcXG4gICAgXFxuICAgIGZsb2F0IHJjcERpck1pbiA9IDEuMCAvIChtaW4oYWJzKGRpci54KSwgYWJzKGRpci55KSkgKyBkaXJSZWR1Y2UpO1xcbiAgICBkaXIgPSBtaW4odmVjMihGWEFBX1NQQU5fTUFYLCBGWEFBX1NQQU5fTUFYKSxcXG4gICAgICAgICAgICAgIG1heCh2ZWMyKC1GWEFBX1NQQU5fTUFYLCAtRlhBQV9TUEFOX01BWCksXFxuICAgICAgICAgICAgICBkaXIgKiByY3BEaXJNaW4pKSAqIGludmVyc2VWUDtcXG4gICAgXFxuICAgIHZlYzMgcmdiQSA9IDAuNSAqIChcXG4gICAgICAgIHRleHR1cmUyRCh0ZXh0dXJlLCBmcmFnQ29vcmQgKiBpbnZlcnNlVlAgKyBkaXIgKiAoMS4wIC8gMy4wIC0gMC41KSkueHl6ICtcXG4gICAgICAgIHRleHR1cmUyRCh0ZXh0dXJlLCBmcmFnQ29vcmQgKiBpbnZlcnNlVlAgKyBkaXIgKiAoMi4wIC8gMy4wIC0gMC41KSkueHl6KTtcXG4gICAgdmVjMyByZ2JCID0gcmdiQSAqIDAuNSArIDAuMjUgKiAoXFxuICAgICAgICB0ZXh0dXJlMkQodGV4dHVyZSwgZnJhZ0Nvb3JkICogaW52ZXJzZVZQICsgZGlyICogLTAuNSkueHl6ICtcXG4gICAgICAgIHRleHR1cmUyRCh0ZXh0dXJlLCBmcmFnQ29vcmQgKiBpbnZlcnNlVlAgKyBkaXIgKiAwLjUpLnh5eik7XFxuXFxuICAgIGZsb2F0IGx1bWFCID0gZG90KHJnYkIsIGx1bWEpO1xcbiAgICBpZiAoKGx1bWFCIDwgbHVtYU1pbikgfHwgKGx1bWFCID4gbHVtYU1heCkpXFxuICAgICAgICBjb2xvciA9IHZlYzQocmdiQSwgMS4wKTtcXG4gICAgZWxzZVxcbiAgICAgICAgY29sb3IgPSB2ZWM0KHJnYkIsIDEuMCk7XFxuICAgIGdsX0ZyYWdDb2xvciA9IGNvbG9yO1xcbn1cXG5cIixcbn07IiwiXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIHZlcnRleFNoYWRlcjogXCJ2YXJ5aW5nIHZlYzIgdlV2O1xcbnZhcnlpbmcgdmVjMiB2Q2FudmFzVXY7XFxuXFxudm9pZCBtYWluKCkge1xcbiAgdlV2ID0gdXY7ICBcXG4gIHZDYW52YXNVdiA9IHV2O1xcbiAgZ2xfUG9zaXRpb24gPSBwcm9qZWN0aW9uTWF0cml4ICpcXG4gICAgICAgICAgICAgICAgbW9kZWxWaWV3TWF0cml4ICpcXG4gICAgICAgICAgICAgICAgdmVjNChwb3NpdGlvbiwxLjApO1xcbn1cXG5cIixcbiAgICBmcmFnbWVudFNoYWRlcjogXCIjaWZkZWYgR0xfRVNcXG5wcmVjaXNpb24gbWVkaXVtcCBmbG9hdDtcXG4jZW5kaWZcXG5cXG5cXG4vKlxcbm1ha2luZyBpdCBsb29rIG1vcmUgbGlrZSBhY3R1YWwgZmlsbSBncmFpbjpcXG4tIGEgY29uc3RhbnQgdW5kdWxhdGluZyBcXFwiYnVyblxcXCJcXG4tIG9jY2FzaW9uYWwgc3BlY2tzIGZsYXNoaW5nIGluIHNlbWktcmFuZG9tIGxvb2tpbmcgcGxhY2VzXFxuXFxudG9kbzpcXG4tIHJldmlzaXQgaG9yaXpvbnRhbCBzY3JhdGNoZXMuLiBraW5kYSBoYWNrIHJpZ2h0IG5vd1xcbi0gaGFpcmxpbmUgc3BlY2tzXFxuLSBncmFpbiBhbmltYXRpb24gc2hvdWxkIGJlIGluZGVwZW5kZW50IG9mIGNvbnN0YW50IGJ1cm4gYW5pbWF0aW9uXFxuXFxuVXNpbmcgR29yaWxsYSBHcmFpbidzIGZyZWUgXFxcIkNsZWFuXFxcIiBvdmVybGF5IGFzIGEgcmVmZXJlbmNlOlxcbmh0dHA6Ly9nb3JpbGxhZ3JhaW4uY29tL2ZlYXR1cmVzXFxuXFxuSG93IGl0IG1pZ2h0IHdvcmsgaW4gcHJhY3RpY2UgaW4gYSBnYW1lOlxcbi0gVXNlIHR3byBzaGFkZXJzOyBvbmUgZm9yIHRoZSBcXFwiZ3JhaW5cXFwiICh3aGljaCBpcyBwcmV0dHkgZXhwZW5zaXZlKVxcbiAgVGhpcyBvbmx5IG5lZWRzIHRvIGJlIHVwZGF0ZWQgb25jZSBldmVyeSA0MC01MG1zXFxuLSBBbm90aGVyIGZvciB0aGUgY29uc3RhbnRseSBtb3ZpbmcgZ3JhaW4gYW5kIGJ1cm5zL3NjcmF0Y2hlcywgd2hpY2ggaXMgcmVsYXRpdmVseSBjaGVhcGVyXFxuLSBBIG1vdmUgYWR2YW5jZWQgc3lzdGVtIG1pZ2h0IGFkZCBzY3JhdGNoZXMvZXRjIHVzaW5nIHRleHR1cmVzLiBcXG5cXG5AbWF0dGRlc2xcXG4qL1xcblxcbi8qXFxuRmlsbSBHcmFpbiBwb3N0LXByb2Nlc3Mgc2hhZGVyIHYxLjEgXFxuTWFydGlucyBVcGl0aXMgKG1hcnRpbnNoKSBkZXZsb2ctbWFydGluc2guYmxvZ3Nwb3QuY29tXFxuMjAxM1xcblxcbi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXFxuVGhpcyB3b3JrIGlzIGxpY2Vuc2VkIHVuZGVyIGEgQ3JlYXRpdmUgQ29tbW9ucyBBdHRyaWJ1dGlvbiAzLjAgVW5wb3J0ZWQgTGljZW5zZS5cXG5TbyB5b3UgYXJlIGZyZWUgdG8gc2hhcmUsIG1vZGlmeSBhbmQgYWRhcHQgaXQgZm9yIHlvdXIgbmVlZHMsIGFuZCBldmVuIHVzZSBpdCBmb3IgY29tbWVyY2lhbCB1c2UuXFxuSSB3b3VsZCBhbHNvIGxvdmUgdG8gaGVhciBhYm91dCBhIHByb2plY3QgeW91IGFyZSB1c2luZyBpdC5cXG5cXG5IYXZlIGZ1bixcXG5NYXJ0aW5zXFxuLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cXG5cXG5QZXJsaW4gbm9pc2Ugc2hhZGVyIGJ5IHRvbmVidXJzdDpcXG5odHRwOi8vbWFjaGluZXNkb250Y2FyZS53b3JkcHJlc3MuY29tLzIwMDkvMDYvMjUvM2QtcGVybGluLW5vaXNlLXNwaGVyZS12ZXJ0ZXgtc2hhZGVyLXNvdXJjZWNvZGUvXFxuKi9cXG5cXG52YXJ5aW5nIHZlYzIgdlV2O1xcbnVuaWZvcm0gc2FtcGxlcjJEIHRleHR1cmU7XFxuXFxudW5pZm9ybSBmbG9hdCB0aW1lcjtcXG51bmlmb3JtIHZlYzIgcmVzb2x1dGlvbjtcXG5cXG5mbG9hdCB3aWR0aCA9IHJlc29sdXRpb24ueDtcXG5mbG9hdCBoZWlnaHQgPSByZXNvbHV0aW9uLnk7XFxuXFxuY29uc3QgZmxvYXQgcGVybVRleFVuaXQgPSAxLjAvMjU2LjA7ICAgICAgICAvLyBQZXJtIHRleHR1cmUgdGV4ZWwtc2l6ZVxcbmNvbnN0IGZsb2F0IHBlcm1UZXhVbml0SGFsZiA9IDAuNS8yNTYuMDsgICAgLy8gSGFsZiBwZXJtIHRleHR1cmUgdGV4ZWwtc2l6ZVxcblxcbnVuaWZvcm0gZmxvYXQgZ3JhaW5hbW91bnQ7IC8vZ3JhaW4gYW1vdW50XFxudW5pZm9ybSBib29sIGNvbG9yZWQ7IC8vY29sb3JlZCBub2lzZT9cXG51bmlmb3JtIGZsb2F0IGNvbG9yYW1vdW50O1xcbnVuaWZvcm0gZmxvYXQgZ3JhaW5zaXplOyAvL2dyYWluIHBhcnRpY2xlIHNpemUgKDEuNSAtIDIuNSlcXG51bmlmb3JtIGZsb2F0IGx1bWFtb3VudDsgLy9cXG5cXG4vL3RoZSBncmFpbiBhbmltYXRpb25cXG5mbG9hdCBhbmltID0gdGltZXI7IC8vdG9vIGZhc3QgcmlnaHQgbm93Li4gc2hvdWxkIGJlIG1vcmUgbGlrZSA0MS42NiBtc1xcblxcbiNkZWZpbmUgQmxlbmQoYmFzZSwgYmxlbmQsIGZ1bmNmKSAgICAgICB2ZWMzKGZ1bmNmKGJhc2UuciwgYmxlbmQuciksIGZ1bmNmKGJhc2UuZywgYmxlbmQuZyksIGZ1bmNmKGJhc2UuYiwgYmxlbmQuYikpXFxuI2RlZmluZSBCbGVuZFNvZnRMaWdodGYoYmFzZSwgYmxlbmQpICAgICgoYmxlbmQgPCAwLjUpID8gKDIuMCAqIGJhc2UgKiBibGVuZCArIGJhc2UgKiBiYXNlICogKDEuMCAtIDIuMCAqIGJsZW5kKSkgOiAoc3FydChiYXNlKSAqICgyLjAgKiBibGVuZCAtIDEuMCkgKyAyLjAgKiBiYXNlICogKDEuMCAtIGJsZW5kKSkpXFxuI2RlZmluZSBCbGVuZExpZ2h0ZW5mKGJhc2UsIGJsZW5kKSAgICAgIG1heChibGVuZCwgYmFzZSlcXG5cXG4jZGVmaW5lIEJsZW5kU29mdExpZ2h0KGJhc2UsIGJsZW5kKSAgICAgQmxlbmQoYmFzZSwgYmxlbmQsIEJsZW5kU29mdExpZ2h0ZilcXG4jZGVmaW5lIEJsZW5kTGlnaHRlbiAgICAgICAgICAgICAgICAgICAgQmxlbmRMaWdodGVuZlxcblxcbi8vYSByYW5kb20gdGV4dHVyZSBnZW5lcmF0b3IsIGJ1dCB5b3UgY2FuIGFsc28gdXNlIGEgcHJlLWNvbXB1dGVkIHBlcnR1cmJhdGlvbiB0ZXh0dXJlXFxudmVjNCBybm0oaW4gdmVjMiB0YykgXFxue1xcbiAgICBmbG9hdCBub2lzZSA9ICBzaW4oZG90KHRjLHZlYzIoYW5pbSkrdmVjMigxMi45ODk4LDc4LjIzMykpKSAqIDQzNzU4LjU0NTM7XFxuICAgIGZsb2F0IG5vaXNlUiA9ICBmcmFjdChub2lzZSkqMi4wLTEuMDtcXG4gICAgZmxvYXQgbm9pc2VHID0gIGZyYWN0KG5vaXNlKjEuMjE1NCkqMi4wLTEuMDsgXFxuICAgIGZsb2F0IG5vaXNlQiA9ICBmcmFjdChub2lzZSoxLjM0NTMpKjIuMC0xLjA7XFxuICAgIGZsb2F0IG5vaXNlQSA9ICBmcmFjdChub2lzZSoxLjM2NDcpKjIuMC0xLjA7XFxuICAgIFxcbiAgICByZXR1cm4gdmVjNChub2lzZVIsbm9pc2VHLG5vaXNlQixub2lzZUEpO1xcbn1cXG5cXG5mbG9hdCBmYWRlKGluIGZsb2F0IHQpIHtcXG4gICAgcmV0dXJuIHQqdCp0Kih0Kih0KjYuMC0xNS4wKSsxMC4wKTtcXG59XFxuXFxuZmxvYXQgcG5vaXNlM0QoaW4gdmVjMyBwKVxcbntcXG4gICAgdmVjMyBwaSA9IHBlcm1UZXhVbml0KmZsb29yKHApK3Blcm1UZXhVbml0SGFsZjsgLy8gSW50ZWdlciBwYXJ0LCBzY2FsZWQgc28gKzEgbW92ZXMgcGVybVRleFVuaXQgdGV4ZWxcXG4gICAgLy8gYW5kIG9mZnNldCAxLzIgdGV4ZWwgdG8gc2FtcGxlIHRleGVsIGNlbnRlcnNcXG4gICAgdmVjMyBwZiA9IGZyYWN0KHApOyAgICAgLy8gRnJhY3Rpb25hbCBwYXJ0IGZvciBpbnRlcnBvbGF0aW9uXFxuXFxuICAgIC8vIE5vaXNlIGNvbnRyaWJ1dGlvbnMgZnJvbSAoeD0wLCB5PTApLCB6PTAgYW5kIHo9MVxcbiAgICBmbG9hdCBwZXJtMDAgPSBybm0ocGkueHkpLmEgO1xcbiAgICB2ZWMzICBncmFkMDAwID0gcm5tKHZlYzIocGVybTAwLCBwaS56KSkucmdiICogNC4wIC0gMS4wO1xcbiAgICBmbG9hdCBuMDAwID0gZG90KGdyYWQwMDAsIHBmKTtcXG4gICAgdmVjMyAgZ3JhZDAwMSA9IHJubSh2ZWMyKHBlcm0wMCwgcGkueiArIHBlcm1UZXhVbml0KSkucmdiICogNC4wIC0gMS4wO1xcbiAgICBmbG9hdCBuMDAxID0gZG90KGdyYWQwMDEsIHBmIC0gdmVjMygwLjAsIDAuMCwgMS4wKSk7XFxuXFxuICAgIC8vIE5vaXNlIGNvbnRyaWJ1dGlvbnMgZnJvbSAoeD0wLCB5PTEpLCB6PTAgYW5kIHo9MVxcbiAgICBmbG9hdCBwZXJtMDEgPSBybm0ocGkueHkgKyB2ZWMyKDAuMCwgcGVybVRleFVuaXQpKS5hIDtcXG4gICAgdmVjMyAgZ3JhZDAxMCA9IHJubSh2ZWMyKHBlcm0wMSwgcGkueikpLnJnYiAqIDQuMCAtIDEuMDtcXG4gICAgZmxvYXQgbjAxMCA9IGRvdChncmFkMDEwLCBwZiAtIHZlYzMoMC4wLCAxLjAsIDAuMCkpO1xcbiAgICB2ZWMzICBncmFkMDExID0gcm5tKHZlYzIocGVybTAxLCBwaS56ICsgcGVybVRleFVuaXQpKS5yZ2IgKiA0LjAgLSAxLjA7XFxuICAgIGZsb2F0IG4wMTEgPSBkb3QoZ3JhZDAxMSwgcGYgLSB2ZWMzKDAuMCwgMS4wLCAxLjApKTtcXG5cXG4gICAgLy8gTm9pc2UgY29udHJpYnV0aW9ucyBmcm9tICh4PTEsIHk9MCksIHo9MCBhbmQgej0xXFxuICAgIGZsb2F0IHBlcm0xMCA9IHJubShwaS54eSArIHZlYzIocGVybVRleFVuaXQsIDAuMCkpLmEgO1xcbiAgICB2ZWMzICBncmFkMTAwID0gcm5tKHZlYzIocGVybTEwLCBwaS56KSkucmdiICogNC4wIC0gMS4wO1xcbiAgICBmbG9hdCBuMTAwID0gZG90KGdyYWQxMDAsIHBmIC0gdmVjMygxLjAsIDAuMCwgMC4wKSk7XFxuICAgIHZlYzMgIGdyYWQxMDEgPSBybm0odmVjMihwZXJtMTAsIHBpLnogKyBwZXJtVGV4VW5pdCkpLnJnYiAqIDQuMCAtIDEuMDtcXG4gICAgZmxvYXQgbjEwMSA9IGRvdChncmFkMTAxLCBwZiAtIHZlYzMoMS4wLCAwLjAsIDEuMCkpO1xcblxcbiAgICAvLyBOb2lzZSBjb250cmlidXRpb25zIGZyb20gKHg9MSwgeT0xKSwgej0wIGFuZCB6PTFcXG4gICAgZmxvYXQgcGVybTExID0gcm5tKHBpLnh5ICsgdmVjMihwZXJtVGV4VW5pdCwgcGVybVRleFVuaXQpKS5hIDtcXG4gICAgdmVjMyAgZ3JhZDExMCA9IHJubSh2ZWMyKHBlcm0xMSwgcGkueikpLnJnYiAqIDQuMCAtIDEuMDtcXG4gICAgZmxvYXQgbjExMCA9IGRvdChncmFkMTEwLCBwZiAtIHZlYzMoMS4wLCAxLjAsIDAuMCkpO1xcbiAgICB2ZWMzICBncmFkMTExID0gcm5tKHZlYzIocGVybTExLCBwaS56ICsgcGVybVRleFVuaXQpKS5yZ2IgKiA0LjAgLSAxLjA7XFxuICAgIGZsb2F0IG4xMTEgPSBkb3QoZ3JhZDExMSwgcGYgLSB2ZWMzKDEuMCwgMS4wLCAxLjApKTtcXG5cXG4gICAgLy8gQmxlbmQgY29udHJpYnV0aW9ucyBhbG9uZyB4XFxuICAgIHZlYzQgbl94ID0gbWl4KHZlYzQobjAwMCwgbjAwMSwgbjAxMCwgbjAxMSksIHZlYzQobjEwMCwgbjEwMSwgbjExMCwgbjExMSksIGZhZGUocGYueCkpO1xcblxcbiAgICAvLyBCbGVuZCBjb250cmlidXRpb25zIGFsb25nIHlcXG4gICAgdmVjMiBuX3h5ID0gbWl4KG5feC54eSwgbl94Lnp3LCBmYWRlKHBmLnkpKTtcXG5cXG4gICAgLy8gQmxlbmQgY29udHJpYnV0aW9ucyBhbG9uZyB6XFxuICAgIGZsb2F0IG5feHl6ID0gbWl4KG5feHkueCwgbl94eS55LCBmYWRlKHBmLnopKTtcXG5cXG4gICAgLy8gV2UncmUgZG9uZSwgcmV0dXJuIHRoZSBmaW5hbCBub2lzZSB2YWx1ZS5cXG4gICAgcmV0dXJuIG5feHl6O1xcbn1cXG5cXG4vLzJkIGNvb3JkaW5hdGUgb3JpZW50YXRpb24gdGhpbmdcXG52ZWMyIGNvb3JkUm90KGluIHZlYzIgdGMsIGluIGZsb2F0IGFuZ2xlKVxcbntcXG4gICAgZmxvYXQgYXNwZWN0ID0gd2lkdGgvaGVpZ2h0O1xcbiAgICBmbG9hdCByb3RYID0gKCh0Yy54KjIuMC0xLjApKmFzcGVjdCpjb3MoYW5nbGUpKSAtICgodGMueSoyLjAtMS4wKSpzaW4oYW5nbGUpKTtcXG4gICAgZmxvYXQgcm90WSA9ICgodGMueSoyLjAtMS4wKSpjb3MoYW5nbGUpKSArICgodGMueCoyLjAtMS4wKSphc3BlY3Qqc2luKGFuZ2xlKSk7XFxuICAgIHJvdFggPSAoKHJvdFgvYXNwZWN0KSowLjUrMC41KTtcXG4gICAgcm90WSA9IHJvdFkqMC41KzAuNTtcXG4gICAgcmV0dXJuIHZlYzIocm90WCxyb3RZKTtcXG59XFxuXFxuXFxuaGlnaHAgZmxvYXQgcmFuZCh2ZWMyIGNvKVxcbntcXG4gICAgaGlnaHAgZmxvYXQgYSA9IDEyLjk4OTg7XFxuICAgIGhpZ2hwIGZsb2F0IGIgPSA3OC4yMzM7XFxuICAgIGhpZ2hwIGZsb2F0IGMgPSA0Mzc1OC41NDUzO1xcbiAgICBoaWdocCBmbG9hdCBkdD0gZG90KGNvLnh5ICx2ZWMyKGEsYikpO1xcbiAgICBoaWdocCBmbG9hdCBzbj0gbW9kKGR0LDMuMTQpO1xcbiAgICByZXR1cm4gZnJhY3Qoc2luKHNuKSAqIGMpO1xcbn1cXG5cXG4vL2dvb2QgZm9yIGxhcmdlIGNsdW1wcyBvZiBzbW9vdGggbG9va2luZyBub2lzZSwgYnV0IHRvbyByZXBldGl0aXZlXFxuLy9mb3Igc21hbGwgZ3JhaW5zXFxuZmxvYXQgZmFzdE5vaXNlKHZlYzIgbikge1xcblxcdGNvbnN0IHZlYzIgZCA9IHZlYzIoMC4wLCAxLjApO1xcblxcdHZlYzIgYiA9IGZsb29yKG4pLCBmID0gc21vb3Roc3RlcCh2ZWMyKDAuMCksIHZlYzIoMS4wKSwgZnJhY3QobikpO1xcblxcdHJldHVybiBtaXgobWl4KHJhbmQoYiksIHJhbmQoYiArIGQueXggKSwgZi54KSwgbWl4KHJhbmQoYiArIGQueHkgKSwgcmFuZChiICsgZC55eSApLCBmLngpLCBmLnkpO1xcbn1cXG5cXG5cXG5cXG52b2lkIG1haW4oIHZvaWQgKSB7XFxuXFxuXFx0dmVjMiBwb3NpdGlvbiA9IHZVdjtcXG5cXG5cXHRcXG5cXHQvL2Zsb2F0IGMgPSBncmFpbihwb3NpdGlvbiwgMS4wKTtcXG5cXHRmbG9hdCBjID0gMS4wO1xcblxcdHZlYzMgY29sb3IgPSB2ZWMzKGMpO1xcblxcdFxcblxcdHZlYzIgdGV4Q29vcmQgPSBwb3NpdGlvbi5zdDtcXG5cXHRcXG5cXHRcXG5cXHRcXG5cXHR2ZWMzIHJvdE9mZnNldCA9IHZlYzMoMS40MjUsMy44OTIsNS44MzUpOyAvL3JvdGF0aW9uIG9mZnNldCB2YWx1ZXMgIFxcblxcdHZlYzIgcm90Q29vcmRzUiA9IGNvb3JkUm90KHRleENvb3JkLCBhbmltK3JvdE9mZnNldC54KTtcXG5cXHR2ZWMzIG5vaXNlID0gdmVjMyhwbm9pc2UzRCh2ZWMzKHJvdENvb3Jkc1IqdmVjMih3aWR0aC9ncmFpbnNpemUsaGVpZ2h0L2dyYWluc2l6ZSksMC4wKSkpO1xcblxcdFxcblxcdGlmIChjb2xvcmVkKVxcblxcdHtcXG5cXHRcXHR2ZWMyIHJvdENvb3Jkc0cgPSBjb29yZFJvdCh0ZXhDb29yZCxhbmltKyByb3RPZmZzZXQueSk7XFxuXFx0XFx0dmVjMiByb3RDb29yZHNCID0gY29vcmRSb3QodGV4Q29vcmQsYW5pbSsgcm90T2Zmc2V0LnopO1xcblxcdFxcdFxcblxcdFxcdG5vaXNlLmcgPSBtaXgobm9pc2Uucixwbm9pc2UzRCh2ZWMzKHJvdENvb3Jkc0cqdmVjMih3aWR0aC9ncmFpbnNpemUsaGVpZ2h0L2dyYWluc2l6ZSksMS4wKSksY29sb3JhbW91bnQpO1xcblxcdFxcdG5vaXNlLmIgPSBtaXgobm9pc2Uucixwbm9pc2UzRCh2ZWMzKHJvdENvb3Jkc0IqdmVjMih3aWR0aC9ncmFpbnNpemUsaGVpZ2h0L2dyYWluc2l6ZSksMi4wKSksY29sb3JhbW91bnQpO1xcblxcdH1cXG5cXG5cXG4gICAgdmVjNCBkaWZmdXNlID0gdGV4dHVyZTJEKHRleHR1cmUsIHZVdik7XFxuICAgIHZlYzMgY29sID0gZGlmZnVzZS5yZ2I7XFxuICAgIFxcblxcblxcdGNvbG9yID0gbm9pc2U7XFxuXFx0Ly9jb25zdGFudCBtb3ZpbmcgYnVyblxcbiAgICBjb2xvciArPSB2ZWMzKCBmYXN0Tm9pc2UodGV4Q29vcmQqc2luKHRpbWVyKjAuMSkqMy4wICsgZmFzdE5vaXNlKHRpbWVyKjAuNCt0ZXhDb29yZCoyLjApKSApKjAuMjtcXG4gICAgXFxuXFx0XFxuICAgIHZlYzMgbHVtY29lZmYgPSB2ZWMzKDAuMjk5LDAuNTg3LDAuMTE0KTtcXG4gICAgZmxvYXQgbHVtaW5hbmNlID0gbWl4KDAuMCxkb3QoY29sLCBsdW1jb2VmZiksbHVtYW1vdW50KTtcXG4gICAgZmxvYXQgbHVtID0gc21vb3Roc3RlcCgwLjIsMC4wLGx1bWluYW5jZSk7XFxuICAgIGx1bSArPSBsdW1pbmFuY2U7XFxuXFxuICAgIGNvbG9yID0gbWl4KGNvbG9yLHZlYzMoMC4wKSxwb3cobHVtLDQuMCkpO1xcdFxcbiAgICBjb2wgKz0gY29sb3IqZ3JhaW5hbW91bnQ7XFxuICAgIFxcbiAgICBjb2wgPSBtaXgoY29sLCBCbGVuZFNvZnRMaWdodChjb2wsIGNvbG9yKSwgZ3JhaW5hbW91bnQgKTtcXG5cXG4gICAgXFxuICAgIC8vbGFyZ2Ugb2NjYXNpb25hbCBidXJuc1xcbiAgICBmbG9hdCBzcGVjcyA9IGZhc3ROb2lzZSh0ZXhDb29yZCooMTAuMCtzaW4odGltZXIpKjUuMCkgKyBmYXN0Tm9pc2UodGltZXIrdGV4Q29vcmQqNTAuMCkgKTtcXG4gICAgY29sIC09IHZlYzMoIHNtb290aHN0ZXAoMC45NTUsIDAuOTYsIHNwZWNzKnNpbih0aW1lcio0LjApICApICkqMC4wNTsgICBcXG4gICAgc3BlY3MgPSBmYXN0Tm9pc2UodGV4Q29vcmQqMS4wKigxMC4wK3Npbih0aW1lcikqNS4wKSAtIGZhc3ROb2lzZSh0aW1lcit0ZXhDb29yZCo0MC4wKSApO1xcbiAgICBjb2wgLT0gKDEuLXZlYzMoIHNtb290aHN0ZXAoMC45OSwgMC45NiwgKHNwZWNzKSooc2luKGNvcyh0aW1lcikqNC4wKS8yLiswLjUpKSApKSowLjA3O1xcbiAgICBcXG4gICAgLy8gLy8gLy90aGlzIGlzIHJlYWxseSBjcmFwcHkgYW5kIHNob3VsZCBiZSByZXZpc2l0ZWQuLi5cXG4gICAgY29sIC09IGNsYW1wKCAwLjEqdmVjMyggc21vb3Roc3RlcCgwLjAwMDAwMSwgMC4wMDAwLCByYW5kKHRleENvb3JkLnh4KnRpbWVyKSApICogKGFicyhjb3ModGltZXIpKnNpbih0aW1lcioxLjUpKS0wLjUpICksIDAuMCwgMS4wICk7XFxuXFxuXFxuXFxuICAgIC8vIGNvbCA9IGNvbG9yO1xcbiAgICAvL2NvbCA9IGNvbG9yKmdyYWluYW1vdW50O1xcbiAgICAvLyBjb2wgPSBjb2wrY29sb3IqZ3JhaW5hbW91bnQ7XFxuXFxuXFx0Z2xfRnJhZ0NvbG9yID0gdmVjNCggY29sLCBkaWZmdXNlLmEgKTtcXG59XCIsXG59OyIsIlxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICB2ZXJ0ZXhTaGFkZXI6IFwidmFyeWluZyB2ZWMyIHZVdjtcXG52YXJ5aW5nIHZlYzIgdkNhbnZhc1V2O1xcblxcbnZvaWQgbWFpbigpIHtcXG4gIHZVdiA9IHV2OyAgXFxuICB2Q2FudmFzVXYgPSB1djtcXG4gIGdsX1Bvc2l0aW9uID0gcHJvamVjdGlvbk1hdHJpeCAqXFxuICAgICAgICAgICAgICAgIG1vZGVsVmlld01hdHJpeCAqXFxuICAgICAgICAgICAgICAgIHZlYzQocG9zaXRpb24sMS4wKTtcXG59XFxuXCIsXG4gICAgZnJhZ21lbnRTaGFkZXI6IFwiLypcXG4gICAgQ3ViaWMgTGVucyBEaXN0b3J0aW9uIEdMU0wgU2hhZGVyXFxuXFxuICAgIE9yaWdpbmFsIExlbnMgRGlzdG9ydGlvbiBBbGdvcml0aG0gZnJvbSBTU29udGVjaCAoU3ludGhleWVzKVxcbiAgICBodHRwOi8vd3d3LnNzb250ZWNoLmNvbS9jb250ZW50L2xlbnNhbGcuaHRtXFxuXFxuICAgIHIyID0gaW1hZ2VfYXNwZWN0KmltYWdlX2FzcGVjdCp1KnUgKyB2KnZcXG4gICAgZiA9IDEgKyByMiooayArIGtjdWJlKnNxcnQocjIpKVxcbiAgICB1JyA9IGYqdVxcbiAgICB2JyA9IGYqdlxcblxcbiAgICBhdXRob3IgOiBGcmFuY29pcyBUYXJsaWVyXFxuICAgIHdlYnNpdGUgOiB3d3cuZnJhbmNvaXMtdGFybGllci5jb20vYmxvZy9pbmRleC5waHAvMjAwOS8xMS9jdWJpYy1sZW5zLWRpc3RvcnRpb24tc2hhZGVyXFxuICAgICAgICBcXG4gICAgbW9kaWZpZWQgYnkgTWFydGlucyBVcGl0aXMgIFxcbiovXFxuXFxuLypcXG5GaWxtIEdyYWluIHBvc3QtcHJvY2VzcyBzaGFkZXIgdjEuMSBcXG5NYXJ0aW5zIFVwaXRpcyAobWFydGluc2gpIGRldmxvZy1tYXJ0aW5zaC5ibG9nc3BvdC5jb21cXG4yMDEzXFxuXFxuLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cXG5UaGlzIHdvcmsgaXMgbGljZW5zZWQgdW5kZXIgYSBDcmVhdGl2ZSBDb21tb25zIEF0dHJpYnV0aW9uIDMuMCBVbnBvcnRlZCBMaWNlbnNlLlxcblNvIHlvdSBhcmUgZnJlZSB0byBzaGFyZSwgbW9kaWZ5IGFuZCBhZGFwdCBpdCBmb3IgeW91ciBuZWVkcywgYW5kIGV2ZW4gdXNlIGl0IGZvciBjb21tZXJjaWFsIHVzZS5cXG5JIHdvdWxkIGFsc28gbG92ZSB0byBoZWFyIGFib3V0IGEgcHJvamVjdCB5b3UgYXJlIHVzaW5nIGl0LlxcblxcbkhhdmUgZnVuLFxcbk1hcnRpbnNcXG4tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxcblxcblBlcmxpbiBub2lzZSBzaGFkZXIgYnkgdG9uZWJ1cnN0Olxcbmh0dHA6Ly9tYWNoaW5lc2RvbnRjYXJlLndvcmRwcmVzcy5jb20vMjAwOS8wNi8yNS8zZC1wZXJsaW4tbm9pc2Utc3BoZXJlLXZlcnRleC1zaGFkZXItc291cmNlY29kZS9cXG4qL1xcblxcbnVuaWZvcm0gZmxvYXQgdGltZXI7XFxuXFxuY29uc3QgZmxvYXQgcGVybVRleFVuaXQgPSAxLjAvMjU2LjA7ICAgICAgICAvLyBQZXJtIHRleHR1cmUgdGV4ZWwtc2l6ZVxcbmNvbnN0IGZsb2F0IHBlcm1UZXhVbml0SGFsZiA9IDAuNS8yNTYuMDsgICAgLy8gSGFsZiBwZXJtIHRleHR1cmUgdGV4ZWwtc2l6ZVxcblxcbnVuaWZvcm0gZmxvYXQgZ3JhaW5hbW91bnQ7IC8vZ3JhaW4gYW1vdW50XFxudW5pZm9ybSBib29sIGNvbG9yZWQ7IC8vY29sb3JlZCBub2lzZT9cXG51bmlmb3JtIGZsb2F0IGNvbG9yYW1vdW50O1xcbnVuaWZvcm0gZmxvYXQgZ3JhaW5zaXplOyAvL2dyYWluIHBhcnRpY2xlIHNpemUgKDEuNSAtIDIuNSlcXG51bmlmb3JtIGZsb2F0IGx1bWFtb3VudDsgLy9cXG51bmlmb3JtIGZsb2F0IGZpbHRlclN0cmVuZ3RoO1xcblxcbnZhcnlpbmcgdmVjMiB2VXY7XFxudmFyeWluZyB2ZWMyIHZDYW52YXNVdjtcXG51bmlmb3JtIHZlYzIgcmVzb2x1dGlvbjtcXG51bmlmb3JtIHNhbXBsZXIyRCB0ZXh0dXJlO1xcblxcbnVuaWZvcm0gZmxvYXQgaywga2N1YmUsIHNjYWxlLCBkaXNwZXJzaW9uLCBibHVyQW1vdW50OyAvL2sgPSAwLjIsIGtjdWJlID0gMC4zLCBzY2FsZSA9IDAuOSwgZGlzcGVyc2lvbiA9IDAuMDFcXG51bmlmb3JtIGJvb2wgYmx1ckVuYWJsZWQ7XFxudW5pZm9ybSBmbG9hdCBzY3JhdGNoZXM7XFxudW5pZm9ybSBmbG9hdCBidXJuO1xcblxcbiNkZWZpbmUgTE9PS1VQX0ZJTFRFUlxcblxcbnVuaWZvcm0gc2FtcGxlcjJEIGxvb2t1cFRleHR1cmU7XFxuXFxuY29uc3QgZmxvYXQgdmlnbmV0dGVfc2l6ZSA9IDEuMTsgLy8gdmlnbmV0dGUgc2l6ZVxcbmNvbnN0IGZsb2F0IHRvbGVyYW5jZSA9IDAuNzsgLy9lZGdlIHNvZnRuZXNzXFxuXFxuXFxuZmxvYXQgd2lkdGggPSByZXNvbHV0aW9uLng7XFxuZmxvYXQgaGVpZ2h0ID0gcmVzb2x1dGlvbi55O1xcblxcbnZlYzIgcmFuZCh2ZWMyIGNvKSAvL25lZWRlZCBmb3IgZmFzdCBub2lzZSBiYXNlZCBibHVycmluZ1xcbnsgLy9UT0RPOiB1c2UgYSAxRCBuZWFyZXN0LW5laWdoYm91ciB0ZXh0dXJlIGxvb2t1cCA/IFxcbiAgICBmbG9hdCBub2lzZTEgPSAgKGZyYWN0KHNpbihkb3QoY28gLHZlYzIoMTIuOTg5OCw3OC4yMzMpKSkgKiA0Mzc1OC41NDUzKSk7XFxuICAgIGZsb2F0IG5vaXNlMiA9ICAoZnJhY3Qoc2luKGRvdChjbyAsdmVjMigxMi45ODk4LDc4LjIzMykqMi4wKSkgKiA0Mzc1OC41NDUzKSk7XFxuICAgIHJldHVybiBjbGFtcCh2ZWMyKG5vaXNlMSxub2lzZTIpLDAuMCwxLjApO1xcbn1cXG5cXG5oaWdocCBmbG9hdCBoYXNoKHZlYzIgY28pXFxue1xcbiAgICBoaWdocCBmbG9hdCBhID0gMTIuOTg5ODtcXG4gICAgaGlnaHAgZmxvYXQgYiA9IDc4LjIzMztcXG4gICAgaGlnaHAgZmxvYXQgYyA9IDQzNzU4LjU0NTM7XFxuICAgIGhpZ2hwIGZsb2F0IGR0PSBkb3QoY28ueHkgLHZlYzIoYSxiKSk7XFxuICAgIGhpZ2hwIGZsb2F0IHNuPSBtb2QoZHQsMy4xNCk7XFxuICAgIHJldHVybiBmcmFjdChzaW4oc24pICogYyk7XFxufVxcblxcblxcbnZlYzMgYmx1cih2ZWMyIGNvb3JkcylcXG57IFxcbiAgICAvL1RPRE86IHRoZSBiZWxvdyB2aWduZXR0ZSBjb2RlIGNhbiBiZSBwdWxsZWQgb3V0IG9mIHRoaXMgZnVuY3Rpb24gYW5kIHJldXNlZFxcbiAgICB2ZWMyIG5vaXNlID0gcmFuZCh2VXYueHkpO1xcbiAgICBmbG9hdCB0b2xlcmFuY2UgPSAwLjI7XFxuICAgIGZsb2F0IHZpZ25ldHRlX3NpemUgPSAwLjU7XFxuICAgIHZlYzIgcG93ZXJzID0gcG93KGFicyh2ZWMyKHZDYW52YXNVdi5zIC0gMC41LHZDYW52YXNVdi50IC0gMC41KSksdmVjMigyLjApKTtcXG4gICAgZmxvYXQgcmFkaXVzU3FyZCA9IHBvdyh2aWduZXR0ZV9zaXplLDIuMCk7XFxuICAgIGZsb2F0IGdyYWRpZW50ID0gc21vb3Roc3RlcChyYWRpdXNTcXJkLXRvbGVyYW5jZSwgcmFkaXVzU3FyZCt0b2xlcmFuY2UsIHBvd2Vycy54K3Bvd2Vycy55KTtcXG4gICAgXFxuICAgIHZlYzQgY29sID0gdmVjNCgwLjApO1xcblxcbiAgICBmbG9hdCBYMSA9IGNvb3Jkcy54ICsgYmx1ckFtb3VudCAqIG5vaXNlLngqMC4wMDQgKiBncmFkaWVudDtcXG4gICAgZmxvYXQgWTEgPSBjb29yZHMueSArIGJsdXJBbW91bnQgKiBub2lzZS55KjAuMDA0ICogZ3JhZGllbnQ7XFxuICAgIGZsb2F0IFgyID0gY29vcmRzLnggLSBibHVyQW1vdW50ICogbm9pc2UueCowLjAwNCAqIGdyYWRpZW50O1xcbiAgICBmbG9hdCBZMiA9IGNvb3Jkcy55IC0gYmx1ckFtb3VudCAqIG5vaXNlLnkqMC4wMDQgKiBncmFkaWVudDtcXG4gICAgXFxuICAgIGZsb2F0IGludlgxID0gY29vcmRzLnggKyBibHVyQW1vdW50ICogKCgxLjAtbm9pc2UueCkqMC4wMDQpICogKGdyYWRpZW50ICogMC41KTtcXG4gICAgZmxvYXQgaW52WTEgPSBjb29yZHMueSArIGJsdXJBbW91bnQgKiAoKDEuMC1ub2lzZS55KSowLjAwNCkgKiAoZ3JhZGllbnQgKiAwLjUpO1xcbiAgICBmbG9hdCBpbnZYMiA9IGNvb3Jkcy54IC0gYmx1ckFtb3VudCAqICgoMS4wLW5vaXNlLngpKjAuMDA0KSAqIChncmFkaWVudCAqIDAuNSk7XFxuICAgIGZsb2F0IGludlkyID0gY29vcmRzLnkgLSBibHVyQW1vdW50ICogKCgxLjAtbm9pc2UueSkqMC4wMDQpICogKGdyYWRpZW50ICogMC41KTtcXG5cXG4gICAgLy9UT0RPOiBvcHRpbWl6ZSB0aGUgYmx1ciAtLT4gZGVwZW5kZW50IHRleHR1cmUgcmVhZHMgYW5kIHRleGVsIGNlbnRlcnMuLi5cXG4gICAgY29sICs9IHRleHR1cmUyRCh0ZXh0dXJlLCB2ZWMyKFgxLCBZMSkpKjAuMTtcXG4gICAgY29sICs9IHRleHR1cmUyRCh0ZXh0dXJlLCB2ZWMyKFgyLCBZMikpKjAuMTtcXG4gICAgY29sICs9IHRleHR1cmUyRCh0ZXh0dXJlLCB2ZWMyKFgxLCBZMikpKjAuMTtcXG4gICAgY29sICs9IHRleHR1cmUyRCh0ZXh0dXJlLCB2ZWMyKFgyLCBZMSkpKjAuMTtcXG4gICAgXFxuICAgIGNvbCArPSB0ZXh0dXJlMkQodGV4dHVyZSwgdmVjMihpbnZYMSwgaW52WTEpKSowLjE1O1xcbiAgICBjb2wgKz0gdGV4dHVyZTJEKHRleHR1cmUsIHZlYzIoaW52WDIsIGludlkyKSkqMC4xNTtcXG4gICAgY29sICs9IHRleHR1cmUyRCh0ZXh0dXJlLCB2ZWMyKGludlgxLCBpbnZZMikpKjAuMTU7XFxuICAgIGNvbCArPSB0ZXh0dXJlMkQodGV4dHVyZSwgdmVjMihpbnZYMiwgaW52WTEpKSowLjE1O1xcbiAgICBcXG4gICAgcmV0dXJuIGNvbC5yZ2I7XFxufVxcblxcblxcbi8vYSByYW5kb20gdGV4dHVyZSBnZW5lcmF0b3IsIGJ1dCB5b3UgY2FuIGFsc28gdXNlIGEgcHJlLWNvbXB1dGVkIHBlcnR1cmJhdGlvbiB0ZXh0dXJlXFxudmVjNCBybm0oaW4gdmVjMiB0YykgXFxue1xcbiAgICBmbG9hdCBub2lzZSA9ICBzaW4oZG90KHRjICsgdmVjMih0aW1lcix0aW1lciksdmVjMigxMi45ODk4LDc4LjIzMykpKSAqIDQzNzU4LjU0NTM7XFxuXFxuICAgIGZsb2F0IG5vaXNlUiA9ICBmcmFjdChub2lzZSkqMi4wLTEuMDtcXG4gICAgZmxvYXQgbm9pc2VHID0gIGZyYWN0KG5vaXNlKjEuMjE1NCkqMi4wLTEuMDsgXFxuICAgIGZsb2F0IG5vaXNlQiA9ICBmcmFjdChub2lzZSoxLjM0NTMpKjIuMC0xLjA7XFxuICAgIGZsb2F0IG5vaXNlQSA9ICBmcmFjdChub2lzZSoxLjM2NDcpKjIuMC0xLjA7XFxuICAgIFxcbiAgICByZXR1cm4gdmVjNChub2lzZVIsbm9pc2VHLG5vaXNlQixub2lzZUEpO1xcbn1cXG5cXG5mbG9hdCBmYWRlKGluIGZsb2F0IHQpIHtcXG4gICAgcmV0dXJuIHQqdCp0Kih0Kih0KjYuMC0xNS4wKSsxMC4wKTtcXG59XFxuXFxuZmxvYXQgcG5vaXNlM0QoaW4gdmVjMyBwKVxcbntcXG4gICAgdmVjMyBwaSA9IHBlcm1UZXhVbml0KmZsb29yKHApK3Blcm1UZXhVbml0SGFsZjsgLy8gSW50ZWdlciBwYXJ0LCBzY2FsZWQgc28gKzEgbW92ZXMgcGVybVRleFVuaXQgdGV4ZWxcXG4gICAgLy8gYW5kIG9mZnNldCAxLzIgdGV4ZWwgdG8gc2FtcGxlIHRleGVsIGNlbnRlcnNcXG4gICAgdmVjMyBwZiA9IGZyYWN0KHApOyAgICAgLy8gRnJhY3Rpb25hbCBwYXJ0IGZvciBpbnRlcnBvbGF0aW9uXFxuXFxuICAgIC8vIE5vaXNlIGNvbnRyaWJ1dGlvbnMgZnJvbSAoeD0wLCB5PTApLCB6PTAgYW5kIHo9MVxcbiAgICBmbG9hdCBwZXJtMDAgPSBybm0ocGkueHkpLmEgO1xcbiAgICB2ZWMzICBncmFkMDAwID0gcm5tKHZlYzIocGVybTAwLCBwaS56KSkucmdiICogNC4wIC0gMS4wO1xcbiAgICBmbG9hdCBuMDAwID0gZG90KGdyYWQwMDAsIHBmKTtcXG4gICAgdmVjMyAgZ3JhZDAwMSA9IHJubSh2ZWMyKHBlcm0wMCwgcGkueiArIHBlcm1UZXhVbml0KSkucmdiICogNC4wIC0gMS4wO1xcbiAgICBmbG9hdCBuMDAxID0gZG90KGdyYWQwMDEsIHBmIC0gdmVjMygwLjAsIDAuMCwgMS4wKSk7XFxuXFxuICAgIC8vIE5vaXNlIGNvbnRyaWJ1dGlvbnMgZnJvbSAoeD0wLCB5PTEpLCB6PTAgYW5kIHo9MVxcbiAgICBmbG9hdCBwZXJtMDEgPSBybm0ocGkueHkgKyB2ZWMyKDAuMCwgcGVybVRleFVuaXQpKS5hIDtcXG4gICAgdmVjMyAgZ3JhZDAxMCA9IHJubSh2ZWMyKHBlcm0wMSwgcGkueikpLnJnYiAqIDQuMCAtIDEuMDtcXG4gICAgZmxvYXQgbjAxMCA9IGRvdChncmFkMDEwLCBwZiAtIHZlYzMoMC4wLCAxLjAsIDAuMCkpO1xcbiAgICB2ZWMzICBncmFkMDExID0gcm5tKHZlYzIocGVybTAxLCBwaS56ICsgcGVybVRleFVuaXQpKS5yZ2IgKiA0LjAgLSAxLjA7XFxuICAgIGZsb2F0IG4wMTEgPSBkb3QoZ3JhZDAxMSwgcGYgLSB2ZWMzKDAuMCwgMS4wLCAxLjApKTtcXG5cXG4gICAgLy8gTm9pc2UgY29udHJpYnV0aW9ucyBmcm9tICh4PTEsIHk9MCksIHo9MCBhbmQgej0xXFxuICAgIGZsb2F0IHBlcm0xMCA9IHJubShwaS54eSArIHZlYzIocGVybVRleFVuaXQsIDAuMCkpLmEgO1xcbiAgICB2ZWMzICBncmFkMTAwID0gcm5tKHZlYzIocGVybTEwLCBwaS56KSkucmdiICogNC4wIC0gMS4wO1xcbiAgICBmbG9hdCBuMTAwID0gZG90KGdyYWQxMDAsIHBmIC0gdmVjMygxLjAsIDAuMCwgMC4wKSk7XFxuICAgIHZlYzMgIGdyYWQxMDEgPSBybm0odmVjMihwZXJtMTAsIHBpLnogKyBwZXJtVGV4VW5pdCkpLnJnYiAqIDQuMCAtIDEuMDtcXG4gICAgZmxvYXQgbjEwMSA9IGRvdChncmFkMTAxLCBwZiAtIHZlYzMoMS4wLCAwLjAsIDEuMCkpO1xcblxcbiAgICAvLyBOb2lzZSBjb250cmlidXRpb25zIGZyb20gKHg9MSwgeT0xKSwgej0wIGFuZCB6PTFcXG4gICAgZmxvYXQgcGVybTExID0gcm5tKHBpLnh5ICsgdmVjMihwZXJtVGV4VW5pdCwgcGVybVRleFVuaXQpKS5hIDtcXG4gICAgdmVjMyAgZ3JhZDExMCA9IHJubSh2ZWMyKHBlcm0xMSwgcGkueikpLnJnYiAqIDQuMCAtIDEuMDtcXG4gICAgZmxvYXQgbjExMCA9IGRvdChncmFkMTEwLCBwZiAtIHZlYzMoMS4wLCAxLjAsIDAuMCkpO1xcbiAgICB2ZWMzICBncmFkMTExID0gcm5tKHZlYzIocGVybTExLCBwaS56ICsgcGVybVRleFVuaXQpKS5yZ2IgKiA0LjAgLSAxLjA7XFxuICAgIGZsb2F0IG4xMTEgPSBkb3QoZ3JhZDExMSwgcGYgLSB2ZWMzKDEuMCwgMS4wLCAxLjApKTtcXG5cXG4gICAgLy8gQmxlbmQgY29udHJpYnV0aW9ucyBhbG9uZyB4XFxuICAgIHZlYzQgbl94ID0gbWl4KHZlYzQobjAwMCwgbjAwMSwgbjAxMCwgbjAxMSksIHZlYzQobjEwMCwgbjEwMSwgbjExMCwgbjExMSksIGZhZGUocGYueCkpO1xcblxcbiAgICAvLyBCbGVuZCBjb250cmlidXRpb25zIGFsb25nIHlcXG4gICAgdmVjMiBuX3h5ID0gbWl4KG5feC54eSwgbl94Lnp3LCBmYWRlKHBmLnkpKTtcXG5cXG4gICAgLy8gQmxlbmQgY29udHJpYnV0aW9ucyBhbG9uZyB6XFxuICAgIGZsb2F0IG5feHl6ID0gbWl4KG5feHkueCwgbl94eS55LCBmYWRlKHBmLnopKTtcXG5cXG4gICAgLy8gV2UncmUgZG9uZSwgcmV0dXJuIHRoZSBmaW5hbCBub2lzZSB2YWx1ZS5cXG4gICAgcmV0dXJuIG5feHl6O1xcbn1cXG5cXG4vLzJkIGNvb3JkaW5hdGUgb3JpZW50YXRpb24gdGhpbmdcXG52ZWMyIGNvb3JkUm90KGluIHZlYzIgdGMsIGluIGZsb2F0IGFuZ2xlKVxcbntcXG4gICAgZmxvYXQgYXNwZWN0ID0gd2lkdGgvaGVpZ2h0O1xcbiAgICBmbG9hdCByb3RYID0gKCh0Yy54KjIuMC0xLjApKmFzcGVjdCpjb3MoYW5nbGUpKSAtICgodGMueSoyLjAtMS4wKSpzaW4oYW5nbGUpKTtcXG4gICAgZmxvYXQgcm90WSA9ICgodGMueSoyLjAtMS4wKSpjb3MoYW5nbGUpKSArICgodGMueCoyLjAtMS4wKSphc3BlY3Qqc2luKGFuZ2xlKSk7XFxuICAgIHJvdFggPSAoKHJvdFgvYXNwZWN0KSowLjUrMC41KTtcXG4gICAgcm90WSA9IHJvdFkqMC41KzAuNTtcXG4gICAgcmV0dXJuIHZlYzIocm90WCxyb3RZKTtcXG59XFxuXFxuXFxuXFxuLy9nb29kIGZvciBsYXJnZSBjbHVtcHMgb2Ygc21vb3RoIGxvb2tpbmcgbm9pc2UsIGJ1dCB0b28gcmVwZXRpdGl2ZVxcbi8vZm9yIHNtYWxsIGdyYWluc1xcbmZsb2F0IGZhc3ROb2lzZSh2ZWMyIG4pIHtcXG4gICAgY29uc3QgdmVjMiBkID0gdmVjMigwLjAsIDEuMCk7XFxuICAgIHZlYzIgYiA9IGZsb29yKG4pLCBmID0gc21vb3Roc3RlcCh2ZWMyKDAuMCksIHZlYzIoMS4wKSwgZnJhY3QobikpO1xcbiAgICByZXR1cm4gbWl4KG1peChoYXNoKGIpLCBoYXNoKGIgKyBkLnl4ICksIGYueCksIG1peChoYXNoKGIgKyBkLnh5ICksIGhhc2goYiArIGQueXkgKSwgZi54KSwgZi55KTtcXG59XFxuXFxuXFxuXFxuXFxuXFxuXFxuXFxudm9pZCBtYWluKHZvaWQpXFxue1xcbiAgICAvL2luZGV4IG9mIHJlZnJhY3Rpb24gb2YgZWFjaCBjb2xvciBjaGFubmVsLCBjYXVzaW5nIGNocm9tYXRpYyBkaXNwZXJzaW9uXFxuICAgIHZlYzMgZXRhID0gdmVjMygxLjArZGlzcGVyc2lvbiowLjksIDEuMCtkaXNwZXJzaW9uKjAuNiwgMS4wK2Rpc3BlcnNpb24qMC4zKTtcXG4gICAgXFxuICAgIC8vdGV4dHVyZSBjb29yZGluYXRlc1xcbiAgICB2ZWMyIHRleGNvb3JkID0gdlV2O1xcbiAgICBcXG4gICAgLy9jYW52YXMgY29vcmRpbmF0ZXMgdG8gZ2V0IHRoZSBjZW50ZXIgb2YgcmVuZGVyZWQgdmlld3BvcnRcXG4gICAgLy92ZWMyIGNhbmNvb3JkID0gdlV2LnN0O1xcbiAgICB2ZWMyIGNhbmNvb3JkID0gdkNhbnZhc1V2O1xcblxcbiAgICBmbG9hdCByMiA9IChjYW5jb29yZC54LTAuNSkgKiAoY2FuY29vcmQueC0wLjUpICsgKGNhbmNvb3JkLnktMC41KSAqIChjYW5jb29yZC55LTAuNSk7ICAgICAgIFxcblxcbiAgICBmbG9hdCBmID0gMC4wO1xcblxcbiAgICAvL29ubHkgY29tcHV0ZSB0aGUgY3ViaWMgZGlzdG9ydGlvbiBpZiBuZWNlc3NhcnlcXG4gICAgXFxuICAgIGlmKCBrY3ViZSA9PSAwLjApXFxuICAgIHtcXG4gICAgICAgIGYgPSAxLjAgKyByMiAqIGs7XFxuICAgIH1lbHNle1xcbiAgICAgICAgZiA9IDEuMCArIHIyICogKGsgKyBrY3ViZSAqIHNxcnQocjIpKTtcXG4gICAgfVxcbiAgXFxuICAgIFxcblxcbiAgICAvLyBnZXQgdGhlIHJpZ2h0IHBpeGVsIGZvciB0aGUgY3VycmVudCBwb3NpdGlvblxcbiAgICBcXG4gICAgdmVjMiByQ29vcmRzID0gKGYqZXRhLnIpKnNjYWxlKih0ZXhjb29yZC54eS0wLjUpKzAuNTtcXG4gICAgdmVjMiBnQ29vcmRzID0gKGYqZXRhLmcpKnNjYWxlKih0ZXhjb29yZC54eS0wLjUpKzAuNTtcXG4gICAgdmVjMiBiQ29vcmRzID0gKGYqZXRhLmIpKnNjYWxlKih0ZXhjb29yZC54eS0wLjUpKzAuNTtcXG5cXG4gICAgdmVjMyBpbnB1dERpc3RvcnQgPSB2ZWMzKDAuMCk7IFxcbiAgICAgICAgXFxuXFxuICAgIGlucHV0RGlzdG9ydC5yID0gdGV4dHVyZTJEKHRleHR1cmUsckNvb3JkcykucjtcXG4gICAgaW5wdXREaXN0b3J0LmcgPSB0ZXh0dXJlMkQodGV4dHVyZSxnQ29vcmRzKS5nO1xcbiAgICBpbnB1dERpc3RvcnQuYiA9IHRleHR1cmUyRCh0ZXh0dXJlLGJDb29yZHMpLmI7XFxuICAgIFxcbiAgICBpZiAoYmx1ckVuYWJsZWQpXFxuICAgIHtcXG4gICAgICAgIGlucHV0RGlzdG9ydC5yID0gYmx1cihyQ29vcmRzKS5yO1xcbiAgICAgICAgaW5wdXREaXN0b3J0LmcgPSBibHVyKGdDb29yZHMpLmc7XFxuICAgICAgICBpbnB1dERpc3RvcnQuYiA9IGJsdXIoYkNvb3JkcykuYjtcXG4gICAgfVxcbiAgICBcXG4gICAgZ2xfRnJhZ0NvbG9yID0gdmVjNChpbnB1dERpc3RvcnQucixpbnB1dERpc3RvcnQuZyxpbnB1dERpc3RvcnQuYiwxLjApO1xcblxcbiAgICAgICAgXFxuICAgIC8vbWl4IGluIHZpZ25ldHRlXFxuICAgIGZsb2F0IGFzcGVjdHJhdGlvID0gd2lkdGgvaGVpZ2h0O1xcbiAgICB2ZWMyIHBvd2VycyA9IHBvdyhhYnModmVjMigodlV2LnMgLSAwLjUpKmFzcGVjdHJhdGlvLHZVdi50IC0gMC41KSksdmVjMigyLjApKTtcXG4gICAgZmxvYXQgcmFkaXVzU3FyZCA9IHBvdyh2aWduZXR0ZV9zaXplLDIuMCk7XFxuICAgIGZsb2F0IGdyYWRpZW50ID0gc21vb3Roc3RlcChyYWRpdXNTcXJkLXRvbGVyYW5jZSwgcmFkaXVzU3FyZCt0b2xlcmFuY2UsIHBvd2Vycy54K3Bvd2Vycy55KTtcXG4gICAgICAgIFxcbiAgICBnbF9GcmFnQ29sb3IgPSBtaXgoZ2xfRnJhZ0NvbG9yLCB2ZWM0KDAuMCksIGdyYWRpZW50KTtcXG5cXG5cXG4gICAgXFxuICAgIHZlYzIgdGV4Q29vcmQgPSB2VXYuc3Q7XFxuICAgIFxcbiAgICB2ZWMzIHJvdE9mZnNldCA9IHZlYzMoMS40MjUsMy44OTIsNS44MzUpOyAvL3JvdGF0aW9uIG9mZnNldCB2YWx1ZXMgIFxcbiAgICB2ZWMyIHJvdENvb3Jkc1IgPSBjb29yZFJvdCh0ZXhDb29yZCwgdGltZXIgKyByb3RPZmZzZXQueCk7XFxuICAgIHZlYzMgbm9pc2UgPSB2ZWMzKHBub2lzZTNEKHZlYzMocm90Q29vcmRzUip2ZWMyKHdpZHRoL2dyYWluc2l6ZSxoZWlnaHQvZ3JhaW5zaXplKSwwLjApKSk7XFxuICAgIFxcblxcbiAgICBpZiAoY29sb3JlZClcXG4gICAge1xcbiAgICAgICAgdmVjMiByb3RDb29yZHNHID0gY29vcmRSb3QodGV4Q29vcmQsIHRpbWVyICsgcm90T2Zmc2V0LnkpO1xcbiAgICAgICAgdmVjMiByb3RDb29yZHNCID0gY29vcmRSb3QodGV4Q29vcmQsIHRpbWVyICsgcm90T2Zmc2V0LnopO1xcbiAgICAgICAgbm9pc2UuZyA9IG1peChub2lzZS5yLHBub2lzZTNEKHZlYzMocm90Q29vcmRzRyp2ZWMyKHdpZHRoL2dyYWluc2l6ZSxoZWlnaHQvZ3JhaW5zaXplKSwxLjApKSxjb2xvcmFtb3VudCk7XFxuICAgICAgICBub2lzZS5iID0gbWl4KG5vaXNlLnIscG5vaXNlM0QodmVjMyhyb3RDb29yZHNCKnZlYzIod2lkdGgvZ3JhaW5zaXplLGhlaWdodC9ncmFpbnNpemUpLDIuMCkpLGNvbG9yYW1vdW50KTtcXG4gICAgfVxcblxcbiAgICAvLyBub2lzZSA9IHZlYzMoIGZhc3ROb2lzZSh0ZXhDb29yZCpzaW4odGltZXIqMC4xKSozLjAgKyBmYXN0Tm9pc2UodGltZXIqMC40K3RleENvb3JkKjIuMCkpICkqYnVybjtcXG4gICAgbm9pc2UgKz0gdmVjMyggc21vb3Roc3RlcCgwLjAsIDAuNiwgZmFzdE5vaXNlKHRleENvb3JkKnNpbih0aW1lciowLjEpKjUuMCArIGZhc3ROb2lzZSh0aW1lciowLjQrdGV4Q29vcmQqMi4wKSkpICkqYnVybjtcXG5cXG4gICAgdmVjMyBjb2wgPSBnbF9GcmFnQ29sb3IucmdiO1xcbiAgICAvLyB2ZWMzIGNvbCA9IHRleHR1cmUyRCh0ZXh0dXJlLCB0ZXhDb29yZCkucmdiO1xcblxcbiAgICAvL25vaXNpbmVzcyByZXNwb25zZSBjdXJ2ZSBiYXNlZCBvbiBzY2VuZSBsdW1pbmFuY2VcXG4gICAgdmVjMyBsdW1jb2VmZiA9IHZlYzMoMC4yOTksMC41ODcsMC4xMTQpO1xcbiAgICBmbG9hdCBsdW1pbmFuY2UgPSBtaXgoMC4wLGRvdChjb2wsIGx1bWNvZWZmKSxsdW1hbW91bnQpO1xcbiAgICBmbG9hdCBsdW0gPSBzbW9vdGhzdGVwKDAuMiwwLjAsbHVtaW5hbmNlKTtcXG4gICAgbHVtICs9IGx1bWluYW5jZTtcXG5cXG4gICAgbm9pc2UgPSBtaXgobm9pc2UsdmVjMygwLjApLHBvdyhsdW0sNC4wKSk7XFxuICAgIGNvbCA9IGNvbCtub2lzZSpncmFpbmFtb3VudDtcXG5cXG4gICAgaWYgKHNjcmF0Y2hlcyA+IDAuMDAwMSkge1xcblxcbiAgICAgICAgLy9sYXJnZSBvY2Nhc2lvbmFsIGJ1cm5zXFxuICAgICAgICBmbG9hdCBzcGVjcyA9IGZhc3ROb2lzZSh0ZXhDb29yZCooMTAuMCtzaW4odGltZXIpKjUuMCkgKyBmYXN0Tm9pc2UodGltZXIrdGV4Q29vcmQqNTAuMCkgKTtcXG4gICAgICAgIGNvbCAtPSB2ZWMzKCBzbW9vdGhzdGVwKDAuOTU1LCAwLjk2LCBzcGVjcypzaW4odGltZXIqNC4wKSAgKSApKnNjcmF0Y2hlcyowLjU7IC8vMC4wNSAgIFxcbiAgICAgICAgc3BlY3MgPSBmYXN0Tm9pc2UodGV4Q29vcmQqMS4wKigxMC4wK3Npbih0aW1lcikqNS4wKSAtIGZhc3ROb2lzZSh0aW1lcit0ZXhDb29yZCo0MC4wKSApO1xcbiAgICAgICAgY29sIC09ICgxLi12ZWMzKCBzbW9vdGhzdGVwKDAuOTksIDAuOTYsIChzcGVjcykqKHNpbihjb3ModGltZXIpKjQuMCkvMi4rMC41KSkgKSkqc2NyYXRjaGVzKjAuNzsgLy8wLjA3XFxuICAgICAgICBcXG4gICAgICAgIC8vIC8vIC8vdGhpcyBpcyByZWFsbHkgY3JhcHB5IGFuZCBzaG91bGQgYmUgcmV2aXNpdGVkLi4uXFxuICAgICAgICBjb2wgLT0gY2xhbXAoIHNjcmF0Y2hlcyp2ZWMzKCBzbW9vdGhzdGVwKDAuMDAwMDAxLCAwLjAwMDAsIGhhc2godGV4Q29vcmQueHgqdGltZXIpICkgKiAoYWJzKGNvcyh0aW1lcikqc2luKHRpbWVyKjEuNSkpLTAuNSkgKSwgMC4wLCAxLjAgKTtcXG4gICAgfVxcblxcblxcblxcbiAgICBnbF9GcmFnQ29sb3IgPSAgdmVjNChjb2wsMS4wKTtcXG5cXG4gICAgLy9taXggaW4gbG9va3VwIGZpbHRlclxcbiAgICAjaWZkZWYgTE9PS1VQX0ZJTFRFUlxcbiAgICAgICAgbG93cCB2ZWM0IHRleHR1cmVDb2xvciA9IGNsYW1wKGdsX0ZyYWdDb2xvciwwLjAsIDEuMCk7XFxuICAgICAgICAvLyBsb3dwIHZlYzQgdGV4dHVyZUNvbG9yID0gdGV4dHVyZTJEKGlucHV0SW1hZ2VUZXh0dXJlLCB0ZXh0dXJlQ29vcmRpbmF0ZSk7XFxuICAgICBcXG4gICAgICAgIG1lZGl1bXAgZmxvYXQgYmx1ZUNvbG9yID0gdGV4dHVyZUNvbG9yLmIgKiA2My4wO1xcblxcbiAgICAgICAgbWVkaXVtcCB2ZWMyIHF1YWQxO1xcbiAgICAgICAgcXVhZDEueSA9IGZsb29yKGZsb29yKGJsdWVDb2xvcikgLyA4LjApO1xcbiAgICAgICAgcXVhZDEueCA9IGZsb29yKGJsdWVDb2xvcikgLSAocXVhZDEueSAqIDguMCk7XFxuXFxuICAgICAgICBtZWRpdW1wIHZlYzIgcXVhZDI7XFxuICAgICAgICBxdWFkMi55ID0gZmxvb3IoY2VpbChibHVlQ29sb3IpIC8gOC4wKTtcXG4gICAgICAgIHF1YWQyLnggPSBjZWlsKGJsdWVDb2xvcikgLSAocXVhZDIueSAqIDguMCk7XFxuXFxuICAgICAgICBoaWdocCB2ZWMyIHRleFBvczE7XFxuICAgICAgICB0ZXhQb3MxLnggPSAocXVhZDEueCAqIDAuMTI1KSArIDAuNS81MTIuMCArICgoMC4xMjUgLSAxLjAvNTEyLjApICogdGV4dHVyZUNvbG9yLnIpO1xcbiAgICAgICAgdGV4UG9zMS55ID0gKHF1YWQxLnkgKiAwLjEyNSkgKyAwLjUvNTEyLjAgKyAoKDAuMTI1IC0gMS4wLzUxMi4wKSAqIHRleHR1cmVDb2xvci5nKTtcXG5cXG4gICAgICAgIHRleFBvczEueSA9IDEuMC10ZXhQb3MxLnk7XFxuXFxuICAgICAgICBoaWdocCB2ZWMyIHRleFBvczI7XFxuICAgICAgICB0ZXhQb3MyLnggPSAocXVhZDIueCAqIDAuMTI1KSArIDAuNS81MTIuMCArICgoMC4xMjUgLSAxLjAvNTEyLjApICogdGV4dHVyZUNvbG9yLnIpO1xcbiAgICAgICAgdGV4UG9zMi55ID0gKHF1YWQyLnkgKiAwLjEyNSkgKyAwLjUvNTEyLjAgKyAoKDAuMTI1IC0gMS4wLzUxMi4wKSAqIHRleHR1cmVDb2xvci5nKTtcXG5cXG4gICAgICAgIHRleFBvczIueSA9IDEuMC10ZXhQb3MyLnk7XFxuXFxuICAgICAgICBsb3dwIHZlYzQgbmV3Q29sb3IxID0gdGV4dHVyZTJEKGxvb2t1cFRleHR1cmUsIHRleFBvczEpO1xcbiAgICAgICAgbG93cCB2ZWM0IG5ld0NvbG9yMiA9IHRleHR1cmUyRChsb29rdXBUZXh0dXJlLCB0ZXhQb3MyKTtcXG5cXG4gICAgICAgIGxvd3AgdmVjNCBuZXdDb2xvciA9IG1peChuZXdDb2xvcjEsIG5ld0NvbG9yMiwgZnJhY3QoYmx1ZUNvbG9yKSk7XFxuICAgICAgICBnbF9GcmFnQ29sb3IucmdiID0gbWl4KGdsX0ZyYWdDb2xvci5yZ2IsIG5ld0NvbG9yLnJnYiwgZmlsdGVyU3RyZW5ndGgpO1xcbiAgICAjZW5kaWZcXG59XCIsXG59OyIsIi8qIVxuICAqIGRvbXJlYWR5IChjKSBEdXN0aW4gRGlheiAyMDE0IC0gTGljZW5zZSBNSVRcbiAgKi9cbiFmdW5jdGlvbiAobmFtZSwgZGVmaW5pdGlvbikge1xuXG4gIGlmICh0eXBlb2YgbW9kdWxlICE9ICd1bmRlZmluZWQnKSBtb2R1bGUuZXhwb3J0cyA9IGRlZmluaXRpb24oKVxuICBlbHNlIGlmICh0eXBlb2YgZGVmaW5lID09ICdmdW5jdGlvbicgJiYgdHlwZW9mIGRlZmluZS5hbWQgPT0gJ29iamVjdCcpIGRlZmluZShkZWZpbml0aW9uKVxuICBlbHNlIHRoaXNbbmFtZV0gPSBkZWZpbml0aW9uKClcblxufSgnZG9tcmVhZHknLCBmdW5jdGlvbiAoKSB7XG5cbiAgdmFyIGZucyA9IFtdLCBsaXN0ZW5lclxuICAgICwgZG9jID0gZG9jdW1lbnRcbiAgICAsIGRvbUNvbnRlbnRMb2FkZWQgPSAnRE9NQ29udGVudExvYWRlZCdcbiAgICAsIGxvYWRlZCA9IC9ebG9hZGVkfF5pfF5jLy50ZXN0KGRvYy5yZWFkeVN0YXRlKVxuXG4gIGlmICghbG9hZGVkKVxuICBkb2MuYWRkRXZlbnRMaXN0ZW5lcihkb21Db250ZW50TG9hZGVkLCBsaXN0ZW5lciA9IGZ1bmN0aW9uICgpIHtcbiAgICBkb2MucmVtb3ZlRXZlbnRMaXN0ZW5lcihkb21Db250ZW50TG9hZGVkLCBsaXN0ZW5lcilcbiAgICBsb2FkZWQgPSAxXG4gICAgd2hpbGUgKGxpc3RlbmVyID0gZm5zLnNoaWZ0KCkpIGxpc3RlbmVyKClcbiAgfSlcblxuICByZXR1cm4gZnVuY3Rpb24gKGZuKSB7XG4gICAgbG9hZGVkID8gZm4oKSA6IGZucy5wdXNoKGZuKVxuICB9XG5cbn0pO1xuIiwiLypcclxuICogcmFmLmpzXHJcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9uZ3J5bWFuL3JhZi5qc1xyXG4gKlxyXG4gKiBvcmlnaW5hbCByZXF1ZXN0QW5pbWF0aW9uRnJhbWUgcG9seWZpbGwgYnkgRXJpayBNw7ZsbGVyXHJcbiAqIGluc3BpcmVkIGZyb20gcGF1bF9pcmlzaCBnaXN0IGFuZCBwb3N0XHJcbiAqXHJcbiAqIENvcHlyaWdodCAoYykgMjAxMyBuZ3J5bWFuXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cclxuICovXHJcblxyXG4oZnVuY3Rpb24od2luZG93KSB7XHJcblx0dmFyIGxhc3RUaW1lID0gMCxcclxuXHRcdHZlbmRvcnMgPSBbJ3dlYmtpdCcsICdtb3onXSxcclxuXHRcdHJlcXVlc3RBbmltYXRpb25GcmFtZSA9IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUsXHJcblx0XHRjYW5jZWxBbmltYXRpb25GcmFtZSA9IHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSxcclxuXHRcdGkgPSB2ZW5kb3JzLmxlbmd0aDtcclxuXHJcblx0Ly8gdHJ5IHRvIHVuLXByZWZpeCBleGlzdGluZyByYWZcclxuXHR3aGlsZSAoLS1pID49IDAgJiYgIXJlcXVlc3RBbmltYXRpb25GcmFtZSkge1xyXG5cdFx0cmVxdWVzdEFuaW1hdGlvbkZyYW1lID0gd2luZG93W3ZlbmRvcnNbaV0gKyAnUmVxdWVzdEFuaW1hdGlvbkZyYW1lJ107XHJcblx0XHRjYW5jZWxBbmltYXRpb25GcmFtZSA9IHdpbmRvd1t2ZW5kb3JzW2ldICsgJ0NhbmNlbEFuaW1hdGlvbkZyYW1lJ107XHJcblx0fVxyXG5cclxuXHQvLyBwb2x5ZmlsbCB3aXRoIHNldFRpbWVvdXQgZmFsbGJhY2tcclxuXHQvLyBoZWF2aWx5IGluc3BpcmVkIGZyb20gQGRhcml1cyBnaXN0IG1vZDogaHR0cHM6Ly9naXN0LmdpdGh1Yi5jb20vcGF1bGlyaXNoLzE1Nzk2NzEjY29tbWVudC04Mzc5NDVcclxuXHRpZiAoIXJlcXVlc3RBbmltYXRpb25GcmFtZSB8fCAhY2FuY2VsQW5pbWF0aW9uRnJhbWUpIHtcclxuXHRcdHJlcXVlc3RBbmltYXRpb25GcmFtZSA9IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XHJcblx0XHRcdHZhciBub3cgPSArbmV3IERhdGUoKSwgbmV4dFRpbWUgPSBNYXRoLm1heChsYXN0VGltZSArIDE2LCBub3cpO1xyXG5cdFx0XHRyZXR1cm4gc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRjYWxsYmFjayhsYXN0VGltZSA9IG5leHRUaW1lKTtcclxuXHRcdFx0fSwgbmV4dFRpbWUgLSBub3cpO1xyXG5cdFx0fTtcclxuXHJcblx0XHRjYW5jZWxBbmltYXRpb25GcmFtZSA9IGNsZWFyVGltZW91dDtcclxuXHR9XHJcblxyXG5cdC8vIGV4cG9ydCB0byB3aW5kb3dcclxuXHR3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lO1xyXG5cdHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSA9IGNhbmNlbEFuaW1hdGlvbkZyYW1lO1xyXG59KHdpbmRvdykpO1xyXG4iXX0=
