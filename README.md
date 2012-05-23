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

#Open Issues

Too many to list here. The first things that I can think of include:
* Use instances for levels instead of the current mixin approach
* Level creation needs to be easier
* Proper scene cleanup is not working, so you can't start a new level without
reloading the page
* Need to be able to save state
* Levels in campaigns must be able to depend on each other's completion; same
goes for campaigns
* Need proper models; most models don't have textures
* Need realistic light sources; there's light, but you can't see where it
originates from
* Need more distributed lights. It might be realistic, but an object being
invisible due to no light traveling in the camera's view direction isn't
helpful