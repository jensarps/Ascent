define(function () {

  /**
   * Gamepad polling code taken from this fantastic article by Marcin Wichary:
   *
   * http://www.html5rocks.com/en/tutorials/doodles/gamepad/
   */

  var GamepadHandler = function (bindings, input) {
    this.bindings = bindings;
    this.input = input;

    this.gamepads = [];
    this.prevRawGamepadTypes = [];
    this.prevTimestamps = [];
    this.buttonStates = [];
    
    this.init();
  };

  GamepadHandler.prototype = {

    deadzone: 0.01,

    buttonStates: null,

    gamepads: null,

    isPolling: false,

    prevRawGamepadTypes: null,

    prevTimestamps: null,

    init: function () {

      var isAvailable = !!navigator.webkitGetGamepads || !!navigator.webkitGamepads || (navigator.userAgent.indexOf('Firefox/') != -1);

      if (isAvailable) {
        window.addEventListener('MozGamepadConnected', ( this.connectListener = this.onGamepadConnect.bind(this) ), false);
        window.addEventListener('MozGamepadDisconnected', ( this.disconnectListener = this.onGamepadDisconnect.bind(this) ), false);
        if (!!navigator.webkitGamepads || !!navigator.webkitGetGamepads) {
          this.startPolling();
        }
      }
    },

    onGamepadConnect: function (evt) {
      this.gamepads.push(evt.gamepad);
      this.startPolling();
    },

    onGamepadDisconnect: function (evt) {
      for (var i = this.gamepads - 1; i >= 0; i--) {
        if (this.gamepads[i].index == evt.gamepad.index) {
          this.gamepads.splice(i, 1);
          break;
        }
      }
      if (this.gamepads.length == 0) {
        this.stopPolling();
      }
    },

    startPolling: function () {
      if (!this.isPolling) {
        this.isPolling = true;
        this.tick();
      }
    },

    stopPolling: function () {
      this.isPolling = false;
    },

    tick: function () {
      if (this.isPolling) {
        var tick = this.tick.bind(this);
        if (window.requestAnimationFrame) {
          window.requestAnimationFrame(tick);
        } else if (window.mozRequestAnimationFrame) {
          window.mozRequestAnimationFrame(tick);
        } else if (window.webkitRequestAnimationFrame) {
          window.webkitRequestAnimationFrame(tick);
        }
      }

      this.pollStatus();
    },

    pollStatus: function () {
      this.pollGamepads();
      for (var i = 0, m = this.gamepads.length; i<m; i++) {
        var gamepad = this.gamepads[i];
        if (gamepad.timestamp && (gamepad.timestamp == this.prevTimestamps[i])) {
          continue;
        }
        this.prevTimestamps[i] = gamepad.timestamp;
        this.onStatusChanged(i);
      }
    },

    pollGamepads: function () {
      var rawGamepads = (navigator.webkitGetGamepads && navigator.webkitGetGamepads()) || navigator.webkitGamepads;
      var i,m;

      if (rawGamepads) {
        this.gamepads.length = 0;
        var gamepadsChanged = false;
        for (i = 0, m = rawGamepads.length; i < m; i++) {
          if (typeof rawGamepads[i] != this.prevRawGamepadTypes[i]) {
            gamepadsChanged = true;
            this.prevRawGamepadTypes[i] = typeof rawGamepads[i];
          }
          if (rawGamepads[i]) {
            this.gamepads.push(rawGamepads[i]);
          }
        }
        if (gamepadsChanged) {

          this.buttonStates.length = 0;

          for(i= 0, m=this.gamepads.length; i<m; i++){
            var gamepad = this.gamepads[i];
            var states = this.buttonStates[i] = [];
            gamepad.buttons.forEach(function(initialValue, index){
              states[index] = initialValue;
            }, this);
          }

        }
      }
    },

    onStatusChanged: function (gamepadId) {

      var gamepad = this.gamepads[gamepadId];
      var states = this.buttonStates[gamepadId];

      var i, m,binding;

      for(i = 0, m = gamepad.buttons.length; i<m; i++){
        var currentValue = gamepad.buttons[i];
        var oldValue = states[i];
        var buttonId = 'button-' + i;

        if(oldValue != currentValue ){
          var type = currentValue > oldValue ? 'down' : 'up';
          states[i] = currentValue;

          if(buttonId in this.bindings){
            binding = this.bindings[buttonId];
            if(binding[type]){
              this.input[binding.description] = currentValue;
            }
          }
        }
      }

      for(i = 0, m=gamepad.axes.length; i<m; i++){
        var axisId = 'axis-' + i;
        if(axisId in this.bindings){
          binding = this.bindings[axisId];
          var value = gamepad.axes[i];
          if(binding.invert){
            value *= -1;
          }
          this.input[binding.description] = Math.abs(value) > this.deadzone ? value : 0;
        }
      }
    },

    destroy: function(){
      window.removeEventListener('MozGamepadConnected', this.connectListener, false);
      window.removeEventListener('MozGamepadDisconnected', this.disconnectListener, false);
    }
  };

  return GamepadHandler;

});
