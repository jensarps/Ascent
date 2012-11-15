~~~


      _/_/      _/_/_/    _/_/_/  _/_/_/_/  _/      _/  _/_/_/_/_/
   _/    _/  _/        _/        _/        _/_/    _/      _/
  _/_/_/_/    _/_/    _/        _/_/_/    _/  _/  _/      _/
 _/    _/        _/  _/        _/        _/    _/_/      _/
_/    _/  _/_/_/      _/_/_/  _/_/_/_/  _/      _/      _/


~~~

#About

Ascent is a WebGL experiment.

The setting is a space simulator.


![image](https://lh3.googleusercontent.com/-NB4m0zflyXM/T-nIvBSzU9I/AAAAAAAAAIM/o8eA_3O5Itc/s961/ascent-skybox-2.png)

#Goals

The main goal of Ascent is to create a tool that makes it exceptionally easy
to script levels, without having to know anything about WebGL, 3D stuff or
anything animation related.

The secondary goal is to have a project that is fairly self-explanatory to
encourage forking, modifying and extending it.

#Status

It's a mere skeleton right now, but basic functionality is in place, like
adding new levels, pausing the game, a menu, a settings panel, loading models
and so on.

#Action

To see it in action, just:
* go here: http://jensarps.github.com/Ascent/
* or, fork/clone it and run it locally

#Open Issues

Too many to list here. The first things that I can think of include:
* ~~Use instances for levels instead of the current mixin approach~~
* ~~Level creation needs to be easier~~
* Proper scene cleanup is not working, so you can't start a new level without
reloading the page
* Need to be able to save state
* Levels in campaigns must be able to depend on each other's completion; same
goes for campaigns
* Need proper models; most models don't have textures
* Need sound
* Need to be able to shoot at things
* Need realistic light sources; there's light, but you can't see where it
originates from
* Need more distributed lights. It might be realistic, but an object being
invisible due to no light traveling in the camera's view direction isn't
helpful

#Libraries

Ascent wouldn't work without the following third party libraries:

* three.js - https://github.com/mrdoob/three.js/
* Game Shim - https://github.com/toji/game-shim
* require.js - https://github.com/jrburke/requirejs

#Child Projects

The following projects are results of the work with Ascent and are now available
as independent projects on GitHub:

* decoupled-input - https://github.com/jensarps/decoupled-input
* cockpit.js - https://github.com/jensarps/cockpit.js
* game-timer - https://github.com/jensarps/game-timer
