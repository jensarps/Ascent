define([
  'src/config',
  'src/screen-util'
], function(
  config,
  screenUtil
){

  var Mouse = function(bindings, input){
    this.bindings = bindings;
    this.input = input;
    this.config = config;

    document.addEventListener('mousemove', ( this.moveListener = this.onMouseMove.bind(this) ), false);
    document.addEventListener('mousedown', ( this.downListener = this.onMouseDown.bind(this) ), false);
    document.addEventListener('mouseup', ( this.upListener = this.onMouseUp.bind(this) ), false);
  };

  Mouse.prototype = {

    onMouseMove: function(evt){
      var halfWidth = screenUtil.width / 2;
      var halfHeight = screenUtil.height / 2;

      var x = -( evt.pageX - halfWidth  ) / halfWidth;
      var y = ( evt.pageY - halfHeight ) / halfHeight * ( config.controls.invertYAxis ? -1 : 1 );

      this.input.mouseX = x;
      this.input.mouseY = y;

      if('x' in this.bindings){
        var binding = this.bindings.x;
        this.input[binding.description] = x;
      }
      if('y' in this.bindings){
        var binding = this.bindings.y;
        this.input[binding.description] = y;
      }
    },

    onMouseDown: function(evt){
      if('button' in this.bindings){
        var binding = this.bindings[evt.keyCode];
        if(binding.down){
          this.input[binding.description] = 1;
        }
      }
    },

    onMouseUp: function(evt){
      if('button' in this.bindings){
        var binding = this.bindings[evt.keyCode];
        if(binding.up){
          this.input[binding.description] = 0;
        }
      }
    },

    destroy: function(){
      document.removeEventListener('mousemove', this.moveListener, false);
      document.removeEventListener('mousedown', this.downListener, false);
      document.removeEventListener('mouseup', this.upListener, false);
    }
  };

  return Mouse;
});
