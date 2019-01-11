import {Provider} from 'mobx-react'
import * as React from 'react'
import {Page} from '../../workspaces/shared/components'
import {createStore} from '../../workspaces/shared/utils/create-store'
import {Store} from '../../workspaces/website/types'
const createWrapperProxy = require('react-cosmos-wrapper-proxy').default
import createRouterProxy from 'react-cosmos-router-proxy'
import createXhrProxy from 'react-cosmos-xhr-proxy'
import {hot} from 'react-hot-loader'
import {ThemeProvider} from 'styled-components'
import {UI} from '../../workspaces/shared/config'

const store = createStore(Store, '')
const component = hot(module)(({children}) => (
  <Provider store={store}>
    <ThemeProvider theme={UI}>
      <Page>
        <div style={{padding: 32}}>
          {children}
        </div>
      </Page>
    </ThemeProvider>
  </Provider>
))

const wrapperProxy = createWrapperProxy({
  component,
  fixtureKey: 'wrap',
})

export default [wrapperProxy, createXhrProxy(), createRouterProxy()]
