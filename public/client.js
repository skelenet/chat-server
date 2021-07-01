var socket = io()
socket.emit('chatroom:connect')

var messages = document.getElementById('messages')
var form = document.getElementById('form')
var input = document.getElementById('input')

form.addEventListener('submit', e =>
{
    e.preventDefault()
    if(input.value)
    {
        socket.emit('chatroom:send_global_msg', input.value)
        input.value = ''
    }
})

var nicknameForm = document.getElementById('nicknameForm')
var nickname = document.getElementById('nickname')

nicknameForm.addEventListener('submit', e =>
{
    e.preventDefault()
    if(nickname.value)
    {
        socket.emit('chatroom:set_nickname', nickname.value)
        nickname.placeholder = nickname.value
        nickname.value = ''
    }
})

socket.on('chatroom:global_msg_sent', (sender, msg) => addChatMessage(`${sender.nickName || sender.id}: ${msg}`))
socket.on('chatroom:join', clientID => addChatMessage(`User ID ${clientID} joined`))
socket.on('chatroom:leave', clientID => addChatMessage(`User ID ${clientID} left`))

addChatMessage = msg =>
{
    let chatItem = document.createElement('li')
    chatItem.textContent = msg
    messages.appendChild(chatItem)
    window.scrollTo(0, document.body.scrollHeight)
}