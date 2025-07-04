import { Server } from 'socket.io'

async function afterSubApp () {
  const { runHook } = this.app.bajo
  const { get, camelCase } = this.lib._
  const options = this.getServerOptions()
  const instance = this.app.waibuMpa.instance
  this.instance = new Server(instance.server, options)
  instance.addHook('preClose', done => {
    this.instance.local.disconnectSockets(true)
    done()
  })
  instance.addHook('onClose', done => {
    this.instance.close()
    done()
  })
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
        let error
        let payload = { type: 'object', data: data[0] }
        if (k === 'engine') {
          if (evt === 'connection_error') error = new Error(data[0].message)
          else payload = { type: 'array', data }
        } else if (k === 'server') {
          if (evt === 'new_namespace') payload.type = 'string'
        }
        const params = { source: this.name, payload, error }
        await runHook(`${this.name}.${k}:${path}`, params)
      })
    }
  }
}

export default afterSubApp
