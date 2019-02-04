import {Head, Page} from '@shared/components'
import {APP_TITLE} from '@shared/config'
import {Navbar} from '@website/components'
import {HomeProduct} from '@website/components'
import FilterBar from '@website/components/filter-bar'
import Table from '@website/components/table'
import {Store} from '@website/types'
import {as} from '@website/utils/as'
import {Button, Col} from 'antd'
import {inject, observer} from 'mobx-react'
import * as React from 'react'
import {hot} from 'react-hot-loader'
import * as Router from 'react-router-dom'


interface Props extends Router.RouteComponentProps<{}> {
  store: Store
}

@hot(module)
@inject('store')
// @as.guest(() => <Router.Redirect to="/" />)
@observer
class Dashboard extends React.Component<Props> {
  private readonly title = APP_TITLE

  render() {

    return (
      <Page>
        <Head>
          <title>{this.title}</title>
        </Head>
        <HomeProduct />
        <Navbar/>
      </Page>
    )
  }
}

export default Dashboard
