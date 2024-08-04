const events = {
  engine: ['initial_headers', 'headers', 'connection_error'],
  server: ['connect', 'new_namespace']
}

async function handleEvents () {
  const { runHook } = this.app.bajo
  const { camelCase, get } = this.app.bajo.lib._
  for (const type of ['engine', 'server']) {
    for (const event of events[type]) {
      const instance = get(this, type === 'engine' ? 'instance.engine' : 'instance')
      instance.on(event, async (...args) => {
        if (this.app.bajoEmitter) this.app.bajoEmitter.emit(`${this.name}.${camelCase(`${type} ${event}`)}`, ...args)
        await runHook(`${this.name}:${camelCase(`on ${type} ${event}`)}`, ...args)
      })
    }
  }
}

export default handleEvents
