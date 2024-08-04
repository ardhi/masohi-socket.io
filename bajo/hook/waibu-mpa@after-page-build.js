async function waibuMpaAfterBuildPage ({ $ }) {
  const { routePath } = this.app.waibuMpa
  const src = routePath('waibuSocketIo:/client/socket.io.min.js')
  $('body').append(`<script src="${src}"></script>`)
}

export default waibuMpaAfterBuildPage
