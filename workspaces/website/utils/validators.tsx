// tslint:disable:max-line-length

  const validateEmail = (email) => {
    const regexp = /^[\x21\x23-\x27\x2a-\x2b\x2d\x2f-\x39\x3d\x3f\x41-\x5a\x5e-\x7e]+(\x2e[\x21\x23-\x27\x2a-\x2b\x2d\x2f-\x39\x3d\x3f\x41-\x5a\x5e-\x7e]+)*\x40[\x21\x23-\x27\x2a-\x2b\x2d\x2f-\x39\x3d\x3f\x41-\x5a\x5e-\x7e]+(\x2e([\x21\x23-\x27\x2a-\x2b\x2d\x2f-\x39\x3d\x3f\x41-\x5a\x5e-\x7e])+)+[\w]$/

    return regexp.test(email)
  }

  const validateIsNotEmpty  = (value) => {
    return !!value
  }

  export {validateEmail, validateIsNotEmpty}