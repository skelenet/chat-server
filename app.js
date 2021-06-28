const { io } = require('./src/server')
const Chatroom = require('./src/chatroom')

const chatroom = new Chatroom(io)

io.on('connection', socket =>
{
    chatroom.connect(socket)
})