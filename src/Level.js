define([
  'src/tools',
  'src/scene-util',
  'src/comm',
  'src/Player',
  'src/registry',

  'src/entity/Ship',
  'src/entity/Asteroid',
  'src/entity/AsteroidBelt'
], function (
  tools,
  sceneUtil,
  comm,
  Player,
  registry,
  Ship,
  Asteroid,
  AsteroidBelt
) {

  var Level = function (options) {

    this.defaultOptions = {
      name: 'Default Level',
      description: 'This is a default level template.',
      failMessage: 'Failed!',
      successMessage: 'Success!',
      playerShip: 'pulsar'
    };
    this.options = tools.mixin(this.defaultOptions, options);

    this.name = this.options.name;

    this.scene = null;
    this.player = null;

    this.started = false;
    this.toLoad = 0;
    this.maxLoad = 0;

    this._onInit = function () {
    };
    this._onBeforeStart = function () {
    };
    this._onUpdate = function () {
    };

    this.setup = function (scene, container) {
      this.scene = scene;

      this.player = new Player(scene, container, this.options.playerShip);

      sceneUtil.addLights(scene);

      this.toLoad++;
      this.maxLoad++;
      sceneUtil.addSkybox(scene, { folder: 'textures/skybox/nebula/' }, this.onItemLoaded.bind(this, 'skybox'));

      this.initLevel();
    };

    this.initLevel = function () {
      this._onInit();
    };

    this.onItemLoaded = function (type) {
      this.toLoad--;
      var msg = ( this.maxLoad - this.toLoad) + '/' + this.maxLoad;
      console.log('loaded ' + msg, type);
      comm.publish('level/asset-loading', msg);
      this.toLoad || this.onLevelReady();
    };

    this.onLevelReady = function () {
      comm.publish('level/ready', this.options.description);
    };

    this.start = function () {
      this.started = true;
      this._onBeforeStart();
    };

    this.onBeforeRender = function (delta) {
      this.player.update(delta);
      this._onUpdate(delta);
    };

  }

  Level.prototype = {

    addEntity: function (type, options) {
      var entity;
      switch (type.toLowerCase()) {
        case 'ship':
          this.toLoad++;
          this.maxLoad++;
          entity = new Ship(this.scene, options, this.onItemLoaded.bind(this, type));
          break;
        case 'asteroidbelt':
          this.toLoad++;
          this.maxLoad++;
          entity = new AsteroidBelt(this.scene, options, this.onItemLoaded.bind(this, type));
          break;
      }
      return entity;
    },

    addShip: function (type, options) {
      options.type = type;
      return this.addEntity('ship', options);
    },

    onInit: function (_onInit) {
      this._onInit = _onInit.bind(this);
    },

    onBeforeStart: function (_onBeforeStart) {
      this._onBeforeStart = _onBeforeStart.bind(this);
    },

    onUpdate: function (_onUpdate) {
      this._onUpdate = _onUpdate.bind(this);
    },

    onLevelSuccess: function (msg) {
      comm.publish('level/win', msg);
    },

    onLevelFail: function (msg) {
      comm.publish('level/fail', msg);
    },

    onContainerDimensionsChanged: function (width, height) {
      this.player.onContainerDimensionsChanged(width, height);
    },

    destroy: function () {
      // TODO: add user func
      this.player.destroy();
    }

  };

  return Level;

});
