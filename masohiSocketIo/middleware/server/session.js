const session = {
  level: 1,
  handler: function (socket) {
    const { ctx, getSessionId } = this.app.waibuMpa
    return new Promise((resolve, reject) => {
      const sid = getSessionId(socket.handshake.headers.cookie)
      const req = {}
      ctx.decryptSession(sid, req, () => {
        req.lang = req.session.lang
        socket.req = req
        resolve()
      })
    })
  }
}

export default session
