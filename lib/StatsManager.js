var util = require('util'),
    EventEmitter = require('events').EventEmitter,
    ServerManager = require('./ServerManager'),
    MongoClient = require('mongodb').MongoClient,
    Elo = require('arpad'),
    config = require('config'),
    settings = config.get('settings'),
    elo = new Elo(settings.elo.duel),
    StatsManager;

StatsManager = function() {
    EventEmitter.call(this);
    var self = this;
    this.servers = ServerManager.create();

    MongoClient.connect(settings.mongodb.connectionString, function (err, mongo) {
        var events = mongo.collection('events'),
            players = mongo.collection('players'),
            matches = mongo.collection('matches'),
            reports = mongo.collection('reports'),
            player_stats = mongo.collection('player_stats');

        self.servers.on(function (data) {
            delete data.type;
            self.emit(data.TYPE, data);
        });

        self.on('PLAYER_CONNECT', function (data) {
            console.log(data);
        });

    });
};

util.inherits(StatsManager, EventEmitter);

exports.create = function () {
  return new StatsManager();
};

var mgm = new StatsManager();