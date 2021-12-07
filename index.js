let express = require('express');
let app = express();
app.use('/', express.static('public'));

//Initialize the actual HTTP server
let http = require('http');
let server = http.createServer(app);
let port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log("Server listening at port: " + port);
});

//Initialize socket.io
let io = require('socket.io');
io = new io.Server(server);

let write = io.of('/write');
let draw = io.of('/draw');

write.on('connection', (socket) => {
    console.log('Writing Socket Connected : ' + socket.id);

    socket.on('write-data',(data)=> {
        console.log('Write data received');
        console.log(data);

        //Send write data to both namespaces
        write.emit('write-object', data);
        draw.emit('write-object', data);
    })

    socket.on('clear-signal', (data)=>{
        console.log('Clear signal received');
        console.log(data);

        //Send clear signal to drawing namespace
        draw.emit('clear-object', data);
        write.emit('clear-object', data);
    })

    socket.on('disconnect', function(){
        console.log('Writing client has disconnected: ' + socket.id);
    });
})

draw.on('connection', (socket) => {
    console.log('Drawing Socket Connected : ' + socket.id);

    //Drawing data
    socket.on('draw-data', function(data){
        console.log('Draw data received');
        console.log(data);

        //Send drawing data to both namespaces
        draw.emit('draw-object', data);
        write.emit('draw-object', data);
    });

    //Rose data
    socket.on('rose-data', function(data){
        console.log('Rose data received');
        console.log(data);

        //Send rose data to both namespaces
        draw.emit('rose-object', data);
        write.emit('rose-object', data);
    });

    socket.on('disconnect', function(){
        console.log('Drawing client has disconnected: ' + socket.id);
    });
})