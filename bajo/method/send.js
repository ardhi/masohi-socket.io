async function send ({ msg, from, to, subject = 'message' } = {}) {
  const { addressSplit } = this.app.bajoEmitter
  const { find } = this.app.bajo.lib._
  const { connection, plugin } = addressSplit(to)
  if (plugin !== 'waibuSocketIo') return
  const name = connection
  const conn = find(this.connections, { name })
  if (!conn) throw this.error('No such connection \'%s\'', name)
  this.instance.to(conn.room).emit(subject, msg, from)
}

export default send
