define([
  'src/config',
  'src/screen-util',
  'src/tools'
], function(
  config,
  screenUtil,
  tools
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
      var x, y, mouseX, mouseY,
          width = screenUtil.width,
          halfWidth = width / 2,
          height = screenUtil.height,
          halfHeight = height / 2;

      if(document.pointerLockEnabled){
        mouseX = tools.clamp(0, width, this.input.mouseX + evt.movementX);
        mouseY = tools.clamp(0, height, this.input.mouseY + evt.movementY);
      }else{
        mouseX = evt.pageX;
        mouseY = evt.pageY;
      }

      x = -( mouseX - halfWidth  ) / halfWidth;
      y = ( mouseY - halfHeight ) / halfHeight * ( config.controls.invertYAxis ? -1 : 1 );

      this.input.mouseX = mouseX;
      this.input.mouseY = mouseY;

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
