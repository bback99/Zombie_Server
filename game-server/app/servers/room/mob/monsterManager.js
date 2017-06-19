
var Timer = require('./timer');

var monsterManager = function(app) {
  this.app = app;
  this.roomService = app.get('roomService');

  this.index = 0;
  this.monsters = [];

  this.initMonster();

  this.timer = new Timer( {
    monsterManager: this,
    interval: 100
  });

  this.timer.run();
};

class Monster {
 	constructor(uid, posX, posY, health, velocity) {
      this.mobIndex = uid;
      this.posX = posX;
 		  this.posY = posY;
 		  this.health = health;
      this.velocity = velocity
 	}
 }

module.exports = monsterManager;

/**
 * notify monsters to 
 */
monsterManager.prototype.getMonsters = function() {
  return this.monsters;
};

monsterManager.prototype.initMonster = function() {
  this.monsters.length = 0;

  this.addNewMonster();
  this.addNewMonster();
  this.addNewMonster();
  this.addNewMonster();
  this.addNewMonster();
}


/**
 * add new monster
 */
monsterManager.prototype.addNewMonster = function() {
  var x = Math.random() * (118 * 16);
	var y = Math.random() * (55 * 16);
  var health = Math.random() * 10;
  var velocity = (Math.random() * 10) + 3;

  var newMonster = new Monster(++this.index, x, y, health, velocity);
  this.monsters.push(newMonster);
  return newMonster;
};

/**
 * remove monster
 */
monsterManager.prototype.killedMonster = function(idKilledMonster) {
    this.monsters.slice(idKilledMonster, 1);
    console.debug("removed Monsters index: " + idKilledMonster + ", length: " + this.monsters.length);
    return this.addNewMonster();
};

/**
 * chase nearest player
 */
monsterManager.prototype.chase = function() {

    var min = -1;
    var mobIndex = 0;
    var mob = null;
    var player = null;
    for(var i=0; i<this.monsters.length; i++) {
      
      mob = this.monsters[i];
      var userlist = this.roomService.getUserList();

      for(var u=0; u<userlist.length; u++) {

        player = userlist[u];

        // calc distance between zombie and player
        //console.error("mob X:" + mob.posX + ", y: " + mob.posY);
        //console.error("player X:" + player.posX + ", y: " + player.posY);
        var distance = Math.sqrt((mob.posX - player.posX)*2 + (mob.posY - player.posY)*2);
        //console.error("mobIndex: " + mob.mobIndex + ", username: " + player.user_name + ", distance: " + distance);
        if (min < 0) {
          min = distance;
        }
        else if (min > distance) {
          min = distance;
        }
        mobIndex = mob.mobIndex;
      }

      if (mob == null || player == null) {
//        console.error("something is null");
        return;
      }

      //console.error("mobIndex: " + mobIndex + ", distance: " + min);

      // chasing
      var [length, retX, retY] = caculateDirection(mob, player);
      //console.error("ret: " + retX + ", distance: " + retY);
      mob.posX += retX;
      mob.posY += retY;

      if (length > 10.0) {
        console.log("length: " + length);

        var param = {
          route: 'onChasePlayer',
          mobIndex: mobIndex,
          posX: mob.posX,
          posY: mob.posY
        };

        this.roomService.pushMessage(player.uid, param, null);
      }
    }
};

var caculateDirection = function(mob, player) {
    var dx = player.posX-mob.posX;
    var dy = player.posY-mob.posY;

    var length = Math.sqrt(dx*dx+dy*dy);
    var retX = (dx/length)*mob.velocity;
    var retY = (dy/length)*mob.velocity;

    return [length, retX, retY];
}
