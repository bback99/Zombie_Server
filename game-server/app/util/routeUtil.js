var exp = module.exports;
var dispatcher = require('./dispatcher');

// exp.channel = function(session, msg, app, cb) {
// 	var channelServers = app.getServersByType('channel');

// 	if(!channelServers || channelServers.length === 0) {
// 		cb(new Error('can not find channel servers.'));
// 		return;
// 	}

// 	var res = dispatcher.dispatch(session.get('rid'), channelServers);

// 	cb(null, res.id);
// };

exp.room = function(session, msg, app, cb) {
	var roomServers = app.getServersByType('room');

	if(!roomServers || roomServers.length === 0) {
		cb(new Error('can not find room servers.'));
		return;
	}

	console.error("servers: " + roomServers.length);

	var res = dispatcher.dispatch(session.get('rid'), roomServers);

	cb(null, res.id);
};