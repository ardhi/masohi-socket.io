const clientEvents = ['disconnecting', 'disconnect']

const onClose = {
  handler: function (socket, ...args) {
    const { runHook } = this.app.bajo
    const { camelCase } = this.app.bajo.lib._
    this.log.debug('Client \'%s\' is %s', socket.id, this.log.write('connected'))
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
    for (const event of clientEvents) {
      socket.on(event, async (...params) => {
        if (this.app.bajoEmitter) this.app.bajoEmitter.emit(`${this.name}.${camelCase(`client ${event}`)}`, socket, ...params)
        await runHook(`${this.name}:${camelCase('on client ' + event)}`, socket, ...params)
      })
    }
    // catchall
    socket.onAny(async (event, ...args) => {
      const [subject, room] = event.split('@')
      const [msg] = args
      if (room) {
        const conns = this.connections.filter(c => c.room === room)
        for (const c of conns) {
          if (this.app.bajoEmitter) this.app.bajoEmitter.broadcast({ from: `${c.name}@${this.name}`, msg, subject })
          await runHook(`${this.name}:onMessage`, msg, subject, socket, c)
        }
      } else {
        if (this.app.bajoEmitter) this.app.bajoEmitter.emit(`${this.name}.${camelCase(subject)}`, socket, ...args)
        await runHook(`${this.name}:onMessage`, msg, subject, socket)
      }
    })
    // room connections
    for (const conn of this.connections) {
      if (!conn.anonymous || !socket.session) return
      socket.join(conn.room)
      this.log.trace('Client \'%s\' join to room \'%s\'', socket.id, conn.room)
    }
  },
  level: 1000
}

export default onClose
