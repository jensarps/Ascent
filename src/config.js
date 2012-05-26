define([
  'src/tools',
  'src/comm'
], function(tools, comm){

  var config = {

    controls: {

      invertYAxis: true

    }

  };

  tools.mixin(config, JSON.parse(localStorage.getItem('__ascent_config') || '{}'));

  comm.subscribe('config/set', function(data){
    var keyString = data[0];
    var value = data[1];
    // check for boolean state
    if(['on', 'off'].indexOf(value) !== -1){
      value = value == 'on';
    }
    config.setItem(keyString, value);
    localStorage.setItem('__ascent_config', JSON.stringify(config));
  });

  config.getItem = function(keyString){
    var keys = keyString.split('.');
    var prop = config;
    for(var i = 0; i < keys.length; i++){
      prop = prop[keys[i]];
    }
    return prop;
  };

  config.setItem = function (keyString, value) {
    var keys = keyString.split('.');
    var prop = config;
    for (var i = 1; i < keys.length; i++) {
      prop = prop[keys[i - 1]];
    }
    prop[keys[keys.length - 1]] = value;
  };

  return config;

});
