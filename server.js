const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app)
const { Server } = require('socket.io')
const io = new Server(server);

app.use('/frontend', express.static(`${__dirname}` + '/frontend'));

app.get('/', (req, res) => {
    res.sendFile(`${__dirname}` + '\\frontend\\index.html');
});

io.on('connection', (socket) => {
    console.log('Ein Nutzer hat den Chat betreten!');
    socket.on('disconnect', () => {
        console.log('Ein User hat den Raum verlassen!');
    });
});

server.listen(8080, () => {
    console.log('\nServer läuft auf Port *8080*');
});
