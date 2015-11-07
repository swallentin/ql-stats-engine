// subber.js
var zmq = require('zmq'),
    socket = zmq.stats_socket('sub'),
    MongoClient = require('mongodb').MongoClient,
    url = 'mongodb://localhost:27017/ql-stats';

//socket.plain_username = 'stats';
//socket.plain_password = '';
//socket.sap_domain = 'stats';

socket.on('connect', function (fd, ep) {
    console.log('connect, endpoint:', ep);
});

socket.on('accept', function (fd, ep) {
    console.log('accept, endpoint:', ep);
});


MongoClient.connect(url, function (err, db) {

    var collection = db.collection('events');
    socket.connect('tcp://5.150.254.201:27960');

    socket.subscribe('');
    console.log('Subscriber connected to port tcp://5.150.254.201:27960');


    socket.on('message', function(message) {


        if (message) {
            var document = JSON.parse(message.toString());
            if(document) {
                collection.insert(document, function () {
                    console.log(document.TYPE);
                });

            }

        }
        //var text = decoder.write(topic);
        //console.log(text);
        //console.log('Received a message related to:', topic, 'containing message:', message);
    });

});
