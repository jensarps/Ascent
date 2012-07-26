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

    setupBindings: function(bindings, input){
      Object.keys(bindings).forEach(function(description){
        var binding = bindings[description];
        input[description] = 0;

        if(binding.device == 'keyboard'){
          this.bindings[binding.device][binding.key] = {
            description: description,
            down: binding.down,
            up: binding.up
          }
        } else if (binding.device == 'mouse') {
          this.bindings[binding.device][binding.id] = {
            description: description
          }
        }
      }, this);
    },

    bindings: {
      keyboard: {},
      mouse: {}
    },

    destroy: function(){
      this.keybord.destroy();
      this.mouse.destroy();
      registry.remove('input');
    }

  };

  return InputController;
});
