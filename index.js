import collectMiddlewares from './lib/collect-middlewares.js'

async function factory (pkgName) {
  const me = this

  class WaibuSocketIo extends this.lib.Plugin {
    static alias = 'sio'
    static dependencies = ['waibu-mpa']

    constructor () {
      super(pkgName, me.app)
      this.config = {
        options: {
          cleanupEmptyChildNamespaces: true,
          connectionStateRecovery: true,
          serveClient: true,
          cors: {
            origin: '*'
          }
        },
        roomLobby: 'lobby'
      }
      this.events = {
        engine: ['initial_headers', 'headers', 'connection_error'],
        namespace: ['connect'],
        server: ['connect', 'new_namespace']
      }
    }

    init = async () => {
      await collectMiddlewares.call(this)
    }

    getServerOptions = () => {
      const options = this.getConfig('options')
      options.path = `/${this.alias}/`
      options.serveClient = false
      return options
    }

    send = async (params = {}, options = {}) => {
      if (!this.instance) return
      const { isString } = this.lib._
      const { breakNsPath, callHandler } = this.app.bajo
      let { subject, payload, source, to = 'lobby' } = params
      const { ns } = breakNsPath(source)
      const { timeout = 0, callback } = options
      if (isString(to)) to = [to]
      for (const t of to) {
        const socks = await this.instance.in(t).fetchSockets()
        for (const sock of socks) {
          if (callback) {
            const resp = await sock.timeout(timeout).emitWithAck(params.subject, payload)
            if (isString(callback)) await callHandler(callback, resp)
            else await callback.call(this.app[ns], resp)
          } else sock.emit(subject, payload)
        }
      }
    }
  }

  return WaibuSocketIo
}

export default factory
