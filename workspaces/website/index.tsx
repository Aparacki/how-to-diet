import {loadable} from '@shared/utils/loadable'
import registerServiceWorker from '@shared/utils/register-service-worker'
import * as React from 'react'
import * as ReactDOM from 'react-dom'

const App = loadable(() => import('./app'))

ReactDOM.render(<App />, document.querySelector('#root'))

registerServiceWorker()
