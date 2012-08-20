define([
  'src/tools',
  'src/ships'
], function(
  tools,
  ships
){

  var idCounter = 0;

  var Ship = function(scene, options, onAddedToScene, noControls){
    this.id = 'ship-' + idCounter++;
    this.name = options.type;
    this.scene = scene;
    this.initialPosition = options.position;
    this.onAddedToScene = onAddedToScene;
    this.hasControls = !noControls;

    tools.mixin(this, ships[options.type]);

    this.loadModel(options.position);
  };

  Ship.prototype = {

    hasControls: null,

    initialPosition: null,

    controls: null,

    model: null,

    scene: null,

    onAddedToScene: null,

    loadModel: function(){
      var loader = new THREE.ColladaLoader();
      loader.options.convertUpAxis = true;
      loader.load(this.modelPath, this.onModelLoaded.bind(this));
    },

    onModelLoaded: function(collada){
      var object = this.model = collada.scene;

      object.scale.x = this.scale.x;
      object.scale.y = this.scale.y;
      object.scale.z = this.scale.z;

      object.position.x = this.initialPosition.x;
      object.position.y = this.initialPosition.y;
      object.position.z = this.initialPosition.z;

      object.name = this.name;
      object.castShadow = true;
      object.receiveShadow = true;

      object.updateMatrix();

      // mixin gemoetries into the object to make
      // it accessible by Ray
      //object.geometry = collada.dae.geometries[this.meshName].mesh.geometry3js;

      /*
      this.intersectingGeometries = Object.keys(collada.dae.geometries).map(function(name){
        return collada.dae.geometries[name].mesh.geometry3js;
      });
      */

      var mesh = object.children.filter(function(child){
        return child instanceof THREE.Mesh;
      })[0];

      object.geometry = mesh.geometry;

      this.scene.add(object);

      if(this.hasControls){
        var controls = this.controls = new THREE.RemoteControls(object);
        controls.rollSpeed = this.rollSpeed;
        controls.inertia = this.inertia;
        controls.maxSpeed = this.maxSpeed;
      }

      this.onAddedToScene();
    },

    update: function(delta){
      if(this.hasControls){
        this.controls.update(delta);
      }
    },

    destroy: function(){
      if(this.hasControls){
        this.controls.destroy();
      }
      this.scene.remove(this.model);
    }

  };

  return Ship;
});
