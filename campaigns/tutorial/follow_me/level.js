define([
  'src/Level',
  'src/Flightplan',
  'src/tools',
  
  './pulsar_schedule'
], function (Level, Flightplan, tools, pulsarSchedule) {

  var level = new Level({

    name: 'Follow Me',

    description: "Just follow me around; don't fall back too far behind me.",

    failMessage: 'You fell too far behind Cpt. Awesome.',

    successMessage: 'Well done! Proceed to next task.'

  });

  level.onInit(function () {

    this.knaan = this.addEntity('ship', {
      type: 'knaan',
      position: {x: 10000, y: 5000, z: -20000}
    });

    this.pulsar = this.addShip('pulsar', {
      position: {x: 0, y: 0, z: -200}
    });

    this.addEntity('asteroidbelt', {
      position: { x: 15000, y: 0, z: -14000},
      amount: 100
    });

  });

  level.onBeforeStart(function () {
    this.pulsarFlightPlan = new Flightplan(this.pulsar.controls);
    this.pulsarFlightPlan.setSchedule(pulsarSchedule);
    this.pulsarFlightPlan.start();
  });

  level.onUpdate(function (delta) {

    this.pulsarFlightPlan.update(delta);
    this.pulsar.update(delta);

    var camera = this.player.camera;
    var dist = tools.getDistance(camera.position, this.pulsar.model.position);
    if (dist > 2000) {
      this.onLevelFail(this.options.failMessage);
    }

    // TODO: Move player collision detection into player [player.collides() or smth.]
    var projector = new THREE.Projector();
    var vector = new THREE.Vector3(0, 0, 0);
    projector.unprojectVector(vector, camera);
    var target = vector.subSelf(camera.position).normalize();

    // why is target !== camera.direction? check shooting_at_things!!

    var ray = this.player.ray;
    ray.setSource(camera.position, target);
    var objs = ray.intersectObjects(scene.children);
    if (objs.length) {
      objs.forEach(function (obj) {
        //console.log(obj.object.name, obj.distance);
        if (obj.distance <= 50) {
          var entity = obj.object.parent || obj.object;
          if (entity.name != 'knaan') { // the knaan detection still it broken
            this.onLevelFail('You crashed (you hit ' + entity.name + ').');
          }
        }
      }, this);
    }

  });

  return level;

});