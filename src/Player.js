define([
  'src/screen-util',
  'src/registry',
  'src/ships',
  'src/config',
  'src/controls/SpaceshipControls'
], function (screenUtil, registry, ships, config, SpaceshipControls) {

  var Player = function (scene, shipType) {
    this.scene = scene;
    this.shipStats = ships[shipType];
    this.ray = new THREE.ReusableRay();

    this.projector = new THREE.Projector();
    this.vector = new THREE.Vector3(0, 0, 0);

    this.setup();
  };

  Player.prototype = {

    camera: null,

    cockpit: null,

    cockpitX: 0,

    cockpitY: 0,

    input: null,

    level: null,

    ray: null,

    scene: null,

    shipStats: null,

    timer: null,

    setup: function () {

      this.timer = registry.get('timer');
      this.level = registry.get('currentLevel');
      this.input = registry.get('input');

      // init camera
      var camera = this.camera = new THREE.PerspectiveCamera(25, screenUtil.width / screenUtil.height, 50, 1e7);
      this.scene.add(camera);

      // init controls
      var controls = this.controls = new SpaceshipControls(camera);
      controls.movementSpeed = 0;
      controls.rollSpeed = this.shipStats.rollSpeed;
      controls.maxSpeed = this.shipStats.maxSpeed;
      controls.inertia = this.shipStats.inertia;

      // init cockpit
      var cockpit = this.cockpit = new Cockpit('textures/cockpit.png', this.timer);

      cockpit.addText('hud-speed', 'SPD:');
      cockpit.addText('hud-thrust', 'PWR:');
      cockpit.addText('hud-force', 'F:');
    },

    detectCollision: function () {
      var collidingObject,
          camera = this.camera,
          projector = this.projector,
          vector = this.vector;

      vector.set(0, 0, 0);
      // no need to reset the projector
      projector.unprojectVector(vector, camera);
      var target = vector.subSelf(camera.position).normalize();

      var ray = this.ray;
      ray.setSource(camera.position, target);
      var objs = ray.intersectObjects(scene.children);
      if (objs.length) {
        objs.some(function (obj) {
          if (obj.distance <= 50) {
            var entity = obj.object.parent || obj.object;
            if (entity.name != 'knaan') { // the knaan detection still it broken
              collidingObject = entity;
              return true;
            }
          }
        }, this);
      }

      return collidingObject; // intentionally return undefined if nothing is hit
    },

    update: function (delta) {


      var cockpit = this.cockpit,
        controls = this.controls;

      controls.update(delta);

      // update cockpit. This could use some love.

      this.cockpitX = this.input.yaw * 0.8;
      this.cockpitY = this.input.pitch * -0.8;
      cockpit.move(this.cockpitX, this.cockpitY);

      var vel = Math.max(0, controls.velocity - controls.breakingForce);
      var force = ( vel - controls.movementSpeed ) * 10;
      var forceLimitReached = Math.abs(force) > 3.75;

      var state;
      if (forceLimitReached) {
        state = 'vibrate';
      } else {
        state = 'normal';
      }

      if (state !== cockpit.state) {
        document.documentElement.classList[forceLimitReached ? 'add' : 'remove']('force-warning');
        cockpit.setState(state);
      }

      cockpit.updateText('hud-speed', 'SPD: ' + Math.floor(controls.movementSpeed * controls.maxSpeed));
      cockpit.updateText('hud-thrust', 'PWR: ' + Math.floor(controls.velocity * 100) + '%');
      cockpit.updateText('hud-force', 'G: ' + force.toFixed(2));
    },

    onContainerDimensionsChanged: function (width, height) {
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
    },

    destroy: function () {
      this.cockpit.destroy();
    }

  };

  return Player;
});
