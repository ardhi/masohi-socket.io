async function waibuMpaAfterBuildPage ({ $ }) {
  const { routePath } = this.app.waibu
  const src = routePath('masohiSocketIo.virtual:/client/socket.io.min.js')
  $('body').append(`<script src="${src}"></script>`)
  const options = this.getServerOptions()
  const inline = `
<script>
  socket = io({ path: '${options.path}'})
</script>`
  $('body').append(inline)
}

export default waibuMpaAfterBuildPage
