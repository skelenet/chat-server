const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const port = process.env.PORT || 3000

app.get('/', (req, res) =>
{
    res.sendFile(__dirname + '/index.html')
})

server.listen(port, () =>
{
    console.log(`Listening on *:${port}`)
})

module.exports = { io }