var MongoClient = require('mongodb').MongoClient,
    url = 'mongodb://localhost:27017/ql-stats',
    Elo = require('arpad'),
    uscf = {
      default: 32,
        2100: 24,
        2400: 16
    },
    elo = new Elo(uscf);

MongoClient.connect(url, function (err, db) {
    var events = db.collection('events'),
        players = db.collection('players'),
        matches = db.collection('matches'),
        reports = db.collection('reports'),
        player_stats = db.collection('player_stats');

    var winningPlayerStats,
        losingPlayerStats,
        winningPlayer,
        losingPlayer,
        winningPlayerOldElo,
        loosingPlayerOldElo,
        winningPlayerNewElo,
        losingPlayerNewElo;


    player_stats.find({
        "DATA.RANK": {
            $in: [1,2]
        },
        "DATA.MATCH_GUID": "aadbb560-cecf-40b7-8c4d-d8579691d2e5"
    }).toArray(function (err, results) {
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
                loosingPlayerOldElo = (losingPlayer.ELO && losingPlayer.ELO.DUEL) ?  losingPlayer.ELO.DUEL : 1200;

                winningPlayerNewElo = elo.newRatingIfWon(winningPlayerOldElo, loosingPlayerOldElo);
                losingPlayerNewElo = elo.newRatingIfLost(loosingPlayerOldElo, winningPlayerOldElo);

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

                //players.find({
                //    "DATA.STEAM_ID": {
                //        $in: [
                //            winningPlayerStats.DATA.STEAM_ID,
                //            losingPlayerStats.DATA.STEAM_ID
                //        ]
                //    }
                //}).toArray(function(err, results) {
                //    console.log(winningPlayerNewElo, losingPlayerNewElo);
                //    process.exit(0);
                //});

            });





    });
});
