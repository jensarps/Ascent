define([],
function(){

  var registry = {

    campaigns: {},

    levels: {},

    addCampaign: function(name, data){
      console.log('adding campaign:', name);
      this.campaigns[name] = data;
    },

    addLevel: function(campaign, name, data){
      this.levels[campaign + '-' + name] = data;
    },

    getCampaign: function(name){
      return this.data[name];
    },

    getLevel: function(campaign, name){
      return this.data[campaign + '-' + name];
    },

    getLevelIdsForCampaign: function(campaign){
      return Object.keys(this.levels).filter(function(levelId){
        return levelId.indexOf(campaign + '-') === 0;
      });
    }

  };

  return registry;
});
