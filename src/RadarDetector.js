define([], function () {

  var RadarDetector = function (camera, objects) {
    this.camera = camera;
    this.forward = new THREE.Vector3(0, 0, -1);
    this.up = new THREE.Vector3(0, 1, 0);
    this.right = new THREE.Vector3();

    this.objects = objects;
  };

  RadarDetector.prototype = {

    forward: null,

    up: null,

    right: null,

    update: function () {
      var camera = this.camera;

      // set Forward, Right and Up vectors
      this.forward = camera.quaternion.multiplyVector3(new THREE.Vector3(0, 0, -1)).normalize();
      this.up = camera.quaternion.multiplyVector3(new THREE.Vector3(0, 1, 0)).normalize();
      this.right.cross(this.forward, this.up).normalize();

      //console.log(this.forward.x, this.forward.y, this.forward.z);

      this.objects.forEach(function (object) {
        //console.log(object);
        var position = object.model.position.clone();

        var targetVector = new THREE.Vector3();
        targetVector.sub(position, camera.position);
        targetVector.normalize();


        //console.log(targetVector.x, targetVector.y, targetVector.z);


        var isInFront = targetVector.dot(this.forward) > 0;
        //console.log(isInFront);

        var projScalar = targetVector.dot(this.forward) / this.forward.lengthSq();
        targetVector.subSelf(this.forward.clone().multiplyScalar(projScalar));

        var radarPos = new THREE.Vector2(
          targetVector.dot(this.right) / -this.right.lengthSq(),
          targetVector.dot(this.up) / this.up.lengthSq()
        );

        var left = radarPos.x * -100; // [-100..100]
        var top = radarPos.y * -100; // [-100..100]

        object.radarLeft = left;
        object.radarTop = top;
        object.radarIsInFront = isInFront;

      }, this);

    }
  };

  return RadarDetector;

});
