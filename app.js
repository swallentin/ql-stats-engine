// subber.js
var zmq = require('zmq'),
    sockets = [],
    config = require('config'),
    settings = config.get('settings'),
    MongoClient = require('mongodb').MongoClient,
    redis = require("redis"),
    client = redis.createClient(),
    url = 'mongodb://localhost:27017/ql-stats',
    Elo = require('arpad'),
    uscf = {
        default: 32,
        2100: 24,
        2400: 16
    },
    elo = new Elo(uscf);

function makeConnectionString(host) {
    return ['tcp://', host.hostname, ':', host.stats_port].join('');
}

MongoClient.connect(url, function (err, db) {
    var events = db.collection('events'),
        players = db.collection('players'),
        matches = db.collection('matches'),
        reports = db.collection('reports'),
        player_stats = db.collection('player_stats');


    settings.servers.forEach(function (server)  {
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
                    } else if(document.TYPE === 'PLAYER_STATS') {
                        player_stats.insert(document);
                    } else if (document.TYPE === 'MATCH_REPORT') {
                        // update mongodb matches collection with match report
                        reports.insert(document);
                        client.sadd('matches', document.DATA.MATCH_GUID);
                        client.srem('current_matches', document.DATA.MATCH_GUID);

                        if(document.DATA.GAME_TYPE === 'DUEL' && !document.DATA.ABORTED) {
                            var winningPlayerStats,
                                losingPlayerStats,
                                winningPlayer,
                                losingPlayer,
                                winningPlayerOldElo,
                                losingPlayerOldElo,
                                winningPlayerNewElo,
                                losingPlayerNewElo;

                            player_stats.find({
                                "DATA.RANK": {
                                    $in: [1,2]
                                },
                                "DATA.MATCH_GUID": document.DATA.MATCH_GUID
                            }).toArray(function (err, results) {
                                if (results.length > 1 && results[0].DATA && results[1].DATA )  {
                                    winningPlayerStats = results[0].DATA.RANK === 1 ? results[0] : results[1];
                                    losingPlayerStats = results[0].DATA.RANK === 2 ? results[0] : results[1];

                                    players.find({
                                        "DATA.STEAM_ID": {
                                            $in: [
                                                winningPlayerStats.DATA.STEAM_ID,
                                                losingPlayerStats.DATA.STEAM_ID
                                            ]
                                        }
                                    }).toArray(function(err, results) {
                                        winningPlayer = results[0].DATA.STEAM_ID === winningPlayerStats.DATA.STEAM_ID ? results[0] : results[1];
                                        losingPlayer = results[0].DATA.STEAM_ID === losingPlayerStats.DATA.STEAM_ID ? results[0] : results[1];


                                        winningPlayerOldElo = (winningPlayer.ELO && winningPlayer.ELO.DUEL) ?  winningPlayer.ELO.DUEL : 1200;
                                        losingPlayerOldElo = (losingPlayer.ELO && losingPlayer.ELO.DUEL) ?  losingPlayer.ELO.DUEL : 1200;

                                        winningPlayerNewElo = elo.newRatingIfWon(winningPlayerOldElo, losingPlayerOldElo);
                                        losingPlayerNewElo = elo.newRatingIfLost(losingPlayerOldElo, winningPlayerOldElo);

                                        var winningPlayerQuery = {
                                                "DATA.STEAM_ID": winningPlayerStats.DATA.STEAM_ID
                                            },
                                            losingPlayerQuery = {
                                                "DATA.STEAM_ID": losingPlayerStats.DATA.STEAM_ID
                                            },
                                            winningPlayerUpdate = {
                                                $set: {
                                                    ELO: {
                                                        DUEL: winningPlayerNewElo
                                                    }
                                                }
                                            },
                                            losingPlayerUpdate = {
                                                $set: {
                                                    ELO: {
                                                        DUEL: losingPlayerNewElo
                                                    }
                                                }
                                            };
                                        players.update(winningPlayerQuery, winningPlayerUpdate);
                                        players.update(losingPlayerQuery, losingPlayerUpdate);
                                        console.log("win:", winningPlayerStats.DATA.STEAM_ID, 'old elo:', winningPlayerOldElo, 'new elo:', winningPlayerNewElo);
                                        console.log("loss:", losingPlayerStats.DATA.STEAM_ID, 'old elo:', losingPlayerOldElo, 'new elo:', losingPlayerNewElo);
                                    });
                                }

                            });
                        }

                        client.publish("match_completed", document.DATA.MATCH_GUID);
                    } else if (document.TYPE === 'PLAYER_CONNECT') {
                        // add user to online players
                        client.sadd('online_players', document.DATA.STEAM_ID);
                        // update or create user in mongodb
                        var query = {
                                "DATA.STEAM_ID": document.DATA.STEAM_ID
                        },
                        update = {
                            $set: document,
                                $setOnInsert: {
                                    ELO: {
                                        DUEL: 1200
                                    }
                                }
                            },
                        options = {
                            upsert: true
                        };

                        players.update(query, update, options);
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
