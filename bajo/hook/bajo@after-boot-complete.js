import { Server } from 'socket.io'

async function afterBootComplete () {
  const { runHook } = this.app.bajo
  const { get, camelCase } = this.lib._
  const options = this.getServerOptions()
  if (!this.app.waibu.instance) return
  this.instance = new Server(this.app.waibu.instance.server, options)
  for (const k in this.events) {
    for (const evt of this.events[k]) {
      const instance = get(this, k === 'engine' ? 'instance.engine' : 'instance')
      instance.on(evt, async (...data) => {
        const path = camelCase(evt)
        const type = k === 'engine' && evt === 'connection_error' ? evt : 'string'
        const params = { source: this.name, payload: { type, data } }
        await runHook(`${this.name}.${k}:${path}`, params)
      })
    }
  }
}

export default afterBootComplete
