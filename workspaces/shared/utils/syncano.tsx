import {SYNCANO_PROJECT_INSTANCE} from '@shared/config'
const Syncano = require('@syncano/client')

export function syncano(url: string, data?: object) {
  try {
    const s = new Syncano(SYNCANO_PROJECT_INSTANCE)
    const token = window.localStorage.getItem('token')

    s.setToken(token)

    return s.post(url, data, {
      params: {
        // INFO: this fixed user_key attached twice to url
        user_key: undefined,
      },
    })
  } catch (err) {
    // tslint:disable-next-line:no-console
    console.error(err.message)
  }

  return new Promise(() => {
    // tslint:disable-next-line:no-console
    console.error(
      `Syncano Client was used without instance name: ${url}`
    )
  })
}

syncano.url = (url: string, data?: object) => {
  const s = new Syncano(SYNCANO_PROJECT_INSTANCE)
  const token = window.localStorage.getItem('token')
  s.setToken(token)

  return s
    .url(url, data)
    .replace(/\?$/, '')
    .replace(/\/\//g, '/')
}

export function subscribe (
  url: string,
  callback: Function,
  data?: Object
): Promise<Object> {
  const s = new Syncano(SYNCANO_PROJECT_INSTANCE)
  const token = window.localStorage.getItem('token')

  return s.subscribe(url, {token, ...data}, callback)
}
