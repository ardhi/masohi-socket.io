const onClientDisconnect = {
  handler: function (socket) {
    this.log.trace('socketIs%s%s', socket.id, this.t('disconnected'))
  },
  level: 1000
}

export default onClientDisconnect
