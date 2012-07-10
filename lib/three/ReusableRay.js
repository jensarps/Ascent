/**
 * @author mr.doob / http://mrdoob.com/
 */

THREE.ReusableRay = function () {

  this.precision = 0.0001;

  this.vectorPool = {

    a: new THREE.Vector3(),
    b: new THREE.Vector3(),
    c: new THREE.Vector3(),
    d: new THREE.Vector3(),

    originCopy: new THREE.Vector3(),
    directionCopy: new THREE.Vector3(),

    vector: new THREE.Vector3(),
    normal: new THREE.Vector3(),
    intersectPoint: new THREE.Vector3(),

    v0: new THREE.Vector3(),
    v1: new THREE.Vector3(),
    v2: new THREE.Vector3()

  };

};

THREE.ReusableRay.prototype = {

  distanceFromIntersection: function (origin, direction, position) {

    var dot, intersect, distance,
      vp = this.vectorPool,
      v0 = vp.v0,
      v1 = vp.v1,
      v2 = vp.v2;

    v0.sub(position, origin);
    dot = v0.dot(direction);

    intersect = v1.add(origin, v2.copy(direction).multiplyScalar(dot));
    distance = position.distanceTo(intersect);

    return distance;

  },

  intersectMesh: function (object) {

    var distance, intersect, intersects = [],
      vp = this.vectorPool,
      originCopy = vp.originCopy,
      directionCopy = vp.directionCopy,
      vector = vp.vector,
      normal = vp.normal,
      intersectPoint = vp.intersectPoint,
      a = vp.a,
      b = vp.b,
      c = vp.c,
      d = vp.d;

    // Checking boundingSphere

    distance = this.distanceFromIntersection(this.origin, this.direction, object.matrixWorld.getPosition());
    var scale = THREE.Frustum.__v1.set(object.matrixWorld.getColumnX().length(), object.matrixWorld.getColumnY().length(), object.matrixWorld.getColumnZ().length());

    if (distance > object.geometry.boundingSphere.radius * Math.max(scale.x, Math.max(scale.y, scale.z))) {

      return intersects;

    }

    // Checking faces

    var f, fl, face, dot, scalar,
      geometry = object.geometry,
      vertices = geometry.vertices,
      objMatrix;

    object.matrixRotationWorld.extractRotation(object.matrixWorld);

    for (f = 0, fl = geometry.faces.length; f < fl; f++) {

      face = geometry.faces[ f ];

      originCopy.copy(this.origin);
      directionCopy.copy(this.direction);

      objMatrix = object.matrixWorld;

      // determine if ray intersects the plane of the face
      // note: this works regardless of the direction of the face normal

      vector = objMatrix.multiplyVector3(vector.copy(face.centroid)).subSelf(originCopy);
      normal = object.matrixRotationWorld.multiplyVector3(normal.copy(face.normal));
      dot = directionCopy.dot(normal);

      // bail if ray and plane are parallel

      if (Math.abs(dot) < this.precision) continue;

      // calc distance to plane

      scalar = normal.dot(vector) / dot;

      // if negative distance, then plane is behind ray

      if (scalar < 0) continue;

      if (object.doubleSided || ( object.flipSided ? dot > 0 : dot < 0 )) {

        intersectPoint.add(originCopy, directionCopy.multiplyScalar(scalar));

        if (face instanceof THREE.Face3) {

          a = objMatrix.multiplyVector3(a.copy(vertices[ face.a ]));
          b = objMatrix.multiplyVector3(b.copy(vertices[ face.b ]));
          c = objMatrix.multiplyVector3(c.copy(vertices[ face.c ]));

          if (this.pointInFace3(intersectPoint, a, b, c)) {

            intersect = {

              distance: originCopy.distanceTo(intersectPoint),
              point: intersectPoint.clone(),
              face: face,
              object: object

            };

            intersects.push(intersect);

          }

        } else if (face instanceof THREE.Face4) {

          a = objMatrix.multiplyVector3(a.copy(vertices[ face.a ]));
          b = objMatrix.multiplyVector3(b.copy(vertices[ face.b ]));
          c = objMatrix.multiplyVector3(c.copy(vertices[ face.c ]));
          d = objMatrix.multiplyVector3(d.copy(vertices[ face.d ]));

          if (this.pointInFace3(intersectPoint, a, b, d) || this.pointInFace3(intersectPoint, b, c, d)) {

            intersect = {

              distance: originCopy.distanceTo(intersectPoint),
              point: intersectPoint.clone(),
              face: face,
              object: object

            };

            intersects.push(intersect);

          }

        }

      }

    }

    return intersects;
  },

  intersectObject: function (object) {

    var distance, intersect, intersects = [];

    if (object instanceof THREE.Particle) {

      distance = this.distanceFromIntersection(this.origin, this.direction, object.matrixWorld.getPosition());

      if (distance > object.scale.x) {

        return intersects;

      }

      intersect = {

        distance: distance,
        point: object.position,
        face: null,
        object: object

      };

      intersects.push(intersect);

    } else if (object instanceof THREE.Mesh) {

      intersects = this.intersectMesh(object);

    } else if (object instanceof THREE.Object3D && object.children) {

      for (var i = 0, m = object.children.length; i < m; i++) {
        // do not do uncontrolled recursion, just do first level child meshes.
        var obj = object.children[i];
        if (obj instanceof THREE.Mesh) {
          Array.prototype.push.apply(intersects, this.intersectMesh(obj));
        }

      }

    }

    return intersects;

  },

  intersectObjects: function (objects) {

    var intersects = [];

    for (var i = 0, l = objects.length; i < l; i++) {

      Array.prototype.push.apply(intersects, this.intersectObject(objects[ i ]));

    }

    intersects.sort(function (a, b) {
      return a.distance - b.distance;
    });

    return intersects;

  },

  // http://www.blackpawn.com/texts/pointinpoly/default.html
  pointInFace3: function (p, a, b, c) {

    var dot00, dot01, dot02, dot11, dot12, invDenom, u, v,
      vp = this.vectorPool,
      v0 = vp.v0,
      v1 = vp.v1,
      v2 = vp.v2;

    v0.sub(c, a);
    v1.sub(b, a);
    v2.sub(p, a);

    dot00 = v0.dot(v0);
    dot01 = v0.dot(v1);
    dot02 = v0.dot(v2);
    dot11 = v1.dot(v1);
    dot12 = v1.dot(v2);

    invDenom = 1 / ( dot00 * dot11 - dot01 * dot01 );
    u = ( dot11 * dot02 - dot01 * dot12 ) * invDenom;
    v = ( dot00 * dot12 - dot01 * dot02 ) * invDenom;

    return ( u >= 0 ) && ( v >= 0 ) && ( u + v < 1 );

  },

  setPrecision: function (value) {
    this.precision = value;
  },

  setSource: function (origin, direction) {
    this.origin = origin;
    this.direction = direction;
  }

};