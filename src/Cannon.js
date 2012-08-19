define([
  'src/registry'
], function (registry) {

  var Cannon = function (camera, scene) {
    this.camera = camera;
    this.scene = scene;

    this.input = registry.get('input');
    this.level = registry.get('currentLevel');

    this.vector = new THREE.Vector3();
    this.projector = new THREE.Projector();

    this.geometry = new THREE.SphereGeometry(1);
    this.material = new THREE.MeshLambertMaterial({ color: 0xffff00 });

    this.bullets = [];
    this.bulletPool = [];

    this.ray = new THREE.ReusableRay();

    this.initBulletPool();

  };

  Cannon.prototype = {

    bullets: null,

    bulletPool: null,

    poolSize: 50,

    camera: null,

    cannonSelect: 1,

    counter: 0,

    geometry: null,

    input: null,

    interval: 0.12,

    level: null,

    material: null,

    maxLifetime: 5,

    projector: null,

    ray: null,

    scene: null,

    speed: 15,

    vector: null,

    createBullet: function () {
      var bullet = new THREE.Mesh(this.geometry, this.material);
      bullet.direction = new THREE.Vector3();
      return bullet;
    },

    fire: function () {
      this.cannonSelect *= -1;

      var camera = this.camera,
        vector = this.vector;

      var bullet = this.getBullet();

      vector.getRotationFromMatrix(camera.matrix);
      bullet.rotation.x = vector.x;
      bullet.rotation.y = vector.y;
      bullet.rotation.z = vector.z;

      bullet.position.x = camera.position.x; // + (this.cannonSelect * 7);
      bullet.position.y = camera.position.y; // - 7;
      bullet.position.z = camera.position.z; // + 5;

      vector.set(0, 0, -1);
      camera.matrix.rotateAxis(vector);
      bullet.direction.x = vector.x;
      bullet.direction.y = vector.y;
      bullet.direction.z = vector.z;

      bullet._lifetime = 0;

      this.bullets.push(bullet);
      this.scene.add(bullet);
    },

    getBullet: function () {
      return this.bulletPool.length ?
        this.bulletPool.pop() :
        new THREE.Mesh(this.geometry, this.material);
    },

    initBulletPool: function () {
      for (var i = 0; i < this.poolSize; i++) {
        this.bulletPool.push(this.createBullet());
      }
    },

    update: function (delta) {

      var interval = this.interval,
        ray = this.ray,
        targets = this.level.modelCollection,
        scene = this.scene,
        bullets = this.bullets,
        speed = this.speed;

      this.counter += delta;
      if (this.counter >= interval) {
        this.counter -= interval;
        if (this.input.cannon) {
          this.fire();
        }
      }

      return;

      var bulletHit;
      var targetsNeedUpdate = false;

      for (var i = bullets.length - 1; i >= 0; i--) {
        var bullet = bullets[i];

        bulletHit = false;

        ray.setSource(bullet.position, bullet.direction);
        var intersects = ray.intersectObjects(targets);
        if (intersects.length) {
              //hit.object.isHit = true;
              // bullet can't hit more than one target,
          var hit = intersects[0];
          if (hit.distance <= speed) {

            console.log('You hit', hit.object.name);
            bulletHit = true;

          }
        }

        bullet.translateZ(-speed);

        bullet._lifetime += delta;

        if (bulletHit || bullet._lifetime > this.maxLifetime) {
          scene.remove(bullet);
          bullets.splice(i, 1);
          this.bulletPool.push(bullet);
        }
      }
    }
  };

  return Cannon;

});
