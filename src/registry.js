define(function () {

  var _registry = {};

  return {
    get: function (id) {
      return _registry[id];
    },
    set: function (id, item) {
      _registry[id] = item;
    },
    remove: function (id) {
      delete _registry[id];
    }
  };
});
