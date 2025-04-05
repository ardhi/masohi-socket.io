const clientEvents = ['disconnecting', 'disconnect']

async function serverConnect ({ payload } = {}) {
  const { data } = payload
  const [socket] = data
  const { runHook } = this.app.bajo
  const { camelCase } = this.lib._
  this.log.debug('client%s%s', socket.id, this.log.write('connected'))
  /*
  for (const m of this.clientMiddlewares) {
    socket.use(async ([event, ...params], next) => {
      try {
        await m.handler.call(this, event, ...params)
        next()
      } catch (err) {
        next(err)
      }
    })
  }
  */
  for (const event of clientEvents) {
    socket.on(event, async (...params) => {
      await runHook(`${this.name}:${camelCase('client ' + event)}`, socket, ...params)
    })
  }
  // catchall
  socket.onAny(async (event, ...args) => {
    const [subject, room] = event.split('@')
    const [msg] = args
    if (room) {
      const conns = this.connections.filter(c => c.room === room)
      for (const c of conns) {
        await runHook(`${this.name}:data`, msg, subject, c, socket)
      }
    } else {
      await runHook(`${this.name}:data`, msg, subject, socket)
    }
  })
  // room connections
  for (const conn of this.connections) {
    // if (!conn.anonymous || !socket.session) return
    socket.join(conn.room)
    this.log.trace('clientJoinRoom%s%s', socket.id, conn.room)
  }
}

export default serverConnect
