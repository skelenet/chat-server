module.exports = (io, socket) =>
{
    const disconnect = () => io.emit('chatroom:leave', socket.id)
    const sendGlobalMsg = msg => io.emit('chatroom:global_msg_sent', { nickName: socket.nickName, id: socket.id }, msg)

    const setNickname = name =>
    {
        socket.nickName = `${name}`
        io.emit('chatroom:nickname_set', name)
    }

    const connect = () =>
    {
        io.emit('chatroom:join', socket.id)

        socket.on('disconnect', disconnect)
        socket.on('chatroom:send_global_msg', sendGlobalMsg)
    }

    socket.on('chatroom:set_nickname', setNickname)
    socket.on('chatroom:connect', connect)
}