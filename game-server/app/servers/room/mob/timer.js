var logger = require('pomelo-logger').getLogger(__filename);

var Timer = function(opts){
  this.monsterManager = opts.monsterManager;
  this.interval = opts.interval||100;
};

module.exports = Timer;

Timer.prototype.run = function () {
  this.interval = setInterval(this.tick.bind(this), this.interval);
};

Timer.prototype.close = function () {
  clearInterval(this.interval);
};

Timer.prototype.tick = function() {

  this.monsterManager.chase();

  // //Update mob zones
  // for(var key in area.zones){
  //   area.zones[key].update();
  // }

  // //Update all the items
  // for(var id in area.items) {
  //   var item = area.entities[id];
  //   item.update();

  //   if(item.died) {
  //     area.channel.pushMessage('onRemoveEntities', {entities: [id]});
  //     area.removeEntity(id);
  //   }
  // }

  // //run all the action
  // area.actionManager.update();

  // area.aiManager.update();

  // area.patrolManager.update();
};