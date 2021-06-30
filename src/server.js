const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const port = process.env.PORT || 3000

app.use(express.static('public'))

server.listen(port, () =>
{
    console.log(`Listening on *:${port}`)
})

module.exports = { io }