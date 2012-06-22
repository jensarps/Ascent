define([
  'src/scene-util',
  'src/comm',
  'src/Player'
], function(
  sceneUtil,
  comm,
  Player
){
  var defaultLevel = {

    name: 'Default Level',

    description: 'This is a default level template.',

    failMessage: 'Failed!',

    successMessage: 'Success!',

    playerShip: 'pulsar',

    player: null,

    scene: null,

    started: false,

    onLevelReady: null,

    modelsToLoad: 0,

    setup: function(scene, container){
      this.scene = scene;

      this.player = new Player(scene, container, this.playerShip);

      sceneUtil.addLights(scene);
      sceneUtil.addSkybox(scene, { folder: 'textures/skybox/nebula/' });

      this.initLevel();
    },

    initLevel: function(){
      this.loadModels();
    },

    start: function(){
      this.started = true;
    },

    loadModels: function(){
      // Set the number of models you need to load and
      // call onModelAdded in each model's load callback
      this.modelsToLoad = 1;
      this.onModelAdded();
    },

    onLevelReady: function(){
      comm.publish('level/ready', this.description);
    },

    onModelAdded: function(){
      --this.modelsToLoad || this.onModelsReady();
    },

    onModelsReady: function(){
      setTimeout(this.onLevelReady.bind(this), 1000);
    },

    onBeforeRender: function(delta){
      var player = this.player,
          scene = this.scene,
          camera = player.camera;

      player.update(delta);
    },

    onLevelSuccess: function(msg){
      comm.publish('level/win', msg);
    },

    onLevelFail: function(msg){
      comm.publish('level/fail', msg);
    },

    onContainerDimensionsChanged: function(width, height){
      this.player.onContainerDimensionsChanged(width, height);
    },

    destroy: function(){
      this.player.destroy();
    }

  };

  return defaultLevel;

});
