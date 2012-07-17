define([
  'src/level-registry',

  // campaign files:
  'campaigns/tutorial/campaign'
], function(
  levelRegistry,

  tutorial
  ){

  levelRegistry.addCampaign(tutorial);

});
