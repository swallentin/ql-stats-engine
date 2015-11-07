// add a server to redis hash and publish server information

var redis = require('redis'),
    client = redis.createClient(),
    server = {
        "name": "ql-sth-01 #1",
        "hostname": "5.150.254.201",
        "gameport": 27960,
        "rcon_port": 28960,
        "rcon_password": "",
        "stats_port": 27960,
        "stats_password": ""
    };

var serverKey = [server.hostname, server.stats_port].join(':');
console.log("Added serverKey:", serverKey);

client.hmset(serverKey , server);

client.hgetall(serverKey, function(err, object) {
    console.log(object);
    client.sadd('active_servers', serverKey);
    client.publish("active_servers" , serverKey);
    //client.del(server.name);
    process.exit(0);
});



//client.end();

