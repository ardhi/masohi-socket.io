import { Server } from 'socket.io'

async function beforeSubApp () {
  const { runHook } = this.app.bajo
  const { get, camelCase } = this.lib._
  const options = this.getServerOptions()
  const instance = this.app.waibuMpa.instance
  this.instance = new Server(instance.server, options)
  // server middlewares
  for (const m of this.serverMiddlewares) {
    this.instance.use(async (socket, next) => {
      try {
        await m.handler.call(this.app[m.ns], socket)
        next()
      } catch (err) {
        next(err)
      }
    })
  }
  // engine middlewares
  for (const m of this.engineMiddlewares) {
    this.instance.engine.use(async (req, res, next) => {
      try {
        await m.handler.call(this.app[m.ns], req, res)
        next()
      } catch (err) {
        next(err)
      }
    })
  }
  // events
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

export default beforeSubApp
