var Server = require('./Server'),
    ServerManager,
    redis = require('redis');

ServerManager = function () {
    var self = this;
    this.servers = {};
    this.redisClient = redis.createClient();
    this.subscriber = redis.createClient();
    this.handlers = [];

    this.redisClient.smembers('active_servers', function (err, serverKeys) {

        if (err) {
            return err;
        }

        serverKeys.forEach(function (serverKey) {
            try {
                self.redisClient.hgetall(serverKey, function (err, serverSettings) {
                    if(err) {
                        console.log(err);
                    }

                    self.add(Server.create(serverSettings));
                });

            }
            catch(e) {
                console.error(e);
            }
        });

    });


    this.subscriber.on('message', function (topic, serverInformation) {

        if(topic === 'ql-stats-engine:server:add') {
            self.add(Server.create(JSON.parse(serverInformation)));
        }

        if(topic === 'ql-stats-engine:server:remove') {
            console.log('ql-stats-engine:server:remove', serverInformation);
            self.remove(JSON.parse(serverInformation));
        }
    });

    this.subscriber.subscribe('ql-stats-engine:server:add');
    this.subscriber.subscribe('ql-stats-engine:server:remove');
};


ServerManager.prototype.add = function (server) {

    if(this.servers[server.name]) {
        console.log('Already added server', server.name);
        return;
    }

    var self = this;
    server.connect();
    server.on("message", function (message)  {
        message = JSON.parse(message.toString());
        message.SERVER = server.getInformation();
        self.emit(message);
    });

    this.servers[server.name] = server;

    this.redisClient.sadd('active_servers', server.redisKey);
    this.redisClient.hmset('server:'+ server.redisKey, server);
};

ServerManager.prototype.remove = function (name) {
    if (this.servers[name]) {
        this.servers[name].disconnect();
        delete this.servers[name];
    }

    this.redisClient.srem('active_servers', server.redisKey);
    this.redisClient.hdel('server:'+ serverId);
};

ServerManager.prototype.on = function(fn) {
    this.handlers.push(fn)
};

ServerManager.prototype.emit = function(data) {
    this.handlers.forEach(function (handler) {
      handler(data);
    });
};

exports.create = function() {
    return new ServerManager();
};

