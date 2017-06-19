var roomRemote = require('../remote/roomRemote');

module.exports = function(app) {
	return new Handler(app);
};

var Handler = function(app) {
	this.app = app;
	this.roomService = app.get('roomService');
	this.monsterManager = app.get('monsterManager');
};

/**
 * Send notifyPlayerLocation messages to users
 *
 * @param {Object} msg message from client
 * @param {Object} session
 * @param  {Function} next next stemp callback
 *
 */
Handler.prototype.notifyPlayerLocation = function(msg, session, next) {

	var username = session.uid.split('*')[0];
	var param = {
		route: 'onNotifyPlayerLocation',
		username: username,
		X: msg.X,
		Y: msg.Y,
		angle: msg.angle,
	};

	// save player location
	this.roomService.savePlayerLocation(username, msg.X, msg.Y);

	this.roomService.pushMessage(session.uid, param, function() {
		next(null, {
		});
	});
};

/**
 * recv player shooting
 *
 * @param {Object} msg message from client
 * @param {Object} session
 * @param  {Function} next next stemp callback
 *
 */
Handler.prototype.notifyPlayerShooting = function(msg, session, next) {
	var username = session.uid.split('*')[0];
	var param = {
		route: 'onNotifyPlayerShooting',
		username: username,
		X: msg.X,
		Y: msg.Y,
		angle: msg.angle,
	};

	this.roomService.pushMessage(session.uid, param, function() {
		next(null, {
		});
	});
};

/**
 * recv killed monsters messages to users
 *
 * @param {Object} msg message from client
 * @param {Object} session
 * @param  {Function} next next stemp callback
 *
 */
Handler.prototype.requestKilledMonster = function(msg, session, next) {

	var newMob = this.monsterManager.killedMonster(msg.idKilledMonster);
	var monsters = [];
	monsters.push(newMob);

	var param = {
		route: 'onNotifyMonsters',
		killedMonster: msg.idKilledMonster,
		monsters: monsters
	};

	this.roomService.pushMessage(session.uid, param, function() {
		next(null, {
			route: 'onNotifyMonsters',
			killedMonster: msg.idKilledMonster,
			monsters: monsters
		});
	});
};