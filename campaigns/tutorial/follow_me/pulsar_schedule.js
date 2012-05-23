define({
  0: {
    time: 1,
    cmd: 'setPropertyTarget',
    args: ['velocity', 0.3, 3]
  },
  1: {
    time: 10,
    cmd: 'setPropertyTarget',
    args: ['pitchDown', -0.5, 2]
  },
  2: {
    time: 10,
    cmd: 'setPropertyDuration',
    args: ['rollRight', 3],
    next: 3
  },
  3: {
    cmd: 'setPropertyTarget',
    args: ['pitchDown', 0, 5]
  },
  4: {
    time: 22,
    cmd: 'setPropertyDuration',
    args: ['rollLeft', 5]
  },
  5: {
    time: 25,
    cmd: 'setPropertyTarget',
    args: ['pitchDown', -0.5, 5],
    next: 6
  },
  6: {
    cmd: 'setPropertyTarget',
    args: ['pitchDown', 0, 5]
  },
  7: {
    time: 35,
    cmd: 'setPropertyDuration',
    args: ['rollLeft', 8]
  },
  8: {
    time: 39,
    cmd: 'setPropertyTarget',
    args: ['pitchDown', -0.5, 2],
    next: 9
  },
  9: {
    cmd: 'setPropertyTarget',
    args: ['pitchDown', 0, 2]
  },
  10: {
    time: 45,
    cmd: 'setPropertyTarget',
    args: ['pitchDown', 0.8, 5],
    next: 11
  },
  11: {
    cmd: 'setPropertyTarget',
    args: ['pitchDown', 0, 5]
  },
  12: {
    time: 55,
    cmd: 'setPropertyTarget',
    args: ['velocity', 0.8, 3]
  },
  13: {
    time: 55,
    cmd: 'setPropertyDuration',
    args: ['rollLeft', 5]
  }
});
