async function beforeBuildPageInjectElement (options) {
  const srvOpts = this.getServerOptions()
  options.scripts = options.scripts ?? []
  options.scripts.unshift('^masohiSocketIo.virtual:/client/socket.io.min.js')
  options.inlineScript = options.inlineScript ?? []
  options.inlineScript.unshift(`
    socket = io({ path: '${srvOpts.path}'})
  `)
}

export default beforeBuildPageInjectElement
