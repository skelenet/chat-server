# Emitting and Receiving Chat Events

## Simple Setup
Connect chatroom client to server (TBA)

## Tentative List of Available Events
- Emit `chatroom:connect` to receive `chatroom:join`

```js
/**
 * Initiate chatroom connection for client
 *
 * @emits chatroom:connect
 */
client.emit('chatroom:connect')

/**
 * Second client listens for `chatroom:join` every time a client connects
 *
 * @listens chatroom:join
 * @param {object} res Response payload containing ID of client that joined
 */
client2.on('chatroom:join', res =>
{
    console.log(`User ID ${res.id} joined`)
})
```

---

- Emit `disconnect` to receive `chatroom:leave`

```js
/**
 * Manually disconnect client, which will also emit a `disconnect` event
 * to all clients
 */
client.disconnect()

/**
 * Second client listens for `chatroom:leave` after first client leaves
 *
 * @listens chatroom:leave
 * @param {object} res Response payload containing ID of client that left
 */
client2.on('chatroom:leave', res =>
{
    console.log(`User ID ${res.id} left`)
})
```

---

- Emit `chatroom:send_global_msg` to receive `chatroom:global_msg_sent`

```js
/**
 * Send a global chat message
 *
 * @emits chatroom:send_global_msg
 * @param {string} msg The message to send
 */
client.emit('chatroom:send_global_msg', 'Hello World!')

/**
 * Listens for `chatroom:global_msg_sent` event after sending global message
 *
 * @listens chatroom:global_msg_sent
 * @param {object} res Response payload containing sender object that has ID and nickname,
 * and the message that was sent
 */
client.on('chatroom:global_msg_sent', res =>
{
    console.log(`${res.sender.nickName || res.sender.id}: ${res.msg}`)
})
```

---

- Emit `chatroom:set_nickname` to receive `chatroom:nickname_set`

```js
/**
 * Set a nickname for yourself (the client)
 *
 * @emits chatroom:set_nickname
 * @param {string} nickName The name you want to identify as
 */
client.emit('chatroom:set_nickname', 'Bob')

/**
 * Listens for `chatroom:nickname_set` event after setting nickname
 *
 * @listens chatroom:nickname_set
 * @param {object} res Response payload containing nickname that was set
 */
client.on('chatroom:nickname_set', res =>
{
    console.log(res.nickName)
})
```