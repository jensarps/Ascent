define([], function(){
  var comm = {

    listeners: {},

    publish: function(topic, data){
      console.log('topic', topic, 'published with data:', data);
      if(!this.listeners[topic]){
        return;
      }
      this.listeners[topic].forEach(function(callback){
        callback(data);
      });
    },

    subscribe: function(topic, callback){
      console.log('new subscriber for', topic);
      if(!this.listeners[topic]){
        this.listeners[topic] = [];
      }
      this.listeners[topic].push(callback);
    }
  };

  return comm;
});
