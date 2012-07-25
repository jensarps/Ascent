define(function(){
  var KEYBOARD = 'keyboard',
      MOUSE = 'mouse';

  var bindings = {

    accelerate: {
      device: KEYBOARD,
      key: 87,
      down: true,
      up: true
    },

    rollLeft: {
      device: KEYBOARD,
      key: 81,
      down: true,
      up: true
    },

    yaw: {
      device: MOUSE,
      id: 'x'
    },

    pitch: {
      device: MOUSE,
      id: 'y'
    },

    toggleRadar: {
      device: KEYBOARD,
      key: 82,
      down: true,
      up: false
    }
  };

  return bindings;
});
