define(function(){
  var KEYBOARD = 'keyboard',
      MOUSE = 'mouse';

  var bindings = {

    accelerate: {
      device: KEYBOARD,
      inputId: 87, // w
      down: true,
      up: true
    },

    decelerate: {
      device: KEYBOARD,
      inputId: 83, // s
      down: true,
      up: true
    },

    rollLeft: {
      device: KEYBOARD,
      inputId: 81, // q
      down: true,
      up: true
    },

    rollRight: {
      device: KEYBOARD,
      inputId: 69, // e
      down: true,
      up: true
    },

    yaw: {
      device: MOUSE,
      inputId: 'x'
    },

    pitch: {
      device: MOUSE,
      inputId: 'y'
    },

    toggleRadar: {
      device: KEYBOARD,
      inputId: 82, // r
      down: true,
      up: false
    },

    focusNext: {
      device: KEYBOARD,
      inputId: 84, // t
      down: true,
      up: false
    }
  };

  return bindings;
});
