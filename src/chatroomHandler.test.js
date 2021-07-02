const { createServer } = require('http')
const { Server } = require('socket.io')
const Client = require('socket.io-client')

const registerChatroomhandlers = require('./chatroomHandler')

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

describe('Chatroom Server', () =>
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
        jest.setTimeout(3000)

        it('should broadcast global join message when someone connects', done =>
        {
            const server = createServer()
            const sio = new Server(server)

            server.listen(() =>
            {
                const client = createClient(server, { forceNew: true })
                const client2 = createClient(server, { forceNew: true })
                let joinedClientID = undefined

                sio.on('connect', socket =>
                {
                    registerChatroomhandlers(sio, socket)

                    // Emulate connecting to chatroom with client1
                    client.emit('chatroom:connect')

                    // Client2 listens for chatroom join event, should receive ID of client that joined
                    client2.once('chatroom:join', res =>
                    {
                        expect(res).toBeDefined()
                        joinedClientID = res.id
                    })
                })
                // We need to wait for clients to finish listening to events and for
                // the tests to finish before disconnecting server and clients.
                // Otherwise, the tests will fail prematurely.
                setTimeout(() => {
                    expect(joinedClientID).toBe(client.id)
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
                let leftClientID, msg = undefined

                sio.on('connect', socket =>
                {
                    registerChatroomhandlers(sio, socket)

                    client.emit('chatroom:connect')
                    client2.on('chatroom:join', () =>
                    {
                        leftClientID = client.id

                        setTimeout(() => client.disconnect(), 50)
                        client2.on('chatroom:leave', res =>
                        {
                            expect(res).toBeDefined()
                            msg = `User ID ${res.id} left`
                        })
                    })
                })
                setTimeout(() => {
                    expect(msg).toBe(`User ID ${leftClientID} left`)
                    cleanup(sio, [client, client2], done)
                }, 300)
            })
        })

        it('should allow clients to set nicknames', done =>
        {
            const server = createServer()
            const sio = new Server(server)

            server.listen(() =>
            {
                const client = createClient(server)
                const clientName = 'Bob'
                let returnedName = undefined

                sio.on('connect', socket =>
                {
                    registerChatroomhandlers(sio, socket)

                    client.emit('chatroom:set_nickname', clientName)
                    client.on('chatroom:nickname_set', res =>
                    {
                        expect(res).toBeDefined()
                        returnedName = res.nickName
                    })
                })
                setTimeout(() =>
                {
                    expect(returnedName).toBe(clientName)
                    cleanup(sio, [client], done)
                }, 300)
            })
        })

        it('should listen for and emit chat messages back to clients', done =>
        {
            const server = createServer()
            const sio = new Server(server)

            server.listen(() =>
            {
                const client = createClient(server)
                const client2 = createClient(server)
                let clientID, msg = undefined

                sio.on('connect', socket =>
                {
                    registerChatroomhandlers(sio, socket)

                    client.emit('chatroom:connect')
                    client2.on('chatroom:join', () =>
                    {
                        clientID = client.id

                        setTimeout(() => client.emit('chatroom:send_global_msg', `Chat message from ${client.id}`), 50)
                        client2.on('chatroom:global_msg_sent', res =>
                        {
                            expect(res).toBeDefined()
                            msg = `${res.sender.nickName || res.sender.id}: ${res.msg}`
                        })
                    })
                })
                setTimeout(() => {
                    expect(msg).toBe(`${clientID}: Chat message from ${clientID}`)
                    cleanup(sio, [client, client2], done)
                }, 300)
            })
        })
    })
})