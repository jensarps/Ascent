define([
  'src/ui/overlay',
  'src/ui/menu',
  'src/comm'
], function(
  overlay,
  menu,
  comm
){
  var ui = {

    isPaused: true,

    isStarted: false,

    msgOverlay: null,

    init: function(){
      overlay.init();

      var menuNode = overlay.addOverlayChild('menu');
      menu.init(menuNode);
      overlay.show('menu');

      window.addEventListener('keydown', this.onKeyDown.bind(this), false);

      comm.subscribe('ui/fullscreen', this.toggleFullscreen.bind(this));
      document.addEventListener("fullscreenchange", function(){
        if(!this.isPaused){
          this.pauseGame();
        }
      }.bind(this), false);

      comm.subscribe('app/continue', this.hide.bind(this));

      this.msgOverlay = overlay.addOverlayChild('message');

      comm.subscribe('level/fail', this.showMessageScreen.bind(this));
      comm.subscribe('level/win', this.showMessageScreen.bind(this));
      comm.subscribe('level/ready', this.onLevelReady.bind(this));
    },

    showLoadingScreen: function(){
      menu.show('loading');
    },

    showMessageScreen: function(msg){
      this.msgOverlay.innerHTML = '<p>' + msg + '</p>';
      overlay.show('message');
    },

    hide: function(){
      this.isStarted = true;
      this.isPaused = false;
      overlay.hide();
    },

    onKeyDown: function(evt){

      //console.log('Key:', evt.keyCode);

      switch (event.keyCode) {

        case 27: // ESC
        case 80: // P
          if(!this.isStarted){
            console.log('not started!');
            return;
          }
          this.togglePause();
          break;
        case 38: // up
          menu.focusPrevious();
          break;
        case 40: // down
          menu.focusNext();
          break;
        case 13: // enter
          menu.selectCurrent();
          break;
    	}
    },

    pauseGame: function(){
      this.isPaused = true;
      menu.show('pause');
      overlay.show('menu');
      comm.publish('ui/pauseToggle', true);
    },

    unPauseGame: function(){
      this.isPaused = false;
      overlay.hide();
      comm.publish('ui/pauseToggle', false);
    },

    togglePause: function(){
      if(this.isPaused) {
        this.unPauseGame();
      } else {
        this.pauseGame();
      }
    },

    toggleFullscreen: function(){
      if(!GameShim.supports.fullscreen){
        console.error('No Fullscreen support');
        return;
      }
      var isFullscreen = document.fullscreenEnabled;
      if(isFullscreen){
        document.exitFullscreen();
      }else{
        document.documentElement.requestFullScreen();
      }
    },

    onLevelReady: function(msg){
      this.showMessageScreen(msg);

      var node = this.msgOverlay;
      var listener = function(){
        node.removeEventListener('click', listener);
        comm.publish('user/ready');
      }
      node.addEventListener('click', listener);
    }

  };

  return ui;

});
