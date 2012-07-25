/**
 * @author Jens Arps
 *
 * Based on FlyControls by James Baicoianu / http://www.baicoianu.com/
 */
define([
  'src/registry'
], function (registry) {

  var SpaceshipControls = function (object, domElement, config) {

    this.object = object;

    this.domElement = ( domElement !== undefined ) ? domElement : document;
    if (domElement && domElement !== document) {
      this.domElement.setAttribute('tabindex', -1);
    }

    this.config = config;

    this.input = registry.get('input');

    // initial values
    this.movementSpeed = 0;
    this.velocity = 0;

    // influence
    this.breakingForce = 0;

    // ship stats
    this.maxSpeed = 1000;
    this.inertia = 100;
    this.rollSpeed = 0.005;

    this.autoForward = false;

    // disable default target object behavior

    this.object.useQuaternion = true;

    // internals

    this.tmpQuaternion = new THREE.Quaternion();

    this.mouseStatus = 0;

    this.moveState = {
      up: 0,
      down: 0,
      left: 0,
      right: 0,
      forward: 1,
      back: 0,
      pitchUp: 0,
      pitchDown: 0,
      yawLeft: 0,
      yawRight: 0,
      rollLeft: 0,
      rollRight: 0
    };
    this.moveVector = new THREE.Vector3(0, 0, 0);
    this.rotationVector = new THREE.Vector3(0, 0, 0);

    this.updateMovementVector();
    this.updateRotationVector();
    this.onContainerDimensionsChanged();

  };

  SpaceshipControls.prototype = {

    update: function (delta) {

      if(this.input.accelerate){
        this.velocity = Math.min(1, this.velocity + 0.015);
      }
      if(this.input.decelerate){
        this.velocity = Math.max(0, this.velocity - 0.015);
      }

      this.moveState.rollLeft = ( this.input.rollLeft || 0 ) * 1;
      this.moveState.rollRight = ( this.input.rollRight || 0 ) * 1;

      this.moveState.yawLeft = this.input.yaw || 0;
      this.moveState.pitchDown = this.input.pitch || 0;


      this.updateMovementVector();
      this.updateRotationVector();

      var factor = Math.max(0, this.velocity - this.breakingForce);
      var diff = factor - this.movementSpeed;
      this.movementSpeed += (diff / this.inertia);

      var speed = this.movementSpeed * this.maxSpeed;

      var moveMult = delta * speed;
      var rotMult = delta * this.rollSpeed;

      this.object.translateX(this.moveVector.x * moveMult);
      this.object.translateY(this.moveVector.y * moveMult);
      this.object.translateZ(this.moveVector.z * moveMult);

      this.tmpQuaternion.set(this.rotationVector.x * rotMult, this.rotationVector.y * rotMult, this.rotationVector.z * rotMult, 1).normalize();
      this.object.quaternion.multiplySelf(this.tmpQuaternion);

      this.object.matrix.setPosition(this.object.position);
      this.object.matrix.setRotationFromQuaternion(this.object.quaternion);
      this.object.matrixWorldNeedsUpdate = true;


    },

    updateMovementVector: function () {

      var forward = ( this.moveState.forward || ( this.autoForward && !this.moveState.back ) ) ? 1 : 0;

      this.moveVector.x = ( -this.moveState.left + this.moveState.right );
      this.moveVector.y = ( -this.moveState.down + this.moveState.up );
      this.moveVector.z = ( -forward + this.moveState.back );

      //console.log( 'move:', [ this.moveVector.x, this.moveVector.y, this.moveVector.z ] );

    },

    updateRotationVector: function () {

      this.rotationVector.x = ( -this.moveState.pitchDown + this.moveState.pitchUp );
      this.rotationVector.y = ( -this.moveState.yawRight + this.moveState.yawLeft );
      this.rotationVector.z = ( -this.moveState.rollRight + this.moveState.rollLeft );

      //console.log( 'rotate:', [ this.rotationVector.x, this.rotationVector.y, this.rotationVector.z ] );

    },

    getRotationTowardsTarget: function (vecEnd) {

      var vecstart = this.object.position;
      var vecUp = this.object.up;

      var temp = new THREE.Matrix4()
      temp.lookAt(vecstart, vecEnd, vecUp);

      var m00 = temp.n11, m10 = temp.n21, m20 = temp.n31,
        m01 = temp.n12, m11 = temp.n22, m21 = temp.n32,
        m02 = temp.n13, m12 = temp.n23, m22 = temp.n33;

      var t = m00 + m11 + m22, s, x, y, z, w;

      if (t > 0) {
        s = Math.sqrt(t + 1) * 2;
        w = 0.25 * s;
        x = (m21 - m12) / s;
        y = (m02 - m20) / s;
        z = (m10 - m01) / s;
      } else if ((m00 > m11) && (m00 > m22)) {
        s = Math.sqrt(1.0 + m00 - m11 - m22) * 2;
        x = s * 0.25;
        y = (m10 + m01) / s;
        z = (m02 + m20) / s;
        w = (m21 - m12) / s;
      } else if (m11 > m22) {
        s = Math.sqrt(1.0 + m11 - m00 - m22) * 2;
        y = s * 0.25;
        x = (m10 + m01) / s;
        z = (m21 + m12) / s;
        w = (m02 - m20) / s;
      } else {
        s = Math.sqrt(1.0 + m22 - m00 - m11) * 2;
        z = s * 0.25;
        x = (m02 + m20) / s;
        y = (m21 + m12) / s;
        w = (m10 - m01) / s;
      }

      var rotation = new THREE.Quaternion(x, y, z, w);
      rotation.normalize();

      return rotation;
    },

    onContainerDimensionsChanged: function () {

      // TODO: This isn't needed anymore
      console.error('Player.onContainerDimensionsChanged is deprecated.');
      return;

      var dimensions;

      if (this.domElement != document) {
        dimensions = {
          size: [ this.domElement.offsetWidth, this.domElement.offsetHeight ],
          offset: [ this.domElement.offsetLeft, this.domElement.offsetTop ]
        };
      } else {
        dimensions = {
          size: [ window.innerWidth, window.innerHeight ],
          offset: [ 0, 0 ]
        };
      }
      this.containerDimensions = dimensions;
    },

    destroy: function () {
    }

  };

  return SpaceshipControls;

});
