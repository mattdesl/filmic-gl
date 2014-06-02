var domready = require('domready');
var THREE = require('three');
require('raf.js');

var lensShader = require('./shaders/lens');
var fxaaShader = require('./shaders/fxaa');

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

    var lookupTexture = THREE.ImageUtils.loadTexture("img/lookup_miss_etikate.png");
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
            grainamount: {type: 'f', value: 0.02},
            colored: {type: 'i', value: 0},
            coloramount: {type: 'f', value:1},
            grainsize: {type:'f', value:1.5},
            lumamount: {type: 'f', value:1.0},
            timer: {type: 'f', value: 0.0},

            //filter
            filterStrength: {type: 'f', value: 0.5},

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

        var time = clock.getElapsedTime();

        post.postMaterial.uniforms.timer.value = time/1000;

        //orbit camera
        var radius = 50;

        camera.position.x = Math.cos(time*0.4) * radius;
        camera.position.z = Math.sin(time*0.4) * radius;
        camera.position.y = Math.sin(time*0.25) * 1 + 25;
        camera.lookAt(new THREE.Vector3(0,0,0));

        if (usePost) {
            //render scene to first target
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
            
    }
});