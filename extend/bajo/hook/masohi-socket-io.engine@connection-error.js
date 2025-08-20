async function engineConnectionError ({ error } = {}) {
  this.log.error('error%s', error.message)
}

export default engineConnectionError
