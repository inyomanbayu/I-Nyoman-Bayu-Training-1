const EventEmitter = require('events');
const emitter = new EventEmitter();

//Register a listener
emitter.on('messageLoad', function (arguments) {
    console.log('Listener called', arguments);
});

//Raise an event
//emitter.emit('messageLoad');
emitter.emit('messageLoad', {id: 1, url: 'http://heberthendrick.com'});