const { createServer } = require('http')
const { Server } = require('socket.io')
const Chatroom = require('../src/chatroomHandler')
const Client = require('socket.io-client')

let io, serverSocket, clientSocket, chatroom

describe('Chatroom', () =>
{
    beforeAll(done =>
    {
        const httpServer = createServer()
        io = new Server(httpServer)
        chatroom = new Chatroom(io)
    
        httpServer.listen(() =>
        {
            const port = httpServer.address().port
            clientSocket = new Client(`http://localhost:${port}`)
    
            io.on('connection', socket =>
            {
                serverSocket = socket
                chatroom.connect(socket)
            })
            clientSocket.on('connect', done)
        })
    })
    
    afterAll(done =>
    {
        io.close()
        clientSocket.close()
        done()
    })

    describe('Connection Events', () =>
    {
        it('connects to the backend via socket.io', done =>
        {
            serverSocket.on('connection', socket =>
            {
                expect(socket).toBeDefined()
            })

            serverSocket.emit('echo', 'Hello World!')
            clientSocket.once('echo', msg =>
            {
                expect(msg).toBe('Hello World!')
                done()
            })
        })
    })

    describe('Chat Events', () =>
    {
        it('should broadcast to connected clients when someone connects', done =>
        {
            serverSocket.emit('join', `User ID ${clientSocket.id} joined`)
            clientSocket.on('join', msg =>
            {
                expect(msg).toBe(`User ID ${clientSocket.id} joined`)
                done()
            })
        })
    })
})