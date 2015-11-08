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
    elo = new Elo(uscf),
    log4js = require('log4js');

logger = log4js.getLogger('app');
logger.setLevel(log4js.levels.DEBUG);

function makeConnectionString (host) {
    return ['tcp://', host.hostname, ':', host.stats_port].join('');
}

function handleMonitorEvent (server, ev, fd, ep) {
    server.mon.ev = ev;
    if (ev == 'connect') {
        server.mon.status = 'connected';
        logger.info('connected:', server.name, fd, ep);
    }
    else if (ev != 'connect' && server.mon.status == 'connected') {
        server.mon.status = 'fail';
        logger.info('disconnected:', server.name, fd, ep);
    }
    else {
        server.mon.status = 'fail';
    }
}

MongoClient.connect(url, function (err, db) {
    var events = db.collection('events'),
        players = db.collection('players'),
        matches = db.collection('matches'),
        reports = db.collection('reports'),
        player_stats = db.collection('player_stats');


    settings.servers.forEach(function (server) {
        server.mon = {status: null, ev: null};
        var socket = zmq.socket('sub'),
            address = makeConnectionString(server);

        socket.on('connect', function (fd, ep) {
            handleMonitorEvent(server, 'connect', fd, ep);
        });
        socket.on('connect_delay', function (fd, ep) {
            handleMonitorEvent(server, 'connect_delay', fd, ep);
        });
        socket.on('connect_retry', function (fd, ep) {
            handleMonitorEvent(server, 'connect_retry', fd, ep);
        });
        socket.on('listen', function (fd, ep) {
            handleMonitorEvent(server, 'listen', fd, ep);
        });
        socket.on('bind_error', function (fd, ep) {
            handleMonitorEvent(server, 'bind_error', fd, ep);
        });
        socket.on('accept', function (fd, ep) {
            handleMonitorEvent(server, 'accept', fd, ep);
        });
        socket.on('accept_error', function (fd, ep) {
            handleMonitorEvent(server, 'accept_error', fd, ep);
        });
        socket.on('close', function (fd, ep) {
            handleMonitorEvent(server, 'close', fd, ep);
        });
        socket.on('close_error', function (fd, ep) {
            handleMonitorEvent(server, 'close_error', fd, ep);
        });
        socket.on('disconnect', function (fd, ep) {
            handleMonitorEvent(server, 'disconnect', fd, ep);
        });

        // Handle monitor error
        socket.on('monitor_error', function (err) {
            logger.error('Error in monitoring: %s, will restart monitoring in 5 seconds', err);
            setTimeout(function () {
                socket.monitor(500, 0);
            }, 5000);
        });

        // Call monitor, check for events every 500ms and get all available events.
        logger.info('monitoring ' + server.name);
        socket.monitor(500, 0);

        /*
         setTimeout(function() {
         logger.info('Stop monitoring...');
         socket.unmonitor();
         }, 20000);
         */

        if (server.stats_password != "") {
            socket.plain_username = 'stats';
            socket.plain_password = server.stats_password;
        }

        socket.connect(address);
        socket.subscribe('');
        sockets.push(socket);

        logger.info('Subscriber connected to', address);

        socket.on('message', function (message) {

            if (message) {
                var document = JSON.parse(message.toString());
                document.SERVER = server;
                document.EVENT_TIME = new Date();

                if (document) {
                    if (document.TYPE === 'MATCH_STARTED') {
                        // add document to mongodb matches collection
                        matches.insert(document);
                        client.sadd('current_matches', document.DATA.MATCH_GUID);
                        client.publish("match_started", document.DATA.MATCH_GUID);
                    } else if (document.TYPE === 'PLAYER_STATS') {
                        player_stats.insert(document);
                    } else if (document.TYPE === 'MATCH_REPORT') {
                        // update mongodb matches collection with match report
                        reports.insert(document);
                        client.sadd('matches', document.DATA.MATCH_GUID);
                        client.srem('current_matches', document.DATA.MATCH_GUID);

                        if (document.DATA.GAME_TYPE === 'DUEL' && !document.DATA.ABORTED) {
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
                                    $in: [1, 2, -1]
                                },
                                "DATA.MATCH_GUID": document.DATA.MATCH_GUID
                            }).toArray(function (err, results) {
                                if (results.length > 1 && results[0].DATA && results[1].DATA) {
                                    winningPlayerStats = results[0].DATA.RANK === 1 ? results[0] : results[1];
                                    losingPlayerStats = results[0].DATA.RANK in [2, -1] ? results[0] : results[1];

                                    players.find({
                                        "DATA.STEAM_ID": {
                                            $in: [
                                                winningPlayerStats.DATA.STEAM_ID,
                                                losingPlayerStats.DATA.STEAM_ID
                                            ]
                                        }
                                    }).toArray(function (err, results) {
                                        try {
                                            winningPlayer = results[0].DATA.STEAM_ID === winningPlayerStats.DATA.STEAM_ID ? results[0] : results[1];
                                            losingPlayer = results[0].DATA.STEAM_ID === losingPlayerStats.DATA.STEAM_ID ? results[0] : results[1];

                                            winningPlayerOldElo = (winningPlayer.ELO && winningPlayer.ELO.DUEL) ? winningPlayer.ELO.DUEL : 1200;
                                            losingPlayerOldElo = (losingPlayer.ELO && losingPlayer.ELO.DUEL) ? losingPlayer.ELO.DUEL : 1200;

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
                                            logger.debug("win:", winningPlayerStats.DATA.STEAM_ID, 'old elo:', winningPlayerOldElo, 'new elo:', winningPlayerNewElo);
                                            logger.debug("loss:", losingPlayerStats.DATA.STEAM_ID, 'old elo:', losingPlayerOldElo, 'new elo:', losingPlayerNewElo);
                                        } catch (err) {
                                            logger.error(err);
                                        }
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

                    if (document.TYPE === 'PLAYER_KILL') {
                        // Do nothing, we still get PLAYER_DEATH
                    }
                    else {
                        events.insert(document);
                        logger.debug(document.DATA.MATCH_GUID, document.TYPE, server.name);
                    }

                }

            }
        });
    });
});
