module.exports = (io, socket) =>
{
    // Notify all clients when someone leaves
    const disconnect = () => io.emit('chatroom:leave', { id: socket.id })
    // Send global message to all clients except sender
    const sendGlobalMsg = msg => socket.broadcast.emit('chatroom:global_msg_sent', { sender: { nickName: socket.nickName, id: socket.id }, msg: msg })

    const setNickname = name =>
    {
        socket.nickName = name
        // Send nickname back, only to the client that set it (no one else should know)
        io.to(socket.id).emit('chatroom:nickname_set', { nickName: name })
    }

    const connect = () =>
    {
        // Notify all clients when someone joins
        io.emit('chatroom:join', { id: socket.id })

        socket.on('disconnect', disconnect)
        socket.on('chatroom:send_global_msg', sendGlobalMsg)
    }

    socket.on('chatroom:set_nickname', setNickname)
    socket.on('chatroom:connect', connect)
}