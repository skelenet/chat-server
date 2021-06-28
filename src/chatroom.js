function Chatroom(io)
{
    this.io = io
}

Chatroom.prototype.connect = function connect(socket)
{
    this.io.emit('join', `User ID ${socket.id} joined`)

    socket.on('disconnect', () =>
    {
        this.io.emit('leave', `User ID ${socket.id} left`)
    })

    socket.on('chat message', msg =>
    {
        this.io.emit('chat message', msg)
    })
}

module.exports = Chatroom