module.exports = function(app) {
  return new Handler(app);
};

var Handler = function(app) {
  this.app = app;
};

/**
 * New client entry.
 *
 * @param  {Object}   msg     request message
 * @param  {Object}   session current session object
 * @param  {Function} next    next step callback
 * @return {Void}
 */
Handler.prototype.entry = function(msg, session, next) {
	var self = this;
	var rid = msg.rid;
	var uid = msg.username + '*' + rid;
	var sessionService = self.app.get('sessionService');

	//duplicate log in
	if( !! sessionService.getByUid(uid)) {
		next(null, {
			code: 500,
			error: true
		});
		return;
	}

	session.bind(uid);
	// session.set('rid', rid);
	// session.set('username', msg.username);
	// session.set('X', msg.X);
	// session.set('Y', msg.Y);
	session.push('rid', function(err) {
		if(err) {
			console.error('set rid for session service failed! error is : %j', err.stack);
		}
	});
	session.on('closed', onUserLeave.bind(null, self.app));

	//put user into channel
	console.error("1. name: " + msg.username, ", X: " + msg.X + ", Y: " + msg.Y);
	self.app.rpc.room.roomRemote.add(session, uid, self.app.get('serverId'), msg.username, msg.X, msg.Y, null);

	// self.app.rpc.channel.channelRemote.add(session, uid, self.app.get('serverId'), rid, true, function(users){
	// 	console.error("user length: " + users.length);

	// 	for(var i=0; i<users.length; i++) {
	// 		console.debug("3. name: " + users[i]);
	// 	}
	// 	next(null, {
	// 		users:users
	// 	});
	// });
}

/**
 * User log out handler
 *
 * @param {Object} app current application
 * @param {Object} session current session object
 *
 */
var onUserLeave = function(app, session) {
	if(!session || !session.uid) {
		return;
	}
	self.app.rpc.room.roomRemote.kick(session, session.uid, app.get('serverId'), session.get('rid'), null);
};