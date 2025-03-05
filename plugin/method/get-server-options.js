function getServerOptions () {
  const options = this.getConfig('options')
  options.path = `/${this.alias}/`
  options.serveClient = false
  return options
}

export default getServerOptions
