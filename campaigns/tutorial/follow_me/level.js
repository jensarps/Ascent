define([
  'src/Level',
  'src/Flightplan',
  'src/tools',
  'src/registry',
  './pulsar_schedule'
], function (
  Level,
  Flightplan,
  tools,
  registry,
  pulsarSchedule
) {

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

    var timer = this.timer = registry.get('timer');
    this.winTimeout = timer.setTimeout(function(){
      this.onLevelSuccess(this.options.successMessage);
    }, 70000, this);
  });

  level.onUpdate(function (delta) {

    this.pulsarFlightPlan.update(delta);
    this.pulsar.update(delta);

    var camera = this.player.camera;
    var dist = tools.getDistance(camera.position, this.pulsar.model.position);
    if (dist > 2000) {
      this.timer.clearTimeout(this.winTimeout);
      this.onLevelFail(this.options.failMessage);
    }

    var collidingObject = this.player.detectCollision();
    if (collidingObject) {
      this.timer.clearTimeout(this.winTimeout);
      this.onLevelFail('You crashed (you hit ' + collidingObject.name + ').');
    }

  });

  return level;

});