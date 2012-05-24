define([
  'src/screen-util',
  'src/ships'
], function(
  screenUtil,
  ships
  ){

  var Player = function(scene, container, shipType){
    this.scene = scene;
    this.container = container;
    this.shipStats = ships[shipType];

    this.setup();
  };

  Player.prototype = {

    camera: null,

    cockpit: null,

    cockpitX: 0,

    cockpitY: 0,

    container: null,

    scene: null,

    shipStats: null,

    setup: function(){
      // init camera
      var camera = this.camera = new THREE.PerspectiveCamera(25, screenUtil.width / screenUtil.height, 50, 1e7);
      this.scene.add(camera);

      // init controls
      var controls = this.controls = new THREE.SpaceshipControls(camera);
      controls.movementSpeed = 0;
      controls.domElement = this.container;
      controls.rollSpeed = this.shipStats.rollSpeed;
      controls.maxSpeed = this.shipStats.maxSpeed;
      controls.inertia = this.shipStats.inertia;

      // init cockpit
      var cockpit = this.cockpit = new Cockpit('textures/cockpit.png');

      cockpit.addText('hud-speed', 'SPD:');
      cockpit.addText('hud-thrust', 'PWR:');
      cockpit.addText('hud-force', 'F:');

      this.moveListener = function (evt) {
        var halfHeight = screenUtil.height / 2;
        var halfWidth = screenUtil.width / 2;
        this.cockpitY = ( halfHeight - evt.clientY ) / halfHeight * 0.8;
        this.cockpitX = ( halfWidth - evt.clientX ) / halfWidth * 0.8;
      }.bind(this);
      document.body.addEventListener('mousemove', this.moveListener);
    },

    update: function(delta){
      var cockpit = this.cockpit,
        controls = this.controls;

      controls.update(delta);

      // update cockpit. This could use some love.

      cockpit.move(this.cockpitX, this.cockpitY);

      var vel = Math.max(0, controls.velocity - controls.breakingForce);
      var force = ( vel - controls.movementSpeed ) * 10;
      var forceLimitReached = Math.abs(force) > 3.75;

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

    onContainerDimensionsChanged: function(width, height){
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();

      this.controls.onContainerDimensionsChanged(width, height);
    },

    destroy: function(){
      document.body.removeEventListener('mousemove', this.moveListener);
      this.cockpit.destroy();
      this.controls.destroy();
    }

  };

  return Player;
});
