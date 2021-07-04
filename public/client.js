var socket = io()
socket.emit('chat:connect')

var messages = document.getElementById('messages')
var form = document.getElementById('form')
var input = document.getElementById('input')

var nicknameForm = document.getElementById('nicknameForm')
var nickname = document.getElementById('nickname')

var usersTyping = document.getElementById('usersTyping')
let typing = false
let lastTypingTime = 0
const TYPING_TIMER_LENGTH = 4000

const updateTyping = () =>
{
    if(!typing)
    {
        typing = true
        socket.emit('chat:typing')
    }
    lastTypingTime = (new Date()).getTime()

    setTimeout(() =>
    {
        const typingTimer = (new Date()).getTime()
        const timeDiff = typingTimer - lastTypingTime
        if(timeDiff >= TYPING_TIMER_LENGTH && typing)
        {
            socket.emit('chat:stop_typing')
            typing = false
        }
    }, TYPING_TIMER_LENGTH)
}

const addChatMessage = msg =>
{
    let chatItem = document.createElement('li')
    chatItem.textContent = msg
    messages.appendChild(chatItem)
    window.scrollTo(0, document.body.scrollHeight)
}

const addTypingMessage = names =>
{
    let msg = ''
    switch(names.length)
    {
        case 0:
            msg = ''
            break
        case 1:
            msg = `${names[0]} is typing...`
            break
        case 2:
            msg = `${names[0]} and ${names[1]} are typing...`
            break
        case 3:
            msg = `${names[0]}, ${names[1]} and ${names[2]} are typing...`
            break
        default:
            msg = 'Multiple people are typing...'
            break
    }

    usersTyping.textContent = msg
}

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

form.addEventListener('keydown', e => updateTyping())

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

socket.on('chat:is_typing', users => addTypingMessage(Object.values(users)))
socket.on('chat:stopped_typing', users => addTypingMessage(Object.values(users)))
socket.on('chat:global_message_sent', res => addChatMessage(`${res.sender.nickName || res.sender.id}: ${res.message}`))
socket.on('chat:join', res => addChatMessage(`User ID ${res.id} joined`))
socket.on('chat:leave', res => addChatMessage(`User ID ${res.id} left`))