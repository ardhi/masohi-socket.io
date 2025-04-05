async function engineConnectionError (err) {
  this.log.error('error%s', err.message, err)
}

export default engineConnectionError
