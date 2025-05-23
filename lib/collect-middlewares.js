async function collectMiddlewares () {
  const { eachPlugins, importModule } = this.app.bajo
  const { orderBy, merge } = this.lib._
  const me = this
  for (const item of ['server', 'engine']) {
    if (!this[`${item}Middlewares`]) this[`${item}Middlewares`] = []
    await eachPlugins(async function ({ ns, file, plugin }) {
      const mod = await importModule(file, { asHandler: true })
      if (!mod) return undefined
      merge(mod, { ns })
      me[`${item}Middlewares`].push(mod)
    }, { glob: `middleware/${item}/*.js`, prefix: this.name })
    this[`${item}Middlewares`] = orderBy(this[`${item}Middlewares`], ['level'], ['asc'])
  }
}

export default collectMiddlewares
