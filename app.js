const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const { Server } = require('socket.io')
const io = new Server(server);
const port = process.env.PORT || 3000

app.get('/', (req, res) =>
{
    res.sendFile(__dirname + '/index.html')
})

io.on('connection', socket =>
{
    io.emit('join', `Socket ID ${socket.id} joined`)
    console.log(`Socket ID ${socket.id} joined`)

    socket.on('chat message', msg =>
    {
        io.emit('chat message', msg)
        console.log('message: ' + msg)
    })

    socket.on('disconnect', () =>
    {
        io.emit('leave', `Socket ID ${socket.id} left`)
        console.log(`Socket ID ${socket.id} left`)
    })
})

server.listen(port, () =>
{
    console.log(`Listening on *:${port}`)
})