// var channelRemote = require('../remote/channelRemote');

// module.exports = function(app) {
// 	return new Handler(app);
// };

// var Handler = function(app) {
// 	this.app = app;
// };

// var handler = Handler.prototype;

// /**
//  * Send messages to users
//  *
//  * @param {Object} msg message from client
//  * @param {Object} session
//  * @param  {Function} next next stemp callback
//  *
//  */
// handler.notifyPlayerLocation = function(msg, session, next) {
// 	// var rid = session.get('rid');
// 	// var username = session.uid.split('*')[0];
// 	// var channelService = this.app.get('channelService');
// 	// var param = {
// 	// 	route: 'onNotifyPlayerLocation',
// 	// 	msg: msg.content,
// 	// 	from: username,
// 	// 	target: msg.target
// 	// };
//     // var channel = channelService.getChannel(rid, false);
//     // channel.pushMessage(param);
// 	// next(null, {
// 	// 	route: msg.route
// 	// });

// 	var rid = session.get('rid');
// 	var username = session.uid.split('*')[0];
// 	var channelService = this.app.get('channelService');
// 	var param = {
// 		route: 'onNotifyPlayerLocation',
// 		username: username,
// 		X: msg.X,
// 		Y: msg.Y,
// 		angle: msg.angle
// 	};
// 	var channel = channelService.getChannel(rid, false);
// 	channel.pushMessage(param);

// 	// //the target is all users
// 	// if(msg.target == '*') {
// 	// 	channel.pushMessage(param);
// 	// }
// 	// //the target is specific user
// 	// else {
// 	// 	var tuid = msg.target + '*' + rid;
// 	// 	var tsid = channel.getMember(tuid)['sid'];
// 	// 	channelService.pushMessageByUids(param, [{
// 	// 		uid: tuid,
// 	// 		sid: tsid
// 	// 	}]);
// 	// }
// 	next(null, {
// 		route: msg.route
// 	});
// };