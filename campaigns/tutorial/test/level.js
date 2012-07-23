define([
  'src/Level',
  'src/Flightplan',
  'src/tools',
  'src/Radar',
  './schedule'
], function (
  Level,
  Flightplan,
  tools,
  Radar,
  schedule
) {

  var level = new Level({

    name: 'Testing Grounds',

    description: 'Testing Grounds'

  });

  level.onInit(function () {

    this.radar = new Radar(this.player);

    this.knaan = this.addShip('knaan', {
      position: {x: 10000, y: 500, z: -20000}
    });
    this.radar.addObject(this.knaan);

    this.pulsar = this.addShip('pulsar', {
      position: {x: 0, y: 0, z: -400}
    });
    this.radar.addObject(this.pulsar);

    this.follower = this.addShip('pulsar', {
      position: {x: -50, y: 0, z: -200}
    });
    this.radar.addObject(this.follower);

    this.addEntity('asteroidbelt', {
      position: { x: 1000, y: 100, z: -10000},
      amount: 20
    });

  });

  level.onBeforeStart(function () {
    this.pulsarFlightPlan = new Flightplan(this.pulsar.controls);
    this.pulsarFlightPlan.setSchedule(schedule);

    this.pulsarFlightPlan.start();

    //this.follower.controls.setPropertyTarget('velocity', 0.8, 8);
    //this.follower.controls.follow(this.pulsar.model, 100);
  });

  level.onUpdate(function (delta) {

    this.pulsarFlightPlan.update(delta);
    this.pulsar.update(delta);
    this.follower.update(delta);

    //var dist = tools.getDistance(camera.position, this.pulsar.model.position);
    //console.log(dist);

    var collidingObject = this.player.detectCollision();
    if (collidingObject) {
      console.error('You crashed (you hit ' + collidingObject.name + ').');
    }

    this.radar.update();

  });

  return level;

});