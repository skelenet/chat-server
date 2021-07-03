const { io } = require('./src/server')

const registerChatroomHandlers = require('./src/chat')

const onConnection = socket =>
{
    registerChatroomHandlers(io, socket)
}

io.on('connect', onConnection)