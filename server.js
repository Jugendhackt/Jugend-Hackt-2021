const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app)

app.use('/frontend', express.static(`${__dirname}` + '/frontend'));

app.use(require('express-basic-auth')({
    users: { 'BrandV': 'BrandV' },
    challenge: true
}));

app.get('/', (req, res) => {
    res.sendFile(`${__dirname}` + '\\frontend\\index.html');
});

server.listen(8080, () => {
    console.log('\nServer läuft auf Port *8080*');
});
