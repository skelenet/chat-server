const { io } = require('./src/server')

const registerChatroomHandlers = require('./src/chatroomHandler')

const onConnection = socket =>
{
    registerChatroomHandlers(io, socket)
}

io.on('connect', onConnection)