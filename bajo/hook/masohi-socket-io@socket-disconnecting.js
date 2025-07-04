const onClientDisconnect = {
  handler: function ({ payload } = {}) {
    const { get } = this.lib._
    this.log.trace('socketIs%s%s', get(payload, 'data.name'), this.print.write('disconnecting'))
  },
  level: 1000
}

export default onClientDisconnect
