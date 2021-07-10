const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app)
const { Server } = require("socket.io");
const io = new Server(server);

app.use('/views', express.static(`${__dirname}` + '/views'));

app.get('/', (req, res) => {
    res.sendFile(`${__dirname}` + '\\views\\chat.html');
});

io.on('connection', (socket) => {
    console.log('Ein Nutzer ist Connected');
    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    });
});

io.on('disconnect', (socket) => {
    console.log('Ein Nutzer ist Disconnected');
});

server.listen(8080, () => {
    console.log('\nServer läuft auf Port *8080*');
});