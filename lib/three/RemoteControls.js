/**
 * @author Jens Arps
 *
 * Based on FlyControls by James Baicoianu / http://www.baicoianu.com/
 */

THREE.RemoteControls = function ( object ) {

  this.object = object;

//console.log('RemoteControls started:', this.object);

  this.domElement = document;

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
    rollRight: 0,
    velocity: 0
  };
  this.moveVector = new THREE.Vector3( 0, 0, 0 );
  this.rotationVector = new THREE.Vector3( 0, 0, 0 );

  this.propertyTargets = {};
  this.propertyDurations = {};
  this.targetPosition = null;
  this.targetRotation = null;

  this.updateMovementVector();
  this.updateRotationVector();
};

THREE.RemoteControls.prototype = {

  update: function( delta ) {

    var isDirty = false;

    for(var propName in this.propertyTargets){
      var target = this.propertyTargets[propName];
      var propParent = this.moveState;

      var diff = (target.targetValue - propParent[propName]);
      var steps = target.duration / delta;
      var stepSize = diff / steps;

      propParent[propName] += stepSize;
      target.duration -= delta;

      if(target.duration <= 0){
//console.log('target', propName, 'reached', target.targetValue, propParent[propName]);
        propParent[propName] = target.targetValue;
        if(target.onValueReached){
//console.log('remote controls firing callback for', propName, target.targetValue);
          setTimeout(target.onValueReached, 0);
        }
        delete this.propertyTargets[propName];
      }

      isDirty = true;
    }

    for(var propName in this.propertyDurations){
      var item = this.propertyDurations[propName];

      if(!item.hasStarted){
        this.moveState[propName] = 1;
        isDirty = true;
        item.hasStarted = true;
      }
      item.duration -= delta;

      if(item.duration <= 0){
//console.log('remote controls re-setting ' + propName);
        this.moveState[propName] = 0;
        isDirty = true;
        if(item.onDurationReached){
          setTimeout(item.onDurationReached, 0);
        }
        delete this.propertyDurations[propName];
      }
    }

    if(isDirty){
      this.updateMovementVector();
      this.updateRotationVector();
    }

    this.velocity = this.moveState.velocity;
    var factor = Math.max(0, this.velocity - this.breakingForce);
    var diff = factor - this.movementSpeed;
    this.movementSpeed += (diff / this.inertia);

    var speed = this.movementSpeed * this.maxSpeed;

    var moveMult = delta * speed;
    var rotMult = delta * this.rollSpeed;

    this.object.translateX( this.moveVector.x * moveMult );
    this.object.translateY( this.moveVector.y * moveMult );
    this.object.translateZ( this.moveVector.z * moveMult );

    if(this.followTarget){
      if(this.targetPositionUpdateDelta <= 0) {
        this.targetPositionUpdateDelta = this.targetPositionUpdateInterval;
//console.log('- need to update rotation');
        this.targetRotation = this.getRotationTowardsTarget(this.followTarget.position);
        this.targetRotation._steps = null;
      } else {
        this.targetPositionUpdateDelta -= delta * 1000;
//console.log(' - update due in ', this.targetPositionUpdateDelta);
      }
    }

    if(this.targetMode){

      if(this.targetRotation) {

        var diffX = this.object.quaternion.x - this.targetRotation.x;
        var diffY = this.object.quaternion.y - this.targetRotation.y;
        var diffZ = this.object.quaternion.z - this.targetRotation.z;
        var diffW = this.object.quaternion.w - this.targetRotation.w;
/*
        console.log(
          diffX.toFixed(2),
          diffY.toFixed(2),
          diffY.toFixed(2),
          diffW.toFixed(2)
        );
*/
        if(!this.targetRotation._steps){
          //console.log(this.object.quaternion);
          //console.log(this.targetRotation);

          var maxDiff = Math.max(diffX, diffY, diffZ, diffW);
          var steps = Math.round(maxDiff * 1000);
          //console.log('Steps to reach rotation:', steps);

          this.targetRotation._steps = steps < 1 ? 1 : steps;
        }

        var steps = this.targetRotation._steps;

        var modifier = diffX > 0 ? 1 : -1;
        var absX = Math.abs(diffX);
//        diffX = absX < 0.001 ? diffX : modifier * Math.min(absX, 0.1);
        
        var modifier = diffY > 0 ? 1 : -1;
        var absY = Math.abs(diffY);
//        diffY = absY < 0.001 ? diffY : modifier * Math.min(absY, 0.1);
        
        var modifier = diffZ > 0 ? 1 : -1;
        var absZ = Math.abs(diffZ);
//        diffZ = absZ < 0.001 ? diffZ : modifier * Math.min(absZ, 0.1);
        
        var modifier = diffW > 0 ? 1 : -1;
        var absW = Math.abs(diffW);
//        diffW = absW < 0.001 ? diffW : modifier * Math.min(absW, 0.1);
/*
        console.log(
          diffX.toFixed(2),
          diffY.toFixed(2),
          diffY.toFixed(2),
          diffW.toFixed(2)
        );
*/


        this.tmpQuaternion.set(
          this.object.quaternion.x -= ( Math.abs(diffX) < 0.001 ? diffX : ( diffX / steps ) ),
          this.object.quaternion.y -= ( Math.abs(diffY) < 0.001 ? diffY : ( diffY / steps ) ),
          this.object.quaternion.z -= ( Math.abs(diffZ) < 0.001 ? diffZ : ( diffZ / steps ) ),
          this.object.quaternion.w -= ( Math.abs(diffW) < 0.001 ? diffW : ( diffW / steps ) )
        );

        this.object.quaternion = this.tmpQuaternion.normalize();

/*
        this.tmpQuaternion.set(
          diffX,
          diffY,
          diffZ,
          diffZ
        ).normalize();

        this.object.quaternion.multiplySelf( this.tmpQuaternion );
        this.object.quaternion.normalize();


        console.log(
          this.object.quaternion.x,
          this.object.quaternion.y,
          this.object.quaternion.z,
          this.object.quaternion.w
        );

        console.log('------------------------------------------------');
*/
        //if(diffX + diffY + diffY + diffW == 0){
        if(absX + absY + absY + absW == 0){
          delete this.targetRotation;
        }

      }

    } else { // TODO: this is needed for following, but breaks normal RC
      this.tmpQuaternion.set( this.rotationVector.x * rotMult, this.rotationVector.y * rotMult, this.rotationVector.z * rotMult, /* this.object.quaternion.w */ 1).normalize();
      this.object.quaternion.multiplySelf( this.tmpQuaternion );
    }


    this.object.matrix.setPosition( this.object.position );
    this.object.matrix.setRotationFromQuaternion( this.object.quaternion );
    this.object.matrixWorldNeedsUpdate = true;

  },

  updateMovementVector: function() {

    var forward = ( this.moveState.forward || ( this.autoForward && !this.moveState.back ) ) ? 1 : 0;

    this.moveVector.x = ( -this.moveState.left    + this.moveState.right );
    this.moveVector.y = ( -this.moveState.down    + this.moveState.up );
    this.moveVector.z = ( -forward + this.moveState.back );

    //console.log( 'move:', [ this.moveVector.x, this.moveVector.y, this.moveVector.z ] );

  },

  updateRotationVector: function() {

    this.rotationVector.x = ( -this.moveState.pitchDown + this.moveState.pitchUp );
    this.rotationVector.y = ( -this.moveState.yawRight  + this.moveState.yawLeft );
    this.rotationVector.z = ( -this.moveState.rollRight + this.moveState.rollLeft );

    //console.log( 'rotate:', [ this.rotationVector.x, this.rotationVector.y, this.rotationVector.z ] );

  },

  setPropertyTarget: function(property, targetValue, duration, onValueReached){
    this.propertyTargets[property] = {
      targetValue: targetValue,
      duration: duration,
      onValueReached: onValueReached
    };
  },

  setPropertyDuration: function(property, duration, onDurationReached){
    this.propertyDurations[property] = {
      duration: duration,
      onDurationReached: onDurationReached
    };
  },

  flyTo: function(targetPosition){
    this.targetMode = true;
    this.targetPosition = targetPosition;
    this.targetRotation = this.getRotationTowardsTarget(targetPosition);
  },

  follow: function(target, updateInterval){
    this.targetMode = true;
    this.followTarget = target;
    this.targetRotation = this.getRotationTowardsTarget(target.position);
    this.targetPositionUpdateInterval = updateInterval;
    this.targetPositionUpdateDelta = updateInterval;
  },

  getRotationTowardsTarget: function(vecEnd){

    var vecstart = this.object.position;
    var vecUp = this.object.up;

    var temp = new THREE.Matrix4()
    temp.lookAt(vecstart,vecEnd,vecUp);

    var m00 = temp.n11, m10 = temp.n21, m20 = temp.n31,
      m01 = temp.n12, m11 = temp.n22, m21 = temp.n32,
      m02 = temp.n13, m12 = temp.n23, m22 = temp.n33;

    var t = m00 + m11 + m22,s,x,y,z,w;

    if (t > 0) {
      s =  Math.sqrt(t+1)*2;
      w = 0.25 * s;
      x = (m21 - m12) / s;
      y = (m02 - m20) / s;
      z = (m10 - m01) / s;
    } else if ((m00 > m11) && (m00 > m22)) {
      s =  Math.sqrt(1.0 + m00 - m11 - m22)*2;
      x = s * 0.25;
      y = (m10 + m01) / s;
      z = (m02 + m20) / s;
      w = (m21 - m12) / s;
    } else if (m11 > m22) {
      s =  Math.sqrt(1.0 + m11 - m00 - m22) *2;
      y = s * 0.25;
      x = (m10 + m01) / s;
      z = (m21 + m12) / s;
      w = (m02 - m20) / s;
    } else {
      s =  Math.sqrt(1.0 + m22 - m00 - m11) *2;
      z = s * 0.25;
      x = (m02 + m20) / s;
      y = (m21 + m12) / s;
      w = (m10 - m01) / s;
    }

    var rotation = new THREE.Quaternion(x,y,z,w);
    rotation.normalize();

    return rotation;
  },

  destroy: function(){
    // nothing to do here.
  }

};
