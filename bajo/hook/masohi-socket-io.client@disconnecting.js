const onClientDisconnect = {
  handler: function (socket, ...args) {
    this.log.trace('Client \'%s\' is %s', socket.name, this.print.write('disconnecting'))
  },
  level: 1000
}

export default onClientDisconnect
