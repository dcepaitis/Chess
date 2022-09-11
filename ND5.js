$(function ()
{
    const ONE_SQUARE = 31.25;
    const INIT_POS = -109.375;
    const TRANSLATION = (INIT_POS * -2) / 200;

    var stats = initStats();
    var scene = new THREE.Scene();
    var currentCamera = null;
    var gui = new dat.GUI();
    var camera1 = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera1.position.x = -250;
    camera1.position.y = 200;
    camera1.position.z = 250;
    camera1.lookAt(new THREE.Vector3(0, 0, 0));

    var camera2 = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera2.rotation.set(0, 0, 0)



    camera2.position.x = -0.5 * INIT_POS;
    camera2.position.y = 60;
    camera2.position.z = 6 * (INIT_POS + 4 * ONE_SQUARE);
    camera2.lookAt(
        new THREE.Vector3(INIT_POS + 3 * ONE_SQUARE, 1, INIT_POS + 3 * ONE_SQUARE)
    );
    camera2.rotation.set(0, 0, 0)


    const helper2 = new THREE.CameraHelper(camera2);
     //scene.add(helper2);

    var camera3 = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera3.position.x = INIT_POS + 3 * ONE_SQUARE + 5;
    camera3.position.y = 300;
    camera3.position.z = 0;
    camera3.lookAt(new THREE.Vector3(0, 0, 0));
    const helper3 = new THREE.CameraHelper(camera3);
    // scene.add(helper3);
    const time = new THREE.Clock()

    var webGLRenderer = new THREE.WebGLRenderer();
    webGLRenderer.setClearColor(0x555555, 1.0);
    webGLRenderer.setSize(window.innerWidth, window.innerHeight);
    webGLRenderer.shadowMap.enabled = true;
    webGLRenderer.shadowMap.type = THREE.PCFSoftShadowMap;
    $("#WebGL-output").append(webGLRenderer.domElement);

    var controls = new (function ()
    {
        this.movement = 1;
        this.segments = 12;
        this.cam1FOV = 45;
        this.DollyZoom = 45;

        this.setCamera1 = function ()
        {
            if (currentCamera == camera2)
            {
                scene.add(planeGeo)
                this.movement = 1;
                horse.position.x = INIT_POS;
                horse.position.z = INIT_POS;
                horse.position.y = 0

            }
            currentCamera = camera1;
        };

        this.setCamera2 = function ()
        {
            scene.remove(planeGeo)
            currentCamera = camera2;
            this.movement = 0;
            horse.position.x = INIT_POS + 5 * ONE_SQUARE;
            horse.position.z = INIT_POS + 3 * ONE_SQUARE;
            horse.position.y = 60
        };

        this.setCamera3 = function ()
        {
            if (currentCamera == camera2)
            {
                scene.add(planeGeo)
                this.movement = 1;
                horse.position.x = INIT_POS;
                horse.position.z = INIT_POS;
                horse.position.y = 0

            }
            currentCamera = camera3;
        };

        this.cam1Change = function ()
        {
            camera1.fov = controls.cam1FOV;
            camera1.updateProjectionMatrix();
        };

        this.cam2Change = function ()
        {
            var height =
                Math.tan(camera2.fov * (Math.PI / 180) * 0.5) *
                camera2.position.distanceTo(figureMiddlePoint);

            const camLookingDir = new THREE.Vector3();
            camera2.getWorldDirection(camLookingDir);
            camLookingDir.multiplyScalar(controls.DollyZoom);
            const position = new THREE.Vector3(
                -0.5 * INIT_POS,
                60,
                6 * (INIT_POS + 4 * ONE_SQUARE)
            );
            position.add(camLookingDir);
            camera2.position.set(position.x, position.y, position.z);

            var direction = new THREE.Vector3();
            direction.subVectors(camera2.position, figureMiddlePoint);
            camera2.fov =
                (180 / Math.PI) * 2 * Math.atan(height / direction.length());
            camera2.near = direction.length() / 100;
            camera2.far = direction.length() + 10000;
            camera2.updateProjectionMatrix();
            // helper2.update();
        };
    })();
    var params = {
        switch: false
    };


    function render()
    {
        const elapsedTime = time.getElapsedTime()
        if(params.switch)
        {
            if(currentCamera === camera1){
                camera1.position.x = Math.sin(elapsedTime * Math.PI * 0.3) * 300
                camera1.position.z = Math.cos(elapsedTime * Math.PI * 0.3) * 300
                camera1.lookAt(0, 0 ,0);
            }
        }
        stats.update();
        requestAnimationFrame(render);
        webGLRenderer.render(scene, currentCamera);
        switch (controls.movement)
        {
            case 0:
                // code block
                break;
            case 1:
                horse.translateX(TRANSLATION);
                if (horse.position.x >= INIT_POS + 2 * ONE_SQUARE)
                {
                    controls.movement = 2;
                    horse.position.x = INIT_POS + 2 * ONE_SQUARE;
                }
                break;
            case 2:
                horse.translateZ(TRANSLATION);
                if (horse.position.z >= INIT_POS + 1 * ONE_SQUARE)
                {
                    controls.movement = 3;
                    horse.position.z = INIT_POS + 1 * ONE_SQUARE;
                }
                break;
            case 3:
                horse.translateX(-1 * TRANSLATION);
                if (horse.position.x <= INIT_POS)
                {
                    controls.movement = 4;
                    horse.position.x = INIT_POS;
                }
                break;
            case 4:
                horse.translateZ(-1 * TRANSLATION);
                if (horse.position.z <= INIT_POS)
                {
                    controls.movement = 5;
                    horse.position.z = INIT_POS;
                }
                break;
            case 5:
                horse.translateX(TRANSLATION);
                if (horse.position.x >= INIT_POS + 1 * ONE_SQUARE)
                {
                    controls.movement = 6;
                    horse.position.x = INIT_POS + 1 * ONE_SQUARE;
                }
                break;
            case 6:
                horse.translateZ(TRANSLATION);
                if (horse.position.z >= INIT_POS + 2 * ONE_SQUARE)
                {
                    controls.movement = 7;
                    horse.position.z = INIT_POS + 2 * ONE_SQUARE;
                }
                break;
            case 7:
                horse.translateX(-1 * TRANSLATION);
                if (horse.position.x <= INIT_POS)
                {
                    controls.movement = 8;
                    horse.position.x = INIT_POS;
                }
                break;
            case 8:
                horse.translateZ(-1 * TRANSLATION);
                if (horse.position.z <= INIT_POS)
                {
                    controls.movement = 1;
                    horse.position.z = INIT_POS;
                }
        }
        camera3.lookAt(horse.position);
    }

    function initStats()
    {
        var stats = new Stats();
        stats.setMode(0);
        stats.domElement.style.position = "absolute";
        stats.domElement.style.left = "0px";
        stats.domElement.style.top = "0px";
        $("#Stats-output").append(stats.domElement);
        return stats;
    }

    function createFigure()
    {
        const shape = new THREE.Shape();
        shape.moveTo(0, 0);
        shape.lineTo(12, 0);
        shape.bezierCurveTo(12, 0, 12.5, 1, 10, 3);
        shape.lineTo(8, 4);
        shape.lineTo(8, 6);
        shape.lineTo(10, 6);
        shape.bezierCurveTo(10, 6, 9, 10, 11, 15);
        shape.bezierCurveTo(11, 15, 10, 18, 6, 19);
        shape.lineTo(4, 21);
        shape.lineTo(5, 18);
        shape.lineTo(3, 17);
        shape.lineTo(0, 13);
        shape.bezierCurveTo(0, 13, 1, 11, 3, 13);
        shape.bezierCurveTo(3, 13, 5, 12, 7, 14);
        shape.bezierCurveTo(7, 14, 2, 9, 3, 6);
        shape.lineTo(4, 4);
        shape.bezierCurveTo(4, 4, 1, 3, 0, 0.5);

        const extrudeSettings = {
            depth: 7,
            curveSegments: 14,
            bevelEnabled: true,
            bevelSegments: 4,
            steps: 24,
            bevelSize: 1,
            bevelThickness: 0.3
        };
        geometry = new THREE.ExtrudeBufferGeometry(shape, extrudeSettings);
        var material = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            combine: THREE.MixOperation,
            reflectivity: 0.5,
            shininess: 300,
        });
        var figure = new THREE.Mesh(geometry, material);
        figure.position.set(-125, 1, -125);
        figure.castShadow = true;
        return figure;
    }

    function addLights()
    {
        const spotLight = new THREE.SpotLight(0xffffff);
        spotLight.position.set(100, 200, 100);
        spotLight.castShadow = true;
        scene.add(spotLight);
        gui.add(spotLight, "intensity", 0, 3, 0.01).name("Spot Light");
        var ambientLight = new THREE.AmbientLight("#303030");
        scene.add(ambientLight);
        gui.add(ambientLight, "intensity", 0, 3, 0.01).name("Ambient Light");

    }

    function addPlane()
    {
        const geometry = new THREE.PlaneGeometry(300, 300);
        const texture = THREE.ImageUtils.loadTexture("./textures/chess.jpg");
        const material = new THREE.MeshPhongMaterial({
            map: texture,
            color: 0xffffff,
            combine: THREE.MixOperation,
            reflectivity: 0.5,
            shininess: 300,
        });
        plane = new THREE.Mesh(geometry, material);
        plane.position.set(0, 0, 0);
        plane.rotation.x = -0.5 * Math.PI;
        plane.receiveShadow = true;
        scene.add(plane);
        return plane
    }


    gui.add(controls, "setCamera1").name("Camera 1");
    gui
        .add(controls, "cam1FOV", 10, 100)
        .step(1)
        .name("FOV")
        .onChange(controls.cam1Change);
    gui.add(controls, "setCamera2").name("Camera 2");
    gui.add(controls, "DollyZoom", -100, 100).onChange(controls.cam2Change);
    gui.add(controls, "setCamera3").name("Camera 3");
    gui.add(params, "switch").name("Rotate Camera 1");
    addLights();
    var planeGeo = addPlane();
    var horse = createFigure();
    scene.add(horse);
    controls.setCamera2();
    controls.setCamera1();
    render();

    var box = new THREE.Box3().setFromObject(horse);

    var figureMiddlePoint = new THREE.Vector3(
        INIT_POS + 5 * ONE_SQUARE,
        horse.position.y + box.getSize().y * 0.5,
        INIT_POS + 3 * ONE_SQUARE
    );
});
