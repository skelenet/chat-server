function Chatroom(io)
{
    this.io = io
}

Chatroom.prototype.connect = function connect(socket)
{
    this.io.emit('join', `Socket ID ${socket.id} joined`)

    socket.on('disconnect', () =>
    {
        this.io.emit('leave', `Socket ID ${socket.id} left`)
    })

    socket.on('chat message', msg =>
    {
        this.io.emit('chat message', msg)
    })
}

module.exports = Chatroom