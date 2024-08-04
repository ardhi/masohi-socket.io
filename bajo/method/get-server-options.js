function getServerOptions () {
  const options = this.getConfig('options')
  options.path = `/${this.config.alias}/`
  options.serveClient = false
  return options
}

export default getServerOptions
