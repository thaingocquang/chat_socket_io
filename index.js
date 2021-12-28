import express from 'express'
import bodyParser from 'body-parser'

const app = express();
app.use(express.static('public'))
app.set('view engine', 'ejs');
app.use(bodyParser.json());

const server = require('http').createServer(app);
const io = require('socket.io')(server);

const arrUser = []

io.on("connection", (socket) => {
    socket.on('client-send-register', (data) => {
        console.log("Co nguoi vua ket noi: ", socket.id, ' - ', data);
        if (arrUser.indexOf(data) >= 0) {
            socket.emit('server-send-register-fail');
        } else {
            arrUser.push(data);
            socket.Username = data;
            socket.emit('server-send-register-success', data);
            io.sockets.emit('server-send-arrUser', arrUser);
        }
    })

    socket.on('logout', () => {
        arrUser.splice(arrUser.indexOf(socket.Username), 1);
        socket.broadcast.emit('server-send-arrUser', arrUser);
    })

    socket.on('user-send-message', (message) => {
        io.sockets.emit('server-send-message', { username: socket.Username, message: message });
    })

    socket.on('typing', () => {
        let s = socket.Username + ' is typing...'
        // console.log(socket.Username + " dang go chu");
        io.sockets.emit('someone-is-typing', s);
    })

    socket.on('stop-typing', () => {
        io.sockets.emit('someone-stop-typing');
    })

});

app.get('/', (req, res) => {
    res.render('test.ejs');
})

server.listen(3000);

