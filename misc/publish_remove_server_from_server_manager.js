var redis = require('redis'),
    client = redis.createClient();

client.publish("ql-stats-engine:server:remove", "ql-sth-01 #5");
//client.end();

