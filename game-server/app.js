var pomelo = require('pomelo');
var routeUtil = require('./app/util/routeUtil');
var roomService = require('./app/services/roomService');

/**
 * Init app for client.
 */
var app = pomelo.createApp();
app.set('name', 'HelloWorld');

// app configuration
app.configure('production|development', 'connector', function(){
  //app.route('room', routeUtil.chat);
  app.set('connectorConfig',
    {
      connector : pomelo.connectors.sioconnector,
      // 'websocket', 'polling-xhr', 'polling-jsonp', 'polling'
      transports : ['websocket', 'polling'],
      heartbeats : true,
      closeTimeout : 60 * 1000,
      heartbeatTimeout : 60 * 1000,
      heartbeatInterval : 25 * 1000
    });
  // filter configures
  app.filter(pomelo.timeout());
});

// Configure for chat server
app.configure('production|development', 'room', function() {
	app.set('roomService', new roomService(app));
});

// start app
app.start();

process.on('uncaughtException', function (err) {
  console.error(' Caught exception: ' + err.stack);
});
