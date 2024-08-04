async function handleMiddleware () {
  const { eachPlugins, importModule } = this.app.bajo
  const { orderBy } = this.app.bajo.lib._
  for (const item of ['server', 'client']) {
    if (!this[`${item}Middlewares`]) this[`${item}Middlewares`] = []
    let mws = []
    await eachPlugins(async function ({ file, plugin }) {
      mws.push(await importModule(file, { asHandler: true }))
    }, { glob: `middleware/${item}/*.js` })
    mws = orderBy(mws, ['level'], ['asc'])
    this[`${item}Middlewares`] = mws
  }
  for (const m of this.serverMiddlewares) {
    this.instance.use(async (socket, next) => {
      try {
        await m.handler.call(this, socket)
        next()
      } catch (err) {
        next(err)
      }
    })
  }
}

export default handleMiddleware
