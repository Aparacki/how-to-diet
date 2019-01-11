import {loadable} from '@shared/utils/loadable'
import {Store} from '@website/types'
import {inject, observer} from 'mobx-react'
import * as React from 'react'
import {hot} from 'react-hot-loader'
import * as Router from 'react-router-dom'

const Routes = getRoutes()

interface Props extends Router.RouteComponentProps<{}> {
  store?: Store
}

@hot(module)
@inject('store')
@observer
class Documents extends React.Component<Props> {
  render() {
    return (
      <Router.Switch>
        <Router.Route path="/document/details/:id" component={Routes.Details} />
        <Router.Route path="/document/preview/:id(\d+)?/:key?" component={Routes.Preview} />
        {/* <Router.Route path="/document/sign/:id(\d+)?/:key?" component={Routes.Sign} /> */}
      </Router.Switch>
    )
  }
}

function getRoutes() {
  return {
    Preview: loadable(() => import('./preview')),
    Details: loadable(() => import('./details')),
  }
}

export default Documents
