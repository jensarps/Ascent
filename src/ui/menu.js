define([
  'src/comm',
  'src/level-registry',
  'src/config'
], function(
  comm,
  levelRegistry,
  config
  ){
  var menu = {

    parentNode: null,

    currentMenu: null,

    currentItem: null,

    history: null,

    map: {
      front: {
        items: [
          { text: 'Start Campaign', message: 'menu/show', data: 'campaigns' },
          { text: 'Options', message: 'menu/show', data: 'options' }
        ]
      },
      pause: {
        items: [
          { text: 'Continue', message: 'app/continue' },
          { text: 'Quit Mission', message: 'level/quit' },
          { text: 'Options', message: 'menu/show', data: 'options' }
        ]
      },
      options: {
        items:  [
          { text: 'Toggle Fullscreen', message: 'ui/fullscreen' },
          { text: 'Invert Y-Axis: on', message: 'config/set', data: 'controls.invertYAxis', state: 'on'},
          { text: 'Back', message: 'menu/back' }
        ]
      },
      loading: {
        items: [
          { text: 'Loading...', message: 'null' }
        ]
      }
    },

    init: function(parentNode){
      this.parentNode = parentNode;
      this.history = [];
      this.setupCampaignPage();
      this.show('front');

      comm.subscribe('menu/options', function(){ this.show('options') }.bind(this));
      comm.subscribe('menu/show', this.show.bind(this));
      comm.subscribe('menu/back', this.showLast.bind(this));

      this.parentNode.addEventListener('click', function(evt){
        if(evt.target.classList.contains('menu-item')){
          var dataset = evt.target.dataset;
          if (dataset.state) {
            this.toggleState(evt.target);
          } else {
            comm.publish(dataset.topic, dataset.data);
          }
        }
      }.bind(this));
    },

    setupCampaignPage:function () {
      this.addPage('campaigns');

      for (var campaign in levelRegistry.campaigns) {
        var campaignData = levelRegistry.campaigns[campaign];
        var campaignId = 'campaign-' + campaign;

        console.log('adding', campaignId);

        this.map.campaigns.items.push({
          text:campaignData.name,
          message:'menu/show',
          data:campaignId
        });

        var item = this.map[campaignId] = {
          node:null,
          items:[]
        };

        levelRegistry.getLevelIdsForCampaign(campaign).forEach(function (level) {

          var levelData = levelRegistry.levels[level];

          item.items.push({
            text:levelData.name,
            message:'app/load',
            data: level
          });

        }, this);

        item.items.push({
          text:'Back',
          message:'menu/back'
        });
      }

      this.map.campaigns.items.push({
        text:'Back',
        message:'menu/back'
      });
    },

    addPage: function(name, items){
      this.map[name] = {
        items: items || []
      };
    },

    addItems: function(pageName, items){
      if(!this.map[pageName]){
        return this.addPage(pageName, items);
      }
      this.map[pageName].push.apply(this.map[pageName], items);
    },

    addItem: function(pageName, item){
      if(!this.map[pageName]){
        return this.addPage(pageName, [item]);
      }
      this.map[pageName].push(item);
    },

    show: function(name){
      this.history.push(name);
      if(this.currentMenu){
        this.currentMenu.node.className = 'hidden';
      }
      this.currentMenu = this.map[name];
      if(!this.currentMenu.node){
        this.currentMenu.node = this.createMenuNode(this.map[name].items);
      }
      this.currentMenu.node.className = 'visible';
    },

    createMenuNode: function(items){
      var node = document.createElement('div');
      items.forEach(function(item){
        var itemNode = document.createElement('div');
        itemNode.dataset.topic = item.message;
        itemNode.dataset.data = item.data;
        itemNode.className = 'menu-item';
        itemNode.innerHTML = item.text;
        if(item.state){
          // need to fetch state from config
          var state = config.getItem(item.data);
          this.setState(itemNode, state ? 'on' : 'off');
        }
        node.appendChild(itemNode);
      }, this);
      this.parentNode.appendChild(node);
      return node;
    },

    showLast: function(){
      this.history.pop();
      var last = this.history.pop();
      this.show(last);
    },

    toggleState: function(node){
      var map = ['on', 'off'];
      var state = node.dataset.state;
      var newState = map[(state == 'on') * 1];

      this.setState(node, newState);

      comm.publish(node.dataset.topic, [node.dataset.data, newState]);
    },

    setState: function(node, newState){
      var text = node.innerHTML.split(':')[0];
      node.innerHTML = text + ': ' + newState;
      node.dataset.state = newState;
    }
  };

  return menu;
});
