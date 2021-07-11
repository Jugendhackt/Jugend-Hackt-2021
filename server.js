const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app)
const { Server } = require("socket.io");
const io = new Server(server);
const fs = require("fs");

app.use('/views', express.static(`${__dirname}` + '/views'));
app.use('/public', express.static(`${__dirname}` + '/public'))

app.get('/', (req, res) => {
    res.sendFile(`${__dirname}` + '/views/index.html');
});

app.get("/dashboard", (req, res) => {
    res.sendFile(`${__dirname}` + '/views/dashboard.html')
})

app.get('/chat', (req, res) => {
    res.sendFile(`${__dirname}` + '/views/chat.html');
});

app.get("/create_dm", (req, res) => {
    res.sendFile(`${__dirname}` + '/views/create_dm.html');
})

app.get("/create_group", (req, res) => {
    res.sendFile(`${__dirname}` + '/views/create_group.html');
})

app.get("/create", (req, res) => {
    res.sendFile(`${__dirname}` + '/views/create.html')
})

app.get("/register", (req, res) => {
    res.sendFile(`${__dirname}` + '/views/registry.html')
})

app.get("/login", (req, res) => {
    res.sendFile(`${__dirname}` + '/views/login.html')
})

app.get('/bot', (req, res) => {
    var exec = require('child_process').execSync;
    var process = exec('python ./Python_AI_ChatBot/chatbot.py Hi');

    res.send(process.toString());
});

io.on('connection', (socket) => {
    console.log('Ein Nutzer ist Connected');
    socket.on('chat message', (msg, chatid) => {
        if (!(msg.indexOf("/") == -1)){
            var exec = require('child_process').execSync;
            var process = exec('python ./Python_AI_ChatBot/chatbot.py ' + msg);
            res = process;
            console.log(res);
            res.toString();
            var len = 'python3 ./Python_AI_ChatBot/chatbot.py '.length + msg.toString().length;
            res = res.toString().substring(len-5);
            console.log(len + "  " + res);
            io.emit('chat message', "Tom: " + res, chatid);
            console.log('Ein Nutzer hat die Nachricht: ' + res + " geschrieben");
        }else {
            io.emit('chat message', msg, chatid);
            let chatdb = JSON.parse(fs.readFileSync("chats.json", "utf-8"));
            for(let i in chatdb.chats){
                if(chatdb.chats[i].id == chatid){
                    let biggest = 0
                    for(let messagei in chatdb.chats[i].messages){
                        if(chatdb.chats[i].messages[messagei].id > biggest){
                            let biggest = messagei
                        }
                    }
                    chatdb.chats[i].messages.push({content: msg,id:biggest})
                }
            }
            fs.writeFileSync("chats.json", JSON.stringify(chatdb))
        };
    });
    socket.on("registry", (username, password) => {
        let userdb = JSON.parse(fs.readFileSync("users.json", "utf-8"));
        let isdone = false
        for(let i in userdb.users){
            if(userdb.users[i].username == username){
                let isdone = true
                socket.emit("trueregistry", false)
            }
        }
        if(isdone == false){
            userdb.users.push({username: username, password: password})
            fs.writeFileSync("users.json", JSON.stringify(userdb))
            socket.emit("trueregistry", true)
        }
    })
    socket.on("login", (username, password) => {
        let userdb = JSON.parse(fs.readFileSync("users.json", "utf-8"));
        let isdone = false
        for(let i in userdb.users){
            if(userdb.users[i].username == username && userdb.users[i].password == password){
                let isdone = true
                socket.emit("truelogin", true)
            }
        }
        if(isdone == false){
            socket.emit("truelogin", false)
        }
    })
    socket.on("creategroup", (template) => {
        let chatdb = JSON.parse(fs.readFileSync("chats.json", "utf-8"));
        let randomid = Math.floor(Math.random() * 9999999)
        chatdb.chats.push({members: template.members, messages: [], id: randomid})
        fs.writeFileSync("chats.json", JSON.stringify(chatdb))
    })
    socket.on("getchats", () => {
        socket.emit("getchats", JSON.parse(fs.readFileSync("chats.json", "utf-8")))
    })
});

io.on('disconnect', (socket) => {
    console.log('Ein Nutzer ist Disconnected');
});

server.listen(8080, () => {
    console.log('\nServer läuft auf Port *8080*');
});