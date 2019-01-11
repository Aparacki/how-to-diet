import {Head, Page} from '@shared/components'
import {APP_TITLE} from '@shared/config'
import {Navbar} from '@website/components'
import FilterBar from '@website/components/filter-bar'
import Table from '@website/components/table'
import {Store} from '@website/types'
import {as} from '@website/utils/as'
import {Button, Col} from 'antd'
import {inject, observer} from 'mobx-react'
import * as React from 'react'
import {hot} from 'react-hot-loader'
import * as Router from 'react-router-dom'
import {DashboardWrapper, RowContainer} from './styled'

interface Props extends Router.RouteComponentProps<{}> {
  store: Store
}

@hot(module)
@inject('store')
@as.guest(() => <Router.Redirect to="/" />)
@observer
class Dashboard extends React.Component<Props> {
  private readonly title = APP_TITLE

  render() {
    const {modal} = this.props.store

    return (
      <Page>
        <Head>
          <title>{this.title}</title>
        </Head>
        <Navbar/>
        <DashboardWrapper>
          <RowContainer
            type="flex"
            justify="space-between"
          >
            <Col>
              <h2>DOCUMENTS</h2>
            </Col>
            <Col>
              <Button type="primary" onClick={() => modal.open('upload')}>NEW DOCUMENT</Button>
            </Col>
          </RowContainer>
          <FilterBar />
          <Table />
        </DashboardWrapper>
      </Page>
    )
  }
}

export default Dashboard
