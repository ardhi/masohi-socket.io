const onClientDisconnect = {
  handler: function (socket) {
    this.log.trace('socketIs%s%s', socket.id, this.print.write('disconnected'))
  },
  level: 1000
}

export default onClientDisconnect
