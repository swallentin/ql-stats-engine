// subber.js
var zmq = require('zmq'),
    sockets = [],
    config = require('config'),
    servers = config.get('servers'),
    MongoClient = require('mongodb').MongoClient,
    redis = require("redis"),
    client = redis.createClient();


url = 'mongodb://localhost:27017/ql-stats';

function makeConnectionString(host) {
    return ['tcp://', host.hostname, ':', host.port].join('');
}

MongoClient.connect(url, function (err, db) {
    var events = db.collection('events'),
        players = db.collection('players'),
        matches = db.collection('matches'),
        reports = db.collections('reports');


    servers.forEach(function (server)  {
        var socket = zmq.socket('sub'),
        address = makeConnectionString(server);

        socket.connect(address);
        socket.subscribe('');
        sockets.push(socket);

        console.log('Subscriber connected to', address);

        socket.on('message', function(message) {

            if (message) {
                var document = JSON.parse(message.toString());
                document.SERVER = server;
                document.EVENT_TIME = new Date();

                if(document) {
                    if(document.TYPE === 'MATCH_STARTED') {
                        // add document to mongodb matches collection
                        matches.insert(document);
                        client.sadd('current_matches', document.DATA.MATCH_GUID);
                        client.publish("match_started", document.DATA.MATCH_GUID);
                    } else if (document.TYPE === 'MATCH_REPORT') {
                        // update mongodb matches collection with match report
                        matches.update({ "DATA.MATCH_GUID": document.DATA.MATCH_GUID }, document);
                        client.sadd('matches', document.DATA.MATCH_GUID);
                        client.srem('current_matches', document.DATA.MATCH_GUID);
                        client.publish("match_completed", document.DATA.MATCH_GUID);
                    } else if (document.TYPE === 'PLAYER_CONNECT') {
                        // add user to online players
                        client.sadd('online_players', document.DATA.STEAM_ID);
                        // update or create user in mongodb
                        players.update({ "DATA.STEAM_ID": document.DATA.STEAM_ID }, document, { upsert: true });
                        client.sadd('players', document.DATA.STEAM_ID);
                        client.publish("user_connected", document.DATA.STEAM_ID);
                    }
                    else if (document.TYPE === 'PLAYER_DISCONNECT') {
                        client.srem('online_players', document.DATA.STEAM_ID);
                        client.publish("user_disconnected", document.DATA.STEAM_ID);
                    }

                    events.insert(document);
                    console.log(server.name, document.TYPE);

                }

            }
        });
    });
});
