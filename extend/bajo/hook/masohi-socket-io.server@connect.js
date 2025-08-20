const socketEvents = ['disconnecting', 'disconnect']

async function serverConnect ({ payload } = {}) {
  const { data: socket } = payload
  const { runHook } = this.app.bajo
  const { camelCase } = this.lib._
  this.log.debug('clientIs%s%s', socket.id, this.log.write('connected'))
  for (const event of socketEvents) {
    socket.on(event, async (...params) => {
      await runHook(`${this.name}:${camelCase('socket ' + event)}`, socket, ...params)
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
  socket.join(this.config.roomLobby)
}

export default serverConnect
