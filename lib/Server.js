var zmq = require('zmq'),
    Server = function(settings) {
        this.name = settings.name;
        this.hostname = settings.hostname;
        this.gameport = settings.gameport;

        this.rcon_port = settings.rcon_port;
        this.rcon_password = settings.rcon_password;
        this.rcon_socket = zmq.socket('sub');

        this.stats_port = settings.stats_port;
        this.stats_password = settings.stats_password;
        this.stats_socket = zmq.socket('sub');

        this.redisKey = [this.hostname, this.gameport].join(':');

    };

Server.prototype.makeConnectionString = function (port) {
    return ['tcp://', this.hostname, ':', port].join('');
};

Server.prototype.connect = function () {
    if(this.stats_password && this.stats_password !== "") {
        this.stats_socket.plain_username = 'stats';
        this.stats_socket.plain_password =  this.stats_password;
    }
    this.stats_socket.connect(this.makeConnectionString(this.stats_port));
    this.stats_socket.subscribe('');

    console.log("Connected to", this.makeConnectionString(this.stats_port), this.name);
};
Server.prototype.getInformation = function() {
  return {
      name: this.name,
      hostname: this.hostname,
      gameport: this.gameport
  };
};

Server.prototype.disconnect = function () {
    this.stats_socket.disconnect(this.makeConnectionString(this.stats_port));
    console.log("Disconnected from", this.makeConnectionString(this.stats_port), this.name);

};

Server.prototype.on = function(event, fn) {
    this.stats_socket.on(event, fn)
};

exports.create = function (settings) {
    return new Server(settings);
};
