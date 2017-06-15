var monsterManager = function(app) {
  this.app = app;
  this.index = 0;
  this.monsters = [];

  this.initMonster();
};

class Monster {
 	constructor(uid, posX, posY, health) {
      this.mobIndex = uid;
      this.posX = posX;
 		  this.posY = posY;
 		  this.health = health;
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

  var newMonster = new Monster(++this.index, x, y, health);
  //console.debug("Added Monsters x: " + x + ", y: " + y);
  this.monsters.push(newMonster);
  return newMonster;
};

/**
 * remove monster
 */
monsterManager.prototype.killedMonster = function(idKilledMonster) {
    this.monsters.slice(idKilledMonster, 1);
    return this.addNewMonster();
};