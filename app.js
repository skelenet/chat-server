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

io.on('connection', (socket) =>
{
    console.log('A user connected')
    socket.on('disconnect', () =>
    {
        console.log('User disconnected')
    })
})

server.listen(port, () =>
{
    console.log(`Listening on *:${port}`)
})