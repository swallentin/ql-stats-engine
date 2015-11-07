var ServerManager = require('./ServerManager'),
    Server = require('./Server');


var serverManager = ServerManager.create(function (data) {
    console.log(data.TYPE);
});

//
// var server =  Server.create({
//name: "ql-sth-01 #5",
//    hostname: "5.150.254.201",
//    gameport: 27965,
//    rcon_port: 28965,
//    rcon_password: "",
//    stats_password: "",
//    stats_port: 27965
//});

// serverManager.add(server);
//
//setTimeout(function() {
//    serverManager.remove(server.name);
//    process.exit(0);
//}, 5000);