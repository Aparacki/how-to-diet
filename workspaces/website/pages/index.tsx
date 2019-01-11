import {Store} from '@website/types'
import {as} from '@website/utils/as'
import {inject, observer} from 'mobx-react'
import * as React from 'react'
import {hot} from 'react-hot-loader'
import * as Router from 'react-router-dom'

interface Props extends Router.RouteComponentProps<{}> {
  store: Store
}

@hot(module)
@inject('store')
@as.member(() => <Router.Redirect to="/dashboard" />)
@observer
class Index extends React.Component<Props> {
  render() {
    return (<Router.Redirect to="/auth/login" />)
  }
}

export default Index
