define([
  'src/Level',
  'src/Flightplan',
  'src/tools',

  '../follow_me/pulsar_schedule'
], function (Level, Flightplan, tools, pulsarSchedule) {

  var level = new Level({

    name: 'Testing Grounds',

    description: 'Testing Grounds'

  });

  level.onInit(function () {

    /*
     ['x','y','z','w', 'd1', 'd2'].forEach(function(prop, index){
     this.player.cockpit.addText(prop, '');
     this.player.cockpit.textNodes[prop].node.style.left = '20%';
     this.player.cockpit.textNodes[prop].node.style.top = index * 20 + 200 + 'px';
     }, this);
     */

    /*
     var point = this.point = document.createElement('div');
     point.id = 'marker';
     point.innerHTML = 'X';
     point.style.position = 'absolute';
     point.style.zIndex = '1000000000';
     document.body.appendChild(point);

     point = this.center = document.createElement('div');
     point.id = 'center';
     point.style.color = 'red';
     point.innerHTML = '+';
     point.style.position = 'absolute';
     point.style.left = '50%';
     point.style.top = '50%';
     point.style.zIndex = '1000000000';
     document.body.appendChild(point);
     */

    this.knaan = this.addShip('knaan', {
      position: {x: 10000, y: 500, z: -20000}
    });

    this.pulsar = this.addShip('pulsar', {
      position: {x: 0, y: 0, z: -400}
    });

    this.follower = this.addShip('pulsar', {
      position: {x: -50, y: 0, z: -200}
    });

    this.addEntity('asteroidbelt', {
      position: { x: 1000, y: 100, z: -10000},
      amount: 20
    });

  });

  level.onBeforeStart(function () {
    this.pulsarFlightPlan = new Flightplan(this.pulsar.controls);
    this.pulsarFlightPlan.setSchedule(pulsarSchedule);

    this.pulsarFlightPlan.start();

    //this.follower.controls.setPropertyTarget('velocity', 0.8, 8);
    //this.follower.controls.follow(this.pulsar.model, 100);
  });

  level.onUpdate(function (delta) {

    var player = this.player,
        scene = this.scene,
        camera = player.camera,
        ray = player.ray;

    this.pulsarFlightPlan.update(delta);
    this.pulsar.update(delta);
    this.follower.update(delta);

    //var dist = tools.getDistance(camera.position, this.pulsar.model.position);
    //console.log(dist);


    var projector = new THREE.Projector();
    var vector = new THREE.Vector3(0, 0, 0);
    projector.unprojectVector(vector, camera);
    var target = vector.subSelf(camera.position).normalize();

    //var ray = new THREE.Ray( camera.position, target );

    ray.setSource( camera.position, target );

    var objs = ray.intersectObjects(scene.children);
    if(objs.length){
      objs.forEach(function(obj){
        //console.log(obj.object.name, obj.distance);
        if(obj.distance <= 50){
          var entity = obj.object.parent || obj.object;
          console.error('You hit ' + entity.name);
        }
      });
    }
    /*
     var projector = new THREE.Projector();
     var vector = new THREE.Vector3(10000, 500, -20000);
     projector.unprojectVector(vector, camera);
     var target = vector.subSelf(camera.position).normalize();
     */
    /*
     console.log(
     (target.x).toFixed(1),
     (target.y).toFixed(1),
     (target.z).toFixed(1)
     );
     */
    /*
     var targetRotation = this.player.controls.getRotationTowardsTarget(this.pulsar.model.position);
     var currentRotation = camera.quaternion;

     var target = new THREE.Quaternion();
     target.set(
     targetRotation.x - currentRotation.x,
     targetRotation.y - currentRotation.y,
     targetRotation.z - currentRotation.z,
     targetRotation.w - currentRotation.w
     );
     target.normalize();

     // alternate..
     target = currentRotation.clone().multiplySelf(targetRotation).normalize();

     var atan2 = Math.cos; //Math.atan2;
     var d1 = atan2(target.z);
     var d2 = atan2(target.w);
     /*

     d1 (0.54 - 1) == 1 -> 0
     d2 (0.54 - 1) == 1 -> 180

     */
    /*
     var atan2 = Math.atan2;
     var d1 = atan2(target.z, target.w) / Math.PI;
     var d2 = atan2(target.x, target.y) / Math.PI;


     var left = target.y * 100 + 50;
     var top = (target.x) * 100 + 50; // substract z

     this.point.style.left = left + '%';
     this.point.style.top = top + '%';


     this.player.cockpit.updateText('x', 'X: ' + target.x.toFixed(2));
     this.player.cockpit.updateText('y', 'Y: ' + target.y.toFixed(2));
     this.player.cockpit.updateText('z', 'Z: ' + target.z.toFixed(2));
     this.player.cockpit.updateText('w', 'W: ' + target.w.toFixed(2));
     this.player.cockpit.updateText('d1', 'D1: ' + d1.toFixed(2));
     this.player.cockpit.updateText('d2', 'D2: ' + d2.toFixed(2));
     */

  });

  return level;

});