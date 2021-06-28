module.exports = (io, socket) =>
{
    const disconnect = () => io.emit('chatroom:leave', `User ID ${socket.id} left`)
    const chatMessage = msg => io.emit('chatroom:chat_message', msg)

    const connect = () =>
    {
        io.emit('chatroom:join', `User ID ${socket.id} joined`)

        socket.on('disconnect', disconnect)
        socket.on('chatroom:chat_message', chatMessage)
    }

    socket.on('chatroom:connect', connect)
}