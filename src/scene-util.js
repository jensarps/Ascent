define(function(){

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
      var dirLight = new THREE.SpotLight(0xffffff);
      dirLight.position.set(-1, 0, 1).normalize();
      dirLight.castShadow = true;
      scene.add(dirLight);

      var dirLight = new THREE.SpotLight(0xffffff);
      dirLight.position.set(1, 0, -1).normalize();
      dirLight.castShadow = true;
      scene.add(dirLight);

      var ambientLight = new THREE.AmbientLight(/* 0x000000 */ 0xFFFFFF);
      scene.add(ambientLight);
    }
  };

  return sceneUtil;
});