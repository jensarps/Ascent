define([
  'src/tools',
  'src/ships'
], function(
  tools,
  ships
){

  var Asteroid = function(scene, position, onAddedToScene, noControls){
    this.name = 'asteroid';
    this.scene = scene;
    this.initialPosition = position;
    this.onAddedToScene = onAddedToScene;
    this.hasControls = !noControls;

    tools.mixin(this, ships['asteroid']);

    this.loadModel(position);
  };

  Asteroid.prototype = {

    hasControls: null,

    initialPosition: null,

    isCollection: false,

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

      object.scale.x = this.scale.x + Math.random() * 3;
      object.scale.y = this.scale.y + Math.random() * 3;
      object.scale.z = this.scale.z + Math.random() * 3;

      object.position.x = this.initialPosition.x;
      object.position.y = this.initialPosition.y;
      object.position.z = this.initialPosition.z;

      object.rotation.x = Math.random() * Math.PI;
      object.rotation.y = Math.random() * Math.PI;
      object.rotation.z = Math.random() * Math.PI;

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

      /*
      var mesh = object.children.filter(function(child){
        return child instanceof THREE.Mesh;
      })[0];

      object.geometry = mesh.geometry;
      */

      this.scene.add(object);

      this.onAddedToScene(this);
    },

    update: function(delta){
    },

    destroy: function(){
      this.scene.remove(this.model);
      delete this.model;
    }

  };

  return Asteroid;
});
