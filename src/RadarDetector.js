/*

Parts of the radar code inspired by Taylor Clark's Webspace Combat:

http://www.taylorclarksoftware.com/webspacecombat/

*/

define([], function () {

  var RadarDetector = function (camera, objects) {
    this.camera = camera;

    this.forward = new THREE.Vector3(0, 0, -1);
    this.up = new THREE.Vector3(0, 1, 0);
    this.right = new THREE.Vector3();

    this.forwardVec = new THREE.Vector3(0, 0, -1);
    this.upVec = new THREE.Vector3(0, 1, 0);

    this.targetVector = new THREE.Vector3();

    this.objects = objects;
  };

  RadarDetector.prototype = {

    forward: null,

    up: null,

    right: null,

    update: function () {
      var camera = this.camera;

      // set Forward, Right and Up plane vectors
      camera.quaternion.multiplyVector3(this.forwardVec, this.forward).normalize();
      camera.quaternion.multiplyVector3(this.upVec, this.up).normalize();
      this.right.cross(this.forward, this.up).normalize();

      this.objects.forEach(function (object) {

        var targetVector = this.targetVector;
        targetVector.sub(object.model.position, camera.position).normalize();

        var isInFront = targetVector.dot(this.forward) > 0;

        var projScalar = targetVector.dot(this.forward) / this.forward.lengthSq();
        targetVector.subSelf(this.forward.clone().multiplyScalar(projScalar)); // Can we somehow get rid of having to clone here?

        var left = ( targetVector.dot(this.right) / -this.right.lengthSq() ) * -100;
        var top = ( targetVector.dot(this.up) / this.up.lengthSq() ) * -100;

        object.radarLeft = left;
        object.radarTop = top;
        object.radarIsInFront = isInFront;

      }, this);

    }
  };

  return RadarDetector;

});
