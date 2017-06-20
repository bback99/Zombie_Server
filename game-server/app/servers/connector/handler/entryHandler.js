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
			code: 501,
			error: true
		});
		console.error("Uid is duplicated. " + uid);
		return;
	}

	session.bind(uid);
	session.set('rid', rid);
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
	var lstUsers = [];
	var lstMonsters = [];
	self.app.rpc.room.roomRemote.add(session, uid, msg.username, msg.X, msg.Y, function(lstUsers, lstMonsters) {
		//console.error("user length: " + lstUsers.length, ", monster length: " + lstMonsters.length);
		next(null, {
			users: lstUsers,
			monsters: lstMonsters
		})
	});
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
	app.rpc.room.roomRemote.kick(session, session.uid, app.get('serverId'), null);
};