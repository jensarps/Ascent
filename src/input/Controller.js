define([
  'src/registry',
  'src/input/Keyboard',
  'src/input/Mouse',
  'src/input/bindings',
  'src/tools'
], function(
  registry,
  Keyboard,
  Mouse,
  bindings,
  tools
){

  var InputController = function(){
    var input = {};
    registry.set('input', input);

    this.setupBindings(bindings, input);

    this.keybord = new Keyboard(this.bindings.keyboard, input);
    this.mouse = new Mouse(this.bindings.mouse, input);
  };

  InputController.prototype = {
    
    bindings: {},

    setupBindings: function(bindings, input){
      Object.keys(bindings).forEach(function(description){
        var binding = bindings[description];
        input[description] = 0;

        if(!this.bindings[binding.device]){
          this.bindings[binding.device] = {};
        }
        this.bindings[binding.device][binding.inputId] = {
          description: description,
          down: binding.down,
          up: binding.up
        }
      }, this);
    },

    destroy: function(){
      this.keybord.destroy();
      this.mouse.destroy();
      registry.remove('input');
    }

  };

  return InputController;
});
