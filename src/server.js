const express = require('express')
const http = require('http')
const { Server } = require('socket.io')

const app = express()

app.get('/', (req, res) =>
{
    res.sendFile(__dirname + '/index.html')
})

const server = http.createServer(app)
const io = new Server(server)

const port = process.env.PORT || 3000

server.listen(port, () =>
{
    console.log(`Listening on *:${port}`)
})

module.exports = { io }