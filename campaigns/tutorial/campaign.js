define([
  'src/level-registry',

  // level files:
  'campaigns/tutorial/follow_me/level',
  'campaigns/tutorial/test/level'
], function(levelRegistry){

  levelRegistry.addCampaign('tutorial', {

    name: 'Tutorial',

    description: 'The school: Earning your wings.'

  });

});
