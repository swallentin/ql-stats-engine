var zmq = require('zmq'),
    socket = zmq.stats_socket('req'),
    counter = 0;


function logToConsole(message) {
    console.log('['+ new Date().toLocaleDateString() + ']' + message);
}

function sendMessage(message) {
    logToConsole("Sending: " + message);
    socket.send(message);
}

socket.on('message', function (message) {
   logToConsole('Response:', message.toString('utf8'));
});

socket.bind('tcp://*:9998', function (error) {
    if(error) {
        logToConsole("Failed to bind to socket: " + error.message);
        process.exit(0);
    }

    logToConsole("Server listening on port 9998");
    setInterval(function (){
        sendMessage(counter++);
    }, 1000 )
});