var zmq = require('zmq'),
    socket = zmq.stats_socket('rep');

function logToConsole (message) {
    console.log("[" + new Date().toLocaleTimeString() + "] " + message);
}

socket.on('message', function (message) {
    logToConsole("Received message: " + message.toString("utf8"));
    socket.send(message);
});

socket.connect('tcp://127.0.0.1:9998');