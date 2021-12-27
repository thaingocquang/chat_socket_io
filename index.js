import express from 'express'
import bodyParser from 'body-parser'

const app = express();
app.use(express.static(__dirname + '/public'));
const path = require('path')
app.use('/static', express.static(path.join(__dirname, 'public')))
app.set('view engine', 'ejs');
app.use(bodyParser.json());
const server = require('http').createServer(app);
const io = require('socket.io')(server);



io.on("connection", (socket) => {
    socket.on("client-send-data", (data) => {
        console.log(data)
        socket.broadcast.emit("server-send-data", data);

    })

});

app.get('/', (req, res) => {
    res.render('test.ejs');
})

server.listen(3000);

