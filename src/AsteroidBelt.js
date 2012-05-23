define([
  'src/tools',
  'src/ships'
], function(
  tools,
  ships
  ){

  var AsteroidBelt = function(scene, options, onAddedToScene){

    var opts = tools.mixin(this.defaultOptions, options || {});
    tools.mixin(this, opts);

    this.name = 'asteroid';
    this.scene = scene;
    this.onAddedToScene = onAddedToScene;

    this.asteroids = [];

    tools.mixin(this, ships['asteroid']);

    this.loadModel();
    this.loadModel();
  };

  AsteroidBelt.prototype = {

    defaultOptions: {
      position: { x: 0, y: 0, z: 0},
      amount: 10,
      stretchAxis: 'z'
    },

    position: null,

    amount: null,

    stretchAxis: null,

    scene: null,

    onAddedToScene: null,

    loadModel: function(){
      var loader = new THREE.ColladaLoader();
      loader.options.convertUpAxis = true;
      loader.load(this.modelPath, this.onModelLoaded.bind(this));
    },

    onModelLoaded: function(collada){
      var objectProto = this.modelPrototype = collada.scene;

      for(var i = 0; i < this.amount; i++) {

        var object = THREE.SceneUtils.cloneObject(objectProto);

        ['x', 'y', 'z'].forEach(function(axis){

          object.scale[axis] = this.scale[axis] + Math.random() * 3;
          object.rotation[axis] = Math.random() * Math.PI;

          object.position[axis] = this.position[axis] + ( axis == this.stretchAxis ?
            ( i * 125 ) + ( Math.random() * 25 ) :
            Math.random() * 300
          );
        }, this);

        object.name = this.name;
        object.castShadow = true;
        object.receiveShadow = true;

        object.updateMatrix();

        var mesh = object.children.filter(function(child){
          return child instanceof THREE.Mesh;
        })[0];

        object.geometry = mesh.geometry;

        this.scene.add(object);

      }

      this.onAddedToScene();
    },

    update: function(delta){
    },

    destroy: function(){
      this.scene.remove(this.model);
    }

  };

  return AsteroidBelt;
});
