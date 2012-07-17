define([
  'src/tools'
], function(tools){

  var sceneUtil = {

    addFog: function(scene){
      scene.fog = new THREE.FogExp2(0x000000, 0.00000025);
    },

    addStars: function(scene, radius) {

      var vector1, starsGeometry = [ new THREE.Geometry(), new THREE.Geometry() ];

      for (i = 0; i < 250; i++) {

        vector1 = new THREE.Vector3(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1);
        vector1.multiplyScalar(radius);

        starsGeometry[ 0 ].vertices.push(new THREE.Vertex(vector1));

      }

      for (i = 0; i < 1500; i++) {

        vector1 = new THREE.Vector3(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1);
        vector1.multiplyScalar(radius);

        starsGeometry[ 1 ].vertices.push(new THREE.Vertex(vector1));
      }

      var starsMaterials = [
        new THREE.ParticleBasicMaterial({ color:0x555555, size:3, sizeAttenuation:false }),
        new THREE.ParticleBasicMaterial({ color:0x555555, size:2, sizeAttenuation:false }),
        new THREE.ParticleBasicMaterial({ color:0x333333, size:3, sizeAttenuation:false }),
        new THREE.ParticleBasicMaterial({ color:0x3a3a3a, size:1, sizeAttenuation:false }),
        new THREE.ParticleBasicMaterial({ color:0x1a1a1a, size:3, sizeAttenuation:false }),
        new THREE.ParticleBasicMaterial({ color:0x1a1a1a, size:2, sizeAttenuation:false })
      ];

      var stars;
      for (var i = 10; i < 30; i++) {

        stars = new THREE.ParticleSystem(starsGeometry[ i % 2 ], starsMaterials[ i % 6 ]);

        stars.rotation.x = Math.random() * 6;
        stars.rotation.y = Math.random() * 6;
        stars.rotation.z = Math.random() * 6;

        var s = i * 10;
        stars.scale.set(s, s, s);
        stars.matrixAutoUpdate = false;
        stars.updateMatrix();

        scene.add(stars);
      }
    },

    addLights: function (scene) {
      var light;
      light = new THREE.DirectionalLight(0xffffff, 1, 0);
      light.position.set(-1, 0, 1).normalize();
      light.castShadow = true;
      scene.add(light);

      light = new THREE.DirectionalLight(0xffffff, 1, 0);
      light.position.set(1, 0, -1).normalize();
      light.castShadow = true;
      scene.add(light);

      light = new THREE.AmbientLight(0);
      scene.add(light);

    },

    addSkybox: function(scene, options, callback){
      var opts = tools.mixin({
        folder: 'textures/skybox/default/',
        filetype: 'png',
        size: 1000000
      }, options || {});

      var urls = [];
      var toLoad = 6;

      ['x','y','z'].forEach(function(axis){
        urls.push(opts.folder + 'pos' + axis + '.' + opts.filetype);
        urls.push(opts.folder + 'neg' + axis + '.' + opts.filetype);
      });
      var textureCube = THREE.ImageUtils.loadTextureCube(urls, undefined, function(){
        --toLoad || callback();
      });

      var shader = THREE.ShaderUtils.lib["cube"];
      shader.uniforms["tCube"].texture = textureCube;

      var material = new THREE.ShaderMaterial({
        fragmentShader: shader.fragmentShader,
        vertexShader: shader.vertexShader,
        uniforms: shader.uniforms,
        depthWrite: false
      });

      var mesh = new THREE.Mesh(new THREE.CubeGeometry(opts.size, opts.size, opts.size, 1, 1, 1, null, true), material);
      mesh.flipSided = true;
      scene.add(mesh);
    }

  };

  return sceneUtil;
});