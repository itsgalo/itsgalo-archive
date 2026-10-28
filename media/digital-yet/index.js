

    // Set up the scene, camera, and renderer as global variables.
    var scene, camera, renderer;
    var meshes = [];
    var mixers = [];
    var clock = new THREE.Clock;
    var loader = new THREE.JDLoader();

    init();
    animate();

    // Sets up the scene.
    function init() {

      // Create the scene and set the scene size.
      scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2( 0xffffff, 0.03 );

      var WIDTH = window.innerWidth,
          HEIGHT = window.innerHeight;

      // Create a renderer and add it to the DOM.
      renderer = new THREE.WebGLRenderer({antialias:true, alpha: true});
      renderer.setSize(WIDTH, HEIGHT);
      document.body.appendChild(renderer.domElement);

      // Create a camera, zoom it out from the model a bit, and add it to the scene.
      camera = new THREE.PerspectiveCamera(65, WIDTH / HEIGHT, 0.1, 20000);
      camera.position.set(60,0,60);
      scene.add(camera);

      // Create an event listener that resizes the renderer with the browser window.
      window.addEventListener('resize', function() {
        var WIDTH = window.innerWidth,
            HEIGHT = window.innerHeight;
        renderer.setSize(WIDTH, HEIGHT);
        camera.aspect = WIDTH / HEIGHT;
        camera.updateProjectionMatrix();
      });


      // Create a light, set its position, and add it to the scene.
      var light = new THREE.PointLight(0xffffff);
      light.position.set(-10,20,10);
      scene.add(light);

      var aLight = new THREE.AmbientLight(0xffffff);
      scene.add(aLight);

      //var geometry = new THREE.Mesh( new THREE.SphereGeometry( 70, 32, 16, blue ));
      //var blue = new THREE.MeshLambertMaterial({color: 0xff0000});

      //scene.add(geometry);


      // Load in the mesh and add it to the scene.
      //var loader = new THREE.JSONLoader();
      //loader.load( "2.js", function(geometry){
      //  var material = new THREE.MeshLambertMaterial({color: 0x55B663});
      //  mesh = new THREE.Mesh(geometry, material);
      //  scene.add(mesh);
      //});

      loader.load("1.JD",
            function (data)
            {
               var multiMaterial = new THREE.MultiMaterial(data.materials);
               for (var i = 0; i < data.geometries.length; ++i)
               {
                  var mesh = new THREE.SkinnedMesh(data.geometries[i], multiMaterial);
                  meshes.push(mesh);
                  scene.add(mesh);

                  if (mesh.geometry.animations)
                  {
                     var mixer = new THREE.AnimationMixer(mesh);
                     mixers.push(mixer);
                     mixer.clipAction(mesh.geometry.animations[0]).play();
                  }
               }
            });

      // Add OrbitControls so that we can pan around with the mouse.
      controls = new THREE.OrbitControls(camera, renderer.domElement);

    }



    // Renders the scene and updates the render as needed.
    function animate() {
      var delta = clock.getDelta();
        for (var i = 0; i < mixers.length; ++i)
        mixers[i].update(delta);

      requestAnimationFrame(animate);
      // Render the scene.
      render();
      controls.update();

    }

    function render() {
      var timer = Date.now() * 0.0005;

      //camera.position.x = Math.cos( timer ) * 25;
      //camera.position.z = Math.sin( timer ) * 25;
      camera.lookAt(scene.position);
      renderer.render(scene, camera);
    }
