define({
  0: {
    time: 0.001,
    cmd: 'setPropertyTarget',
    args: ['velocity', 0.8, 8]
  },
  2: {
    time: 10,
    cmd: 'setPropertyTarget',
    args: ['pitchDown', -0.5, 5]
  },
  1: {
    time: 20,
    cmd: 'setPropertyDuration',
    args: ['rollRight', 5]
  },
  3: {
    time: 25,
    cmd: 'setPropertyTarget',
    args: ['pitchDown', 0, 5]
  },
  4: {
    time: 26,
    cmd: 'setPropertyDuration',
    args: ['rollLeft', 5]
  },
  5: {
    time: 26,
    cmd: 'setPropertyTarget',
    args: ['pitchDown', 0.1, 5],
    next: 6
  },
  6: {
    cmd: 'setPropertyTarget',
    args: ['pitchDown', 0, 5]
    //next: 7
  },
  7: {
    cmd: 'setPropertyTarget',
    args: ['velocity', 0.6, 5]
  },
  8: {
    time: 35,
    cmd: 'setPropertyDuration',
    args: ['rollRight', 3]
  },
  9: {
    time: 35,
    cmd: 'setPropertyTarget',
    args: ['pitchDown', -0.2, 3],
    next: 10
  },
  10: {
    cmd: 'setPropertyTarget',
    args: ['pitchDown', 0, 3]
  },
  11: {
    time: 55,
    cmd: 'setPropertyDuration',
    args: ['rollRight', 10]
  },
  12: {
    time: 55,
    cmd: 'setPropertyTarget',
    args: ['pitchDown', -0.3, 3],
    next: 13
  },
  13: {
    cmd: 'setPropertyTarget',
    args: ['pitchDown', 0, 3]
  },
  14: {
    time: 65,
    cmd: 'setPropertyTarget',
    args: ['pitchDown', 0.8, 8],
    next: 15
  },
  15: {
    cmd: 'setPropertyTarget',
    args: ['pitchDown', 0, 10]
  },
  16: {
    time: 90,
    cmd: 'setPropertyDuration',
    args: ['rollRight', 10]
  },
  17: {
    time: 90,
    cmd: 'setPropertyTarget',
    args: ['pitchDown', -0.3, 3],
    next: 18
  },
  18: {
    cmd: 'setPropertyTarget',
    args: ['pitchDown', 0, 3]
  }
});
