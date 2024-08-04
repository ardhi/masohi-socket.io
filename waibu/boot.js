import { Server } from 'socket.io'
import handleEvents from '../lib/handle-events.js'
import handleMiddleware from '../lib/handle-middleware.js'

const boot = {
  level: 5,
  handler: async function () {
    const options = this.getServerOptions()
    const instance = new Server(this.app.waibu.instance.server, options)
    this.instance = instance
    await handleEvents.call(this)
    await handleMiddleware.call(this)
  }
}

export default boot
