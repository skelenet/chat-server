const { io } = require('./src/server')

io.on('connection', socket =>
{
    io.emit('join', `Socket ID ${socket.id} joined`)
    console.log(`Socket ID ${socket.id} joined`)

    socket.on('chat message', msg =>
    {
        io.emit('chat message', msg)
        console.log('message: ' + msg)
    })

    socket.on('disconnect', () =>
    {
        io.emit('leave', `Socket ID ${socket.id} left`)
        console.log(`Socket ID ${socket.id} left`)
    })
})