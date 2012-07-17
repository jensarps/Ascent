define([],
function(){

  var _levelId = 0;
  var _campaignId = 0;

  var registry = {

    campaigns: {},

    levels: {},

    addCampaign: function(data){
      console.log('adding campaign:', data);
      var campaignId = _campaignId++;
      this.campaigns[campaignId] = data;
      data.levels.forEach(function(level){
        var levelId = _levelId++;
        this.addLevel(campaignId, levelId, level);
      }, this);
    },

    addLevel: function(campaignId, levelId, data){
      this.levels[campaignId + '-' + levelId] = data;
    },

    getCampaign: function(name){
      return this.data[name];
    },

    getLevel: function(campaign, name){
      return this.data[campaign + '-' + name];
    },

    getLevelIdsForCampaign: function(campaignId){
      return Object.keys(this.levels).filter(function(levelId){
        return levelId.indexOf(campaignId + '-') === 0;
      });
    }

  };

  return registry;
});
