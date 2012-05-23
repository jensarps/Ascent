define([],function(){

  var Flightplan = function(controls){
    this.controls = controls;
  };

  Flightplan.prototype = {

    elapsedTime: null,

    controls: null,

    schedule: null,

    timedItems: null,

    setSchedule: function(schedule){
      this.schedule = schedule;
      this.elapsedTime = 0;
      this.timedItems = [];
    },

    start: function(){
      for(var i = 0, m = Object.keys(this.schedule).length; i<m; i++){
        var item = this.schedule[i];
        if(item.time){
          this.timedItems.push(item);
        }
      }
    },

    executeCommand: function(options){
      //console.log('executeCommand called:', options.args);
      var args = options.args.slice(0);

      if(typeof options.next != 'undefined'){
        //console.log(' - next found: ', this.schedule[options.next].args);
        args.push(function(){
          //console.log('-- executing next callback:');
          this.executeCommand(this.schedule[options.next]);
        }.bind(this));
      }

      console.log('apply:', args);
      this.controls[options.cmd].apply(this.controls, args);
    },

    update: function(delta){
      this.elapsedTime += delta;
      this.timedItems = this.timedItems.filter(function(item){
        if(item.time <= this.elapsedTime){
          this.executeCommand(item);
          return false;
        } else {
          return true;
        }
      }, this);
    }
  };

  return Flightplan;
});
