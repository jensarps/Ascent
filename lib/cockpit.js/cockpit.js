
;(function(global){

  var Cockpit = function(url){
    this.imageUrl = url;

    this.setup();
  };

  Cockpit.prototype = {

    imageUrl: null,

    cockpitNode: null,

    wrapperNode: null,

    textNodes: null,

    currentVertical: 0,

    currentHorizontal: 0,

    state: 'normal',

    setup: function() {
      this.textNodes = {};
      this.setupNodes();
      this.textProperty = typeof this.wrapperNode.innerText !== 'undefined' ? 'innerText' : 'textContent';
      this.translateProperty = 'webkitTransform' in this.wrapperNode.style ? 'webkitTransform' : 'mozTransform'
    },

    setupNodes: function() {
      var wrapperNode = this.wrapperNode = document.createElement('div');
      var wrapperNodeStyle = wrapperNode.style;
      wrapperNodeStyle.width = '100%';
      wrapperNodeStyle.height = '100%';
      wrapperNodeStyle.position = 'absolute';
      wrapperNodeStyle.left = '0';
      wrapperNodeStyle.top = '0';
      wrapperNodeStyle.overflow = 'hidden';
      wrapperNodeStyle.zIndex = '100000';
      wrapperNodeStyle.pointerEvents = 'none';
      document.body.appendChild(wrapperNode);

      var cockpitNode = this.cockpitNode = document.createElement('div');
      var cockpitNodeStyle = cockpitNode.style;
      cockpitNodeStyle.background = 'url(' + this.imageUrl + ') center';
      cockpitNodeStyle.backgroundSize = 'cover';
      cockpitNodeStyle.width = '130%';
      cockpitNodeStyle.height = '130%';
      cockpitNodeStyle.position = 'absolute';
      cockpitNodeStyle.left = '-15%';
      cockpitNodeStyle.top = '-15%';
      wrapperNode.appendChild(cockpitNode);
    },

    /**
     * Moves the cockpit around.
     *
     * Pass two values, one for vertical movement and one for horizontal
     * movement. Range for these values is from -1 (max negative movement) to
     * 1 (max positive movement). 0 means no movement.
     *
     * @param {number} x The horizontal movement
     * @param {number} y The vertical movement
     */
    move: function(x, y){
      if(this.currentHorizontal == x && this.currentVertical == y){
        return;
      }
      var cockpitNodeStyle = this.cockpitNode.style;
      var left = ( x * 7.5).toFixed(3) + '%';
      var top = ( y * 7.5).toFixed(3) + '%';
      cockpitNodeStyle[this.translateProperty] = 'translate3d(' + left + ',' + top + ',0)';

      this.currentHorizontal = x;
      this.currentVertical = y;
    },

    /**
     * Creates a random position around current position
     *
     * @param {number} current The current position value
     * @param {number} intensity Thr random intensity, from 0 to 1, where 0
     *    equals no randomization and 1 equals full randomization
     */
    getRandomPosition: function(current, intensity){
      return Math.max(Math.min((( Math.random() - 0.5 ) * intensity * 0.5) + current, 1.5), -1.5);
    },

    /**
     * Shakes the cockpit.
     *
     * You can pass an optional intensity value from 0 to 1 (defaults to 0.5)
     * and and optional duration value (defaults to 300).
     *
     * @param {number} [intensity] The shake intensity from 0 to 1
     * @param {number} [duration] The shake duration in ms
     */
    shake: function(intensity, duration){
      if(this.state === 'shake'){
        return;
      }
      intensity = intensity || 0.5;
      duration = duration || 300;

      setTimeout(this.endShake.bind(this), duration);
      this.beginShake(intensity);
    },

    /**
     * Starts to shake the cockpit
     *
     * The cockpit will shake until endShake() is called.
     *
     * @param {number} [intensity] The shake intensity from 0 to 1
     */
    beginShake: function(intensity){
      if(this.state === 'shake'){
        return;
      }
      this.state = 'shake';
      intensity = intensity || 0.5;
      var interval;

      interval = setInterval(function(){
        if (this.state !== 'shake') {
          clearInterval(interval);
          return;
        }
        this.move(this.getRandomPosition(this.currentHorizontal, intensity), this.getRandomPosition(this.currentVertical, intensity));
      }.bind(this), 50);
    },

    /**
     * Ends the shaking started with beginShake()
     *
     */
    endShake: function(){
      this.state = 'normal';
    },

    /**
     * Vibrates the cockpit for a set duration
     *
     * You can pass an optional duration value.
     *
     * @param {number} [duration] The vibration duration
     */
    vibrate: function(duration){
      if(this.state === 'vibrate'){
        return;
      }
      duration = duration || 600;

      setTimeout(this.endVibrate.bind(this), duration);
      this.beginVibrate();
    },

    /**
     * Starts to vibrate the cockpit
     *
     * The cockpit will vibrate until endVibrate() is called
     */
    beginVibrate: function(){
      if(this.state === 'vibrate'){
        return;
      }
      this.state = 'vibrate'
      var direction = 1;
      var interval;

      interval = setInterval(function(){
        if (this.state !== 'vibrate') {
          clearInterval(interval);
          return;
        }
        direction *= -1;
        var modificator = 0.01 * direction;
        this.move(this.currentHorizontal + modificator, this.currentVertical + modificator);
      }.bind(this), 30);
    },

    /**
     * Ends the vibration started by beginVibrate()
     *
     */
    endVibrate: function(){
      this.state = 'normal';
    },

    /**
     * Sets the state of the cockpit
     *
     * Will also end previous states if differs from current.
     *
     * This can be used instead of the begin/end methods.
     *
     * @param {string} state The new state to set, can be one of 'vibrate',
     *    'shake' or 'normal'
     */
    setState: function(state){
      if(this.state === state){
        return;
      }
      switch(state){
        case 'vibrate':
          this.beginVibrate();
          break;
        case 'shake':
          this.beginShake();
          break;
        default:
          this.state = 'normal';
          break;
      }
    },

    /**
     * Adds a text item to the cockpit overlay
     *
     * @param {string} id An identifier for this text item
     * @param {sring} initialValue An initial value to be displayed
     */
    addText: function(id, initialValue){
      var node = document.createElement('span');
      node[this.textProperty] = initialValue;
      node.id = id;
      node.className = 'cockpit-text';
      this.cockpitNode.appendChild(node);
      this.textNodes[id] = {
        node: node,
        value: initialValue
      };
    },

    /**
     * Updates a text item
     *
     * @param {string} id The identifier of this text item
     * @param {string} value The value to be displayed
     */
    updateText: function(id, value){
      var textItem = this.textNodes[id];
      if(textItem.value !== value){
        textItem.node[this.textProperty] = value;
      }
    },

    /**
     * Removes all created nodes
     */
    destroy: function(){
      document.body.removeChild(this.wrapperNode);
    }

  };

  global.Cockpit = Cockpit;

})(this);
