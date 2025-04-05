async function factory (pkgName) {
  const me = this

  return class WaibuSocketIo extends this.lib.BajoPlugin {
    constructor () {
      super(pkgName, me.app)
      this.alias = 'sio'
      this.dependencies = ['waibu']
      this.config = {
        options: {
          cleanupEmptyChildNamespaces: true,
          connectionStateRecovery: true,
          serveClient: true,
          cors: {
            origin: '*'
          }
        },
        connections: []
      }
      this.events = {
        engine: ['initial_headers', 'headers', 'connection_error'],
        server: ['connect', 'new_namespace']
      }
    }

    init = async () => {
      const { buildCollections } = this.app.bajo

      const handler = async ({ item, options }) => {
        const { isString } = this.lib._
        if (isString(item)) item = { name: item }
        // if (!has(item, 'room')) throw this.error('isRequired%s', 'name')
        item.anonymous = item.anonymous ?? false
      }

      this.connections = await buildCollections({ ns: this.name, container: 'connections', handler, useDefaultName: false, dupChecks: ['name', 'room'] })
      this.connections.unshift({
        name: 'default',
        room: 'lobby',
        anonymous: true
      })
    }

    getServerOptions = () => {
      const options = this.getConfig('options')
      options.path = `/${this.alias}/`
      options.serveClient = false
      return options
    }

    send = async (topic, params = {}, options = {}) => {
      if (!this.instance) return
      const { find, isPlainObject } = this.lib._
      const { breakNsPath } = this.app.bajo
      if (isPlainObject(topic)) {
        params = topic
      } else params.subject = topic
      const { payload, connection = 'default', source } = params
      const { ns } = breakNsPath(source)
      const { timeout, callback } = options
      const c = find(this.connections, { name: connection })
      if (!c) throw this.error('notFound%s%s', this.print.write('connection'), `${connection}@masohiSocketIo`)
      if (c.room && payload) {
        let send = this.instance.to(c.room)
        if (timeout) send = send.timeout(timeout)
        if (callback) {
          const resp = await send.emitWithAck(params.subject, payload)
          callback.call(this.app[ns], resp)
        } else send.emit(params.subject, payload)
      }
    }
  }
}

export default factory
