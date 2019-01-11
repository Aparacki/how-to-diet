import {SYNCANO_PROJECT_INSTANCE} from '@shared/config'
const Syncano = require('@syncano/client')

export function syncanoUrl(endpoint: string) {
  try {
    const s = new Syncano(SYNCANO_PROJECT_INSTANCE)
    const token = window.localStorage.getItem('token')
    s.setToken(token)

    return s.url(endpoint)
  } catch (err) {
    // tslint:disable-next-line:no-console
    console.error(err)
  }

  return new Promise(() => {
    // tslint:disable-next-line:no-console
    console.error(
      `Syncano Client was used without instance name: ${endpoint}`
    )
  })
}
