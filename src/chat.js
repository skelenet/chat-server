module.exports = (io, socket) =>
{
    // Notify all clients when someone leaves
    const disconnect = () => io.emit('chat:leave', { id: socket.id })
    // Send global message to all clients except sender
    const sendGlobalMsg = msg => socket.broadcast.emit('chat:global_message_sent',
    {
        sender: { nickName: socket.nickName, id: socket.id }, message: msg
    })

    const setNickname = name =>
    {
        socket.nickName = name
        // Send nickname back, only to the client that set it (no one else should know)
        io.to(socket.id).emit('chat:nickname_set', { nickName: name })
    }

    const userTyping = () =>
    {
        socket.broadcast.emit('chat:user_typing', { nickName: socket.nickName, id: socket.id })
    }

    const connect = () =>
    {
        // Notify all clients when someone joins
        io.emit('chat:join', { id: socket.id })

        socket.on('disconnect', disconnect)
        socket.on('chat:send_global_message', sendGlobalMsg)
    }

    socket.on('chat:set_nickname', setNickname)
    socket.on('chat:user_typing', userTyping)
    socket.on('chat:connect', connect)
}