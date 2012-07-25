define(function(){
  var KEYBOARD = 'keyboard',
      MOUSE = 'mouse';

  var bindings = {

    accelerate: {
      device: KEYBOARD,
      key: 87, // w
      down: true,
      up: true
    },

    rollLeft: {
      device: KEYBOARD,
      key: 81, // q
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
      key: 82, // r
      down: true,
      up: false
    },

    focusNext: {
      device: KEYBOARD,
      key: 84, // t
      down: true,
      up: false
    }
  };

  return bindings;
});
