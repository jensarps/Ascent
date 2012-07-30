define([], function(){
  var tools = {

    mixin: function(destination, source) {
      var index,
          key,
          length = arguments.length;

      for (index = 1; index < length; index += 1) {
        source = arguments[index] || {};
        for (key in source) {
          destination[key] = source[key];
        }
      }
      return destination;
    },

    getDistance: function(a, b){
      return Math.sqrt(
        Math.pow(a.x - b.x, 2) +
        Math.pow(a.y - b.y, 2) +
        Math.pow(a.z - b.z, 2)
      );
    },

    create: function(type, props, parentNode) {
      var node = document.createElement(type);
      if(props){
        for(var attribute in props){
          node[attribute] = props[attribute];
        }
      }
      if(parentNode){
        parentNode.appendChild(node);
      }
      return node;
    },

    clamp: function(min, max, value){
      return Math.min(max, Math.max(min, value));
    }

  };

  return tools;
});
