var utils = require('../util/routeUtil');
var dispatcher = require('../util/dispatcher');

var roomService = function(app) {
  this.app = app;
  this.uidMap = {};
  this.nameMap = {};
  this.roomMap = {};
};

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
roomService.prototype.addRoom = function(uid, sid, playerName, X, Y) {
  if(!sid) {
    return Code.ROOM.FA_UNKNOWN_CONNECTOR;
  }

//   if(checkDuplicate(this, uid, sid)) {
//     return Code.OK;
//   }

  var channel = this.app.get('channelService').getChannel(sid, true);
  if(!channel) {
    return Code.ROOM.FA_CHANNEL_CREATE;
  }

  channel.add(uid, sid);

  // add new player information
  var newPlayer = {uid: uid, sid:sid, name:playerName, X:X, Y:Y};
  this.uidMap[uid] = newPlayer;
  return this.uidMap;
};

/**
 * User leaves the channel
 *
 * @param  {String} uid         user id
 * @param  {String} channelName channel name
 */
roomService.prototype.leave = function(uid, channelName) {
  var channel = this.app.get('channelService').getChannel(channelName, true);

  if(channel) {
    channel.leave(uid, record.sid);
  }

  delete this.uidMap[uid];
};

/**
 * Kick user from chat service.
 * This operation would remove the user from all channels and
 * clear all the records of the user.
 *
 * @param  {String} uid user id
 */
roomService.prototype.kick = function(uid, sid) {
  var channelNames = this.channelMap[uid];

  if(channelNames) {
    // remove user from channels
    var channel;
    for(var name in channelNames) {
      channel = this.app.get('channelService').getChannel(name);
      if(channel) {
        channel.leave(uid, sid);
      }
    }
  }

  delete this.uidMap[uid];
};

/**
 * Push message by the specified channel
 *
 * @param  {String}   channelName channel name
 * @param  {Object}   msg         message json object
 * @param  {Function} cb          callback function
 */
roomService.prototype.pushMessageByChannel = function(channelName, msg, cb) {
  var channel = this.app.get('channelService').getChannel(channelName);
  if(!channel) {
    cb(new Error('channel ' + channelName + ' dose not exist'));
    return;
  }

  channel.pushMessage(Event.chat, msg, cb);
};