let usersTyping = {}

module.exports = (io, socket) =>
{
    // Notify all clients when someone leaves
    const disconnect = () =>
    {
        usersTyping = {}
        io.emit('chat:leave', { id: socket.id })
    }

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

    const typing = () =>
    {
        usersTyping[socket.id] = socket.nickName || socket.id
        socket.broadcast.emit('chat:is_typing', usersTyping)
    }

    const stopTyping = () =>
    {
        delete usersTyping[socket.id]
        socket.broadcast.emit('chat:stopped_typing', usersTyping)
    }

    const connect = () =>
    {
        // Notify all clients when someone joins
        io.emit('chat:join', { id: socket.id })

        socket.on('disconnect', disconnect)
        socket.on('chat:send_global_message', sendGlobalMsg)
    }

    socket.on('chat:set_nickname', setNickname)
    socket.on('chat:typing', typing)
    socket.on('chat:stop_typing', stopTyping)
    socket.on('chat:connect', connect)
}