import {SentryErrorBoundary} from '@shared/components/sentry-error-boundary'
import {UI} from '@shared/config'
import {createStore} from '@shared/utils/create-store'
import {loadable} from '@shared/utils/loadable'
import {Modals} from '@website/components'
import {Store} from '@website/types'
import {observer, Provider} from 'mobx-react'
import * as React from 'react'
import {hot} from 'react-hot-loader'
import {BrowserRouter, Route, Switch} from 'react-router-dom'
import {ThemeProvider} from 'styled-components'

const Routes = getRoutes()

// INFO: Set this value, to save the store to localStorage on every change
const LOCAL_STORAGE_KEY = ''
const store = createStore(Store, LOCAL_STORAGE_KEY)

class App extends React.Component {
  render() {
    return (
      <SentryErrorBoundary>
        <ThemeProvider theme={UI}>
          <Provider store={store}>
            <BrowserRouter>
              <React.Fragment>
                <Switch>
                  <Route exact path="/" component={Routes.Index} />
                  <Route path="/dashboard" component={Routes.Dashboard} />
                  <Route path="/auth/login" component={Routes.Auth.Login} />
                  <Route path="/auth/register" component={Routes.Auth.Register} />
                  <Route path="/auth/logout" component={Routes.Auth.Logout} />
                  <Route path="/auth/reset" component={Routes.Auth.Reset} />
                  <Route path="/auth/update" component={Routes.Auth.Update} />
                  <Route component={Routes.Missing} />
                </Switch>
                <Modals />
              </React.Fragment>
            </BrowserRouter>
          </Provider>
        </ThemeProvider>
      </SentryErrorBoundary>
    )
  }
}

export default hot(module)(observer(App))

function getRoutes() {
  return {
    Index: loadable(() => import('./pages/index')),
    Dashboard: loadable(() => import('./pages/dashboard')),
    // Document: loadable(() => import('./pages/document')),
    Missing: loadable(() => import('./pages/missing')),
    // Profile: loadable(() => import('./pages/profile')),
    Auth: {
      Login: loadable(() => import('./pages/auth/login')),
      Logout: loadable(() => import('./pages/auth/logout')),
      Register: loadable(() => import('./pages/auth/register')),
      Reset: loadable(() => import('./pages/auth/reset')),
      Update: loadable(() => import('./pages/auth/update')),
    },
  }
}
