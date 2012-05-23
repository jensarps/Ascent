define(function(){

  var screenUtil = {

    updateCallback: function(){},

    width: null,

    height: null,

    setUpdateCallback: function(callback){
      this.updateCallback = callback;
    },

    update: function(){
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.updateCallback(this.width, this.height);
    },

    connect: function(){
      window.addEventListener('resize', this.update.bind(this), false);
    }

  };

  screenUtil.update();
  screenUtil.connect();

  return screenUtil;

});
