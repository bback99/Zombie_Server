var exp = module.exports;
var dispatcher = require('./dispatcher');

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