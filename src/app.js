require([
  'src/screen-util',
  'src/ui/ui',
  'src/comm',
  'src/level-registry',
  'campaigns/collection'
], function(
  screenUtil,
  ui,
  comm,
  levelRegistry,
  campaignCollection
){

  var app = {

    container: null,

    isPaused: false,

    lastDelta: null,

    clock: null,

    stats: null,

    scene: null,

    renderer: null,

    level: null,

    init: function() {

      if (!Detector.webgl) Detector.addGetWebGLMessage();

      ui.init();

      var container = this.container = document.createElement('div');
      document.body.appendChild(container);

      window.scene = this.scene = new THREE.Scene();
      console.log(this.scene);

      var renderer = this.renderer = new THREE.WebGLRenderer({
        clearColor: 0x000000,
        clearAlpha: 1,
        antialias: true
      });
      renderer.setSize(screenUtil.width, screenUtil.height);
      renderer.sortObjects = false;
      renderer.shadowMapEnabled = true;
      container.appendChild(renderer.domElement);

      this.clock = new THREE.Clock();
      this.stats = this.addStats(container);
      this.runSubscriptions();
    },

    runSubscriptions: function(){
      comm.subscribe('app/continue', function(){ this.onPauseToggle(false); }.bind(this));
      comm.subscribe('app/load', function(level){

        ui.showLoadingScreen();

        if(this.level){
          // There's an old level still there.
          this.level.destroy();
          this.scene.children.map(this.scene.remove.bind(this.scene));
          // This doesn't remove ParticleSystems, Cameras and Lights...
          console.log('children now:', this.scene.children.length);
          console.log(this.scene.children);
          this.renderer.clear();
        }

        this.level = levelRegistry.levels[level];
        this.level.setup(this.scene, this.container);

        screenUtil.setUpdateCallback(this.onWindowResize.bind(this));
      }.bind(this));

      comm.subscribe('ui/pauseToggle', this.onPauseToggle.bind(this));

      comm.subscribe('user/ready', this.onUserReady.bind(this));

      comm.subscribe('level/fail', function(msg){
        this.isPaused = true;
        this.clock.stop();
      }.bind(this));
      comm.subscribe('level/win', function(msg){
        this.isPaused = true;
        this.clock.stop();
      }.bind(this));
      comm.subscribe('level/quit', function(){
        // Should do the destroy here, but since that isn't working...
        location.href = location.href;
      });
    },

    addStats: function(container) {
      var stats = new Stats();
      stats.domElement.style.position = 'absolute';
      stats.domElement.style.top = '10px';
      stats.domElement.style.zIndex = 100001;
      container.appendChild(stats.domElement);
      return stats;
    },

    onPauseToggle: function(isPaused){
      this.isPaused = isPaused;
      if(isPaused){
        this.clock.stop();
      }else{
        this.clock.start();
        this.tick();
      }
    },

    onWindowResize: function(width, height) {
      this.renderer.setSize(width, height);
      this.level.onContainerDimensionsChanged(width, height);
    },

    onUserReady: function(){
      ui.hide();
      this.level.start();
      this.tick();
    },

    tick: function() {

      if(this.isPaused){
        return;
      }

      requestAnimationFrame(this.tick.bind(this));

      var delta = this.clock.getDelta();
      this.level.onBeforeRender(delta);
      this.renderer.render(this.scene, this.level.player.camera);

      this.stats.update();
    }
  };

  app.init();

});
