define([
  'src/RadarDetector',
  'src/tools',
  'src/registry'
], function(
  RadarDetector,
  tools,
  registry
){

  // FIXME: key events do not belong here!

  var Radar = function(player){
    this.objects = [];
    this.nodes = [];
    this.radarDetector = new RadarDetector(player.camera, this.objects);
    this.cockpit = player.cockpit;
    this.camera = player.camera;

    this.input = registry.get('input');

    this.setup();
  };

  Radar.prototype = {

    cockpit: null,

    focusNext: false,

    focusedObject: null,

    nodes: null,

    objects: null,

    radarDetector: null,

    radarNode: null,

    setup: function(){
      this.radarNode = document.createElement('div');
      this.radarNode.id = 'radar';
      this.cockpit.cockpitNode.appendChild(this.radarNode);

      this.infoNode = document.createElement('div');
      this.infoNode.id = 'radarInfo';
      this.radarNode.appendChild(this.infoNode);
    },

    addObject: function(object){
      var index = this.objects.length;
      object.radarIndex = index;
      this.objects[index] = object;
      this.nodes[index] = this.createObjectNode();
    },

    removeObject: function(id){
      var foundIndex = -1;
      this.objects.some(function(object){
        foundIndex = object.radarIndex;
        return object.id === id;
      });
      if(foundIndex >= 0){
        /* ... */
      }
    },

    focusNextObject: function(){
      var targetIndex = this.focusedObject ? this.focusedObject.radarIndex + 1 : 0;
      if(targetIndex == this.objects.length){
        targetIndex = 0;
      }
      this.focusedObject = this.objects[targetIndex];
    },

    createObjectNode: function(){
      var node = document.createElement('span');
      node.className = 'object';
      node.innerHTML = '&loz;';
      this.radarNode.appendChild(node);
      return node;
    },

    toggleRadar: function(){
      document.documentElement.classList.toggle('radar');
    },

    update: function(){
      if(this.input.toggleRadar){
        this.input.toggleRadar = false;
        this.toggleRadar();
      }

      // TODO: Only do this if radar is actually visible
      this.radarDetector.update();
      if(this.input.focusNext){
        this.focusNextObject();
        this.input.focusNext = false;
      }
      this.objects.forEach(function(object, index){
        // TODO: The following is a disaster regarding performance
        var style = this.nodes[index].style;
        style.left = ( object.radarLeft / 2 + 50 ) - 3 + '%';
        style.top = ( object.radarTop / 2 + 50) - 4  + '%'; // adjust by approx. half char-size
        style.color = object.radarIsInFront ? 'paleGreen' : 'silver';
        if(this.focusedObject){
          this.nodes[index].innerHTML = object.id == this.focusedObject.id ? '&diams;' : '&loz;';
        }
      }, this);

      if(this.focusedObject){
        var dist = ( tools.getDistance(this.camera.position, this.focusedObject.model.position) / 1000 ).toFixed(2);
        this.infoNode.innerHTML = 'type: ' + this.focusedObject.name + ' | dist: ' + dist;
      }
    },

    destroy: function(){
      // TODO: destroy nodes.
    }

  };

  return Radar;

});
