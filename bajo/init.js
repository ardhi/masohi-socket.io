async function handler ({ item, options }) {
  const { isString, has } = this.app.bajo.lib._
  if (isString(item)) item = { name: item }
  if (!has(item, 'room')) throw this.error('Connection must have a \'room\' name')
  item.anonymous = item.anonymous ?? false
}

async function init () {
  const { buildCollections } = this.app.bajo
  this.connections = await buildCollections({ ns: this.name, container: 'connections', handler, useDefaultName: false, dupChecks: ['name', 'room'] })
}

export default init
