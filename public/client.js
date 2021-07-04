var socket = io()
socket.emit('chat:connect')

var messages = document.getElementById('messages')
var form = document.getElementById('form')
var input = document.getElementById('input')

form.addEventListener('submit', e =>
{
    e.preventDefault()
    if(input.value)
    {
        socket.emit('chat:send_global_message', input.value)
        addChatMessage(`${socket.nickName || socket.id}: ${input.value}`)
        input.value = ''
    }
})

form.addEventListener('keydown', e =>
{
    socket.emit('chat:typing')
})

var nicknameForm = document.getElementById('nicknameForm')
var nickname = document.getElementById('nickname')

nicknameForm.addEventListener('submit', e =>
{
    e.preventDefault()
    if(nickname.value)
    {
        socket.emit('chat:set_nickname', nickname.value)
        socket.nickName = nickname.value
        nickname.placeholder = nickname.value
        nickname.value = ''
    }
})

socket.on('chat:global_message_sent', res => addChatMessage(`${res.sender.nickName || res.sender.id}: ${res.message}`))
socket.on('chat:join', res => addChatMessage(`User ID ${res.id} joined`))
socket.on('chat:leave', res => addChatMessage(`User ID ${res.id} left`))

addChatMessage = msg =>
{
    let chatItem = document.createElement('li')
    chatItem.textContent = msg
    messages.appendChild(chatItem)
    window.scrollTo(0, document.body.scrollHeight)
}


const generateMessage = names =>
{
    switch(names.length)
    {
        case 0:
            return ''
        case 1:
            return `${names[0]} is typing...`
        case 2:
            return `${names[0]} and ${names[1]} are typing...`
        case 3:
            return `${names[0]}, ${names[1]} and ${names[2]} are typing...`
        default:
            return 'Multiple people are typing...'
    }
}

var usersTyping = document.getElementById('usersTyping')

socket.on('chat:user_typing', users =>
{
    const names = Object.values(users)
    usersTyping.textContent = generateMessage(names)
})