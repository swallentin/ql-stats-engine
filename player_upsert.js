var MongoClient = require('mongodb').MongoClient,
    url = 'mongodb://localhost:27017/ql-stats';

MongoClient.connect(url, function (err, db) {
    var events = db.collection('events'),
        players = db.collection('players'),
        matches = db.collection('matches'),
        reports = db.collection('reports'),
        player_stats = db.collection('player_stats'),
        document = {
            "DATA" : {
                "MATCH_GUID" : "1f6a1df7-0ae5-41b4-8614-c534befc4835",
                "NAME" : "UnnamedPlayer",
                "STEAM_ID" : "elo_test",
                "TIME" : 546,
                "WARMUP" : false
            },
            "TYPE" : "PLAYER_CONNECT",
            "SERVER" : {
                "name" : "ql-sth-01 #8",
                "hostname" : "5.150.254.201",
                "port" : 27967,
                "password" : ""
            },
            "EVENT_TIME" : "2015-11-03T21:37:47.929Z"
        },
        query = {
            "DATA.STEAM_ID": "elo_test"
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

    players.update(query, update, options, function (err, result) {
        if(!err)
            console.log('ok');
        process.exit(0);
    });

});
