define([
  'campaigns/default-level',
  'src/level-registry',
  'src/scene-util',
  'src/tools',
  'src/comm',
  'src/Player',
  'src/Ship',
  'src/AsteroidBelt',
  'src/Flightplan',
  'campaigns/tutorial/follow_me/pulsar_schedule'
], function(
  defaultLevel,
  levelRegistry,
  sceneUtil,
  tools,
  comm,
  Player,
  Ship,
  AsteroidBelt,
  Flightplan,
  pulsarSchedule
){
  levelRegistry.addLevel('tutorial', 'follow_me', tools.mixin(Object.create(defaultLevel), {

    name: 'Follow Me',

    description: "Just follow me around; don't fall back too far behind me.",

    failMessage: 'You fell too far behind Cpt. Awesome.',

    successMessage: 'Well done! Proceed to next task.',

    playerShip: 'pulsar',

    pulsar: null,

    pulsarFlightPlan: null,

    start: function(){
      this.started = true;
      this.pulsarFlightPlan.start();
    },

    loadModels: function(){
      this.modelsToLoad = 3;

      this.knaan = new Ship('knaan', this.scene, {x: 10000, y: 5000 /* 500 */, z: -20000}, function(){
        this.onModelAdded();
      }.bind(this));

      // add pulsar
      var ship = this.pulsar = new Ship('pulsar', this.scene, {x: 0, y: 0, z: -200}, function(){

        this.pulsarFlightPlan = new Flightplan(ship.controls);
        this.pulsarFlightPlan.setSchedule(pulsarSchedule);

        this.onModelAdded();
      }.bind(this));

      // add asteroids
      this.asteroids = new AsteroidBelt(this.scene, {
        position: { x: 15000, y: 0, z: -14000},
        amount: 100
      }, function(){
        this.onModelAdded();
      }.bind(this));
    },

    onBeforeRender: function(delta){
      var player = this.player,
          scene = this.scene,
          camera = player.camera;

      player.update(delta);

      this.pulsarFlightPlan.update(delta);
      this.pulsar.update(delta);

      var dist = tools.getDistance(camera.position, this.pulsar.model.position);
      if(dist > 2000){
        this.onLevelFail(this.failMessage);
      }

      var projector = new THREE.Projector();
      var vector = new THREE.Vector3(0, 0, 0);
      projector.unprojectVector(vector, camera);
      var target = vector.subSelf(camera.position).normalize();

      var ray = new THREE.Ray( camera.position, target );
      var objs = ray.intersectObjects(scene.children);
      if(objs.length){
        objs.forEach(function(obj){
          //console.log(obj.object.name, obj.distance);
          if(obj.distance <= 50 && obj.object.name != 'knaan'){ // the knaan detection still it broken
            this.onLevelFail('You crashed (you hit ' + obj.object.name + ').');
          }
        }, this);
      }
    }

  }));

});
