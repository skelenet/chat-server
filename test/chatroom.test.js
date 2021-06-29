const { createServer } = require('http')
const { Server } = require('socket.io')
const Client = require('socket.io-client')

const registerChatroomhandlers = require('../src/chatroomHandler')

const createClient = (server, endpoint, options) =>
{
    if(typeof endpoint == 'object')
    {
        options = endpoint
        endpoint = undefined
    }

    let addr = server.address()
    if(!addr) addr = server.listen().address()

    const url = `http://localhost:${addr.port}${endpoint || ''}`
    return new Client(url, options)
}

const cleanup = (io, clientSockets, done) =>
{
    io.close()
    clientSockets.forEach(client => client.close())
    done()
}

describe('Chatroom', () =>
{
    describe('Connection Events', () =>
    {
        it('connects to the backend via socket.io', done =>
        {
            const server = createServer()
            const sio = new Server(server)

            server.listen(() =>
            {
                const client = createClient(server)
                sio.on('connect', socket =>
                {
                    // Make sure socket exists on connection
                    expect(socket).toBeDefined()

                    // Confirm server-client handshake
                    sio.emit('echo', 'Hello World!')
                    client.once('echo', msg =>
                    {
                        expect(msg).toBe('Hello World!')
                        cleanup(sio, [client], done)
                    })
                })
            })
        })
    })

    describe('Chat Events', () =>
    {
        it('should broadcast global join message when someone connects', done =>
        {
            const server = createServer()
            const sio = new Server(server)

            server.listen(() =>
            {
                const client = createClient(server, { forceNew: true })
                const client2 = createClient(server, { forceNew: true })
                let msg = undefined

                sio.on('connect', socket =>
                {
                    registerChatroomhandlers(sio, socket)

                    // Emulate connecting to chatroom with client1
                    client.emit('chatroom:connect')

                    // Client2 listens for chatroom join event, should receive join message
                    client2.once('chatroom:join', logMsg =>
                    {
                        expect(logMsg).toBeDefined()
                        msg = logMsg
                    })
                })
                // We need to wait for clients to finish listening to events and for
                // the tests to finish before disconnecting server and clients.
                // Otherwise, the tests will fail prematurely.
                setTimeout(() => {
                    expect(msg).toBe(`User ID ${client.id} joined`)
                    cleanup(sio, [client, client2], done)
                }, 300)
            })
        })

        it('should broadcast global leave message when someone disconnects', done =>
        {
            const server = createServer()
            const sio = new Server(server)

            server.listen(() =>
            {
                const client = createClient(server, { forceNew: true })
                const client2 = createClient(server, { forceNew: true })
                let clientID, msg = undefined

                sio.on('connect', socket =>
                {
                    registerChatroomhandlers(sio, socket)

                    client.emit('chatroom:connect')
                    client2.on('chatroom:join', () =>
                    {
                        clientID = client.id

                        setTimeout(() => client.disconnect(), 50)
                        client2.on('chatroom:leave', logMsg =>
                        {
                            expect(logMsg).toBeDefined()
                            msg = logMsg
                        })
                    })
                })
                setTimeout(() => {
                    expect(msg).toBe(`User ID ${clientID} left`)
                    cleanup(sio, [client, client2], done)
                }, 300)
            })
        })
    })
})