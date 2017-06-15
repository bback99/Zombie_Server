var utils = require('../util/utils');
var dispatcher = require('../util/dispatcher');

var roomService = function(app) {
  this.app = app;
  this.uidMap = [];
  this.nameMap = {};
  this.roomMap = {};
};

class Client {
 	constructor(uid, name, x, y, angle) {
      this.uid = uid;
 		  this.user_name = name;
 		  this.posX = x;
 		  this.posY = y;
 		  this.angle = angle;
 	}
 }

module.exports = roomService;

/**
 * Add player into the channel
 *
 * @param {String} uid         user id
 * @param {String} playerName  player's role name
 * @param {float} positionX player's position X
 * @param {float} positionY player's position Y
 * @param {String} channelName channel name
 * @return {Number} see code.js
 */
roomService.prototype.addRoom = function(uid, playerName, X, Y) {

  var sid = getSidByUid(uid, this.app);
  if(!sid) {
    console.error("error: " + sid + ", code: " + Code.ROOM.FA_UNKNOWN_CONNECTOR);
    return -1;
  }

//   if(checkDuplicate(this, uid, sid)) {
//     return Code.OK;
//   }

  var channel = this.app.get('channelService').getChannel('ZombieChannel', true);
  if(!channel) {
    console.error("error: " + sid + ", code: " + Code.ROOM.FA_CHANNEL_CREATE);
    return -2;
  }

  channel.add(uid, sid);

  // send to notify message to others
	var param = {
    route: 'onNotifyLogin',
    user_name: playerName,
    posX: X,
    posY: Y
  };
  channel.pushMessage(param);

  // add new player information
  //var newPlayer = {uid: uid, sid:sid, name:playerName, X:X, Y:Y};
  //this.uidMap[uid] = newPlayer;
  var newPlayer = new Client(uid, playerName, X, Y, 0);
  this.uidMap.push(newPlayer);
  
  //console.error("1 mapsize " + utils.size(this.uidMap));
  console.error("1 mapsize " + this.uidMap.length);
  return this.uidMap;
};

/**
 * User leaves the channel
 *
 * @param  {String} uid         user id
 * @param  {String} sid channel name
 */
roomService.prototype.leave = function(uid, sid) {
  var channel = this.app.get('channelService').getChannel('ZombieChannel', false);

  if(channel) {
    channel.leave(uid, sid);

    var index = 0;
    for(var i=0; i<this.uidMap.length; i++) {
      if (uid == this.uidMap[i].uid) {
        index = i;
        break;
      }
    }
    this.uidMap.splice(index, 1);
    //delete this.uidMap[uid];

    var username = uid.split('*')[0];
    var param = {
      route: 'onUserLeaveFromRoom',
      user: username
    };
    channel.pushMessage(param);
  }
  else {
    console.error("can't find channel: " + sid);
  }
};

roomService.prototype.pushMessage = function(uid, param, cb) {

  var sid = getSidByUid(uid, this.app);
  if(!sid) {
    //console.error("error: " + sid + ", code: " + Code.ROOM.FA_UNKNOWN_CONNECTOR);
    //return -1;
    cb(new Error('channel ' + uid + 'does not exist.'));
    return;
  }
  //console.debug("sid: " +  sid);

  var channel = this.app.get('channelService').getChannel('ZombieChannel', false);
  if(channel) {
    //channel.pushMessage(param);
    channel.pushMessage(param.route, param, cb);
    //cb();
  }
  else {
    cb(new Error("can't find channel: " + sid));
  }
};

/**
 * Push message by the specified channel
 *
 * @param  {String}   sid channel name
 * @param  {Object}   msg         message json object
 * @param  {Function} cb          callback function
 */
roomService.prototype.pushMessageByChannel = function(sid, msg, cb) {
  var channel = this.app.get('channelService').getChannel(sid);
  if(!channel) {
    cb(new Error('channel ' + sid + ' dose not exist'));
    return;
  }

  channel.pushMessage(Event.chat, msg, cb);
};

/**
 * Get the connector server id assosiated with the uid
 */
var getSidByUid = function(uid, app) {
  var connector = dispatcher.dispatch(uid, app.getServersByType('connector'));
  if(connector) {
    return connector.id;
  }
  return null;
};

roomService.prototype.getUsers = function() {
  return this.uidMap.length;
}
