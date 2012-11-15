define(function(){

  var KeyboardHandler = function(bindings, input){
    this.bindings = bindings;
    this.input = input;

    document.addEventListener('keyup', ( this.upListener = this.onKeyUp.bind(this) ), false);
    document.addEventListener('keydown', ( this.downListener = this.onKeyDown.bind(this) ), false);
  };

  KeyboardHandler.prototype = {

    onKeyDown: function(evt){
      if(evt.keyCode in this.bindings){
        var binding = this.bindings[evt.keyCode];
        if(binding.down){
          this.input[binding.description] = 1;
        }
      }
    },

    onKeyUp: function(evt){
      if(evt.keyCode in this.bindings){
        var binding = this.bindings[evt.keyCode];
        if(binding.up){
          this.input[binding.description] = 0;
        }
      }
    },

    destroy: function(){
      document.removeEventListener('keyup', this.upListener, false);
      document.removeEventListener('keydown', this.downListener, false);
    }
  };

  return KeyboardHandler;
});
