import {Head, Page, Wrapper} from '@shared/components'
import {APP_TITLE} from '@shared/config'
import {DocumentPreview, Navbar} from '@website/components'
import {Store} from '@website/types'
import {as} from '@website/utils/as'
import {inject, observer} from 'mobx-react'
import * as React from 'react'
import {hot} from 'react-hot-loader'
import * as Router from 'react-router-dom'

interface Match {
  id: string
}
interface Props extends Router.RouteComponentProps<Match> {
  store?: Store
}

@hot(module)
@inject('store')
@as.guest(() => <Router.Redirect to="/" />)
@observer
class Preview extends React.Component<Props> {
  private readonly title = `Preview - ${APP_TITLE}`

  render() {
    return (
    <Page>
      <Head>
        <title>{this.title}</title>
      </Head>
      <Navbar/>
      <Wrapper>
        <React.Fragment>
          <DocumentPreview id={this.props.match.params.id}/>
        </React.Fragment>
      </Wrapper>
      </Page>
    )
  }
}

export default Preview
