define([
  'src/registry',
  'lib/decoupled-input/InputController',
  'lib/decoupled-input/MouseHandler',
  'lib/decoupled-input/KeyboardHandler',
  'lib/decoupled-input/GamepadHandler',
  'src/input/bindings',
  'src/config',
  'src/comm'
], function(
  registry,
  InputController,
  MouseHandler,
  KeyboardHandler,
  GamepadHandler,
  bindings,
  config,
  comm
){

  var Controller = function(){
    InputController.call(this, bindings);

    this.registerDeviceHandler(MouseHandler, 'mouse');
    this.registerDeviceHandler(KeyboardHandler, 'keyboard');
    this.registerDeviceHandler(GamepadHandler, 'gamepad');

    comm.subscribe('config/changed', this.onConfigChanged.bind(this));
    this.onConfigChanged();
  };

  Controller.prototype = Object.create(InputController.prototype);

  Controller.prototype.onConfigChanged = function(){
    bindings.pitch.invert = !config.controls.invertYAxis; // ????
    this.updateBindings(bindings);
    
    registry.set('input', this.input);
  };

  return Controller;
});
