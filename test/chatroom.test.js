const { createServer } = require('http')
const { Server } = require('socket.io')
const Client = require('socket.io-client')

const registerChatroomHandlers = require('../src/chatroomHandler')

let io, serverSocket, clientSocket

describe('Chatroom', () =>
{
    beforeAll(done =>
    {
        const httpServer = createServer()
        io = new Server(httpServer)

        const onConnection = socket =>
        {
            serverSocket = socket
            registerChatroomHandlers(io, socket)
        }

        httpServer.listen(() =>
        {
            const port = httpServer.address().port
            clientSocket = new Client(`http://localhost:${port}`)
    
            io.on('connection', onConnection)
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
            // Make sure socket exists on connection
            serverSocket.on('connection', socket =>
            {
                expect(socket).toBeDefined()
            })

            // Confirm server-client handshake
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