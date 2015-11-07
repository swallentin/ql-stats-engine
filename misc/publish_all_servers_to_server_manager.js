// publish all servers in./config/default.json files to redis

var redis = require('redis'),
    client = redis.createClient(),
    config = require('config'),
    settings = config.get('settings');

settings.servers.forEach(function (server) {

    client.publish('ql-stats-engine:server:add', JSON.stringify(server));
    //var serverKey = [server.hostname, server.stats_port].join(':');
    //console.log("Added serverKey:", serverKey);
    //
    //client.hmset(serverKey , server);
    //
    //client.hgetall(serverKey, function(err, object) {
    //    console.log(object);
    //    client.sadd('active_servers', serverKey);
    //    client.publish("active_servers" , serverKey);
    //    //client.del(server.name);
    //});

});




//client.end();

