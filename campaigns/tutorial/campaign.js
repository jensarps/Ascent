define([
  'campaigns/tutorial/follow_me/level',
  'campaigns/tutorial/test/new_level'
], function (
  FollowMe,
  TestingGrounds
  ) {

  var tutorial = {

    id: 'tutorial',

    name: 'Tutorial',

    description: 'The school: Earning your wings.',

    levels: [
      FollowMe,
      TestingGrounds
    ]

  };

  return tutorial;

});
