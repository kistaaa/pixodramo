var app = require('express')();
var serveStatic = require('serve-static');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');
var clients = {};

app.set('port', (process.env.PORT || 5000));

app.use(serveStatic('public'));

//app.get('/', function(req, res){
//	res.send('root');
//  res.sendFile(__dirname + '/canvas.html');
//});

io.on('connection', function(client){

    client.on("join", function(name){
        clients[client.id] = name;
        io.emit("users", clients);
    });

    client.on('disconnect', function(){
    delete clients[client.id];
    io.emit("users", clients);
  });

    client.on('msg', function(msg){
    io.emit('msg', clients[client.id] + ' : ' + msg);
  });

    client.on('img', function(buf){
    fs.writeFile('public/lol.png', buf);
  });

    client.on('ppts', function(arr){
    io.emit('ppts', arr);
  });

});

http.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});