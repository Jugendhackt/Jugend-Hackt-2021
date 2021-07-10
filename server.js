const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app)
const { Server } = require("socket.io");
const io = new Server(server);

app.use('/views', express.static(`${__dirname}` + '/views'));
app.use('/public', express.static(`${__dirname}` + '/public'))

app.get('/', (req, res) => {
    res.sendFile(`${__dirname}` + '\\views\\index.html');
});

app.get('/chat', (req, res) => {
    res.sendFile(`${__dirname}` + '\\views\\chat.html');
});

app.get('/bot', (req, res) => {
    var exec = require('child_process').execSync;
    var process = exec('python ./Python_AI_ChatBot/chatbot.py Hi');

    res.send(process.toString());
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