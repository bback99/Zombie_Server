var roomRemote = require('../remote/roomRemote');

module.exports = function(app) {
	return new Handler(app);
};

var Handler = function(app) {
	this.app = app;
	this.roomService = app.get('roomService');
};

var handler = Handler.prototype;

/**
 * Send messages to users
 *
 * @param {Object} msg message from client
 * @param {Object} session
 * @param  {Function} next next stemp callback
 *
 */
handler.notifyPlayerLocation = function(msg, session, next) {

	var username = session.uid.split('*')[0];
	var param = {
		route: 'onNotifyPlayerLocation',
		username: username,
		X: msg.X,
		Y: msg.Y,
		angle: msg.angle,
	};

	this.roomService.pushMessage(session.uid, param, function() {
		next(null, {
		});
	});

	//console.error("sid: " + sid);

	//var channel = channelService.getChannel(sid, true);
	//channel.pushMessage(param);

	// next(null, {
	// 	route: 'onNotifyPlayerLocation',
	// 	msg: param
	// });
};