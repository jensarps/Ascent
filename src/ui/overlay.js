define([
  'src/tools'
], function(
  tools
){
  var overlay = {

    overlay: null,

    overlayChildren: [],

    init: function(){
      this.addOverlay();
    },

    addOverlay: function(){
      this.overlay = tools.create('div', {
        id: 'overlay'
      }, document.body);
    },

    addOverlayChild: function(name){
      var child = tools.create('div', {
        id: name,
        className: 'overlay-child'
      }, this.overlay);
      this.overlayChildren.push(child);
      return child;
    },

    show: function(childId){
      document.documentElement.classList.add('overlay');
      this.overlayChildren.forEach(function(child){
        child.classList[child.id == childId ? 'add' : 'remove']('visible');
      }, this);
    },

    hide: function(){
      document.documentElement.classList.remove('overlay');
      this.overlayChildren.forEach(function(child){
        child.classList.remove('visible');
      }, this);
    }

  };

  return overlay;
});
