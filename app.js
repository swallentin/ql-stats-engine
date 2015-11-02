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
    var collection = db.collection('events');


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
                        console.log('Added', document.DATA.MATCH_GUID, 'to current_matches');
                        client.hmset('match:' + document.DATA.MATCH_GUID, document.DATA);
                        client.sadd('current_matches', document.DATA.MATCH_GUID);

                        client.sadd('matches', document.DATA.MATCH_GUID);
                    } else if (document.TYPE === 'MATCH_REPORT') {
                        console.log('Removed', document.DATA.MATCH_GUID, 'from current_matches');
                        client.srem('current_matches', document.DATA.MATCH_GUID);
                    } else if (document.type === 'PLAYER_SWITCHTEAM') {
                        client.sadd('online_players', document.DATA.KILLER.STEAM_ID);
                    } else if (document.TYPE === 'PLAYER_CONNECT' || document.TYPE === 'PLAYER_DISCONNECT') {
                        console.log('hmset user:', document.DATA.STEAM_ID);
                        client.hmset('user:' + document.DATA.STEAM_ID, document.DATA);

                        if (document.TYPE === 'PLAYER_CONNECT') {
                            client.publish("user_connected", document.DATA.STEAM_ID);
                            client.sadd('online_players', document.DATA.STEAM_ID);
                            client.sadd('players', document.DATA.STEAM_ID);
                        }
                        else if (document.TYPE === 'PLAYER_DISCONNECT') {
                            client.srem('online_players', document.DATA.STEAM_ID);
                            client.publish("user_disconnected", document.DATA.STEAM_ID);
                        }

                    }




                    collection.insert(document, function () {
                        console.log(server.name, document.TYPE);
                    });

                }

            }
        });
    });
});
