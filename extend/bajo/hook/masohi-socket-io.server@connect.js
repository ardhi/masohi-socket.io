const socketEvents = ['disconnecting', 'disconnect']

async function serverConnect ({ payload } = {}) {
  const { data: socket } = payload
  const { runHook } = this.app.bajo
  const { camelCase } = this.app.lib._
  this.log.debug('clientIs%s%s', socket.id, this.t('connected'))
  for (const event of socketEvents) {
    socket.on(event, async (...params) => {
      await runHook(`${this.ns}:${camelCase('socket ' + event)}`, socket, ...params)
    })
  }
  // catchall
  socket.onAny(async (event, ...args) => {
    const [subject, room] = event.split('@')
    const [msg] = args
    if (room) {
      const conns = this.connections.filter(c => c.room === room)
      for (const c of conns) {
        await runHook(`${this.ns}:data`, msg, subject, c, socket)
      }
    } else {
      await runHook(`${this.ns}:data`, msg, subject, socket)
    }
  })
  socket.join(this.config.roomLobby)
}

export default serverConnect
