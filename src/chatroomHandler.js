module.exports = (io, socket) =>
{
    const disconnect = () => io.emit('chatroom:leave', socket.id)
    const chatMessage = msg => io.emit('chatroom:chat_message', socket.nickName || socket.id, msg)

    const setNickname = name =>
    {
        socket.nickName = `${name}`
        io.emit('chatroom:nickname_set', name)
    }

    const connect = () =>
    {
        io.emit('chatroom:join', socket.id)

        socket.on('disconnect', disconnect)
        socket.on('chatroom:chat_message', chatMessage)
    }

    socket.on('chatroom:set_nickname', setNickname)
    socket.on('chatroom:connect', connect)
}