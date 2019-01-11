import {Head, Page, Wrapper} from '@shared/components'
import {APP_TITLE, UI} from '@shared/config'
import {Navbar, ProfileEdit, SignatureUploadForm} from '@website/components'
import {Store} from '@website/types'
import {as} from '@website/utils/as'
import {inject, observer} from 'mobx-react'
import * as React from 'react'
import * as Router from 'react-router-dom'

interface Props extends Router.RouteComponentProps<{}> {
  store: Store
}

@inject('store')
@as.guest(() => <Router.Redirect to="/" />)
@observer
class Profile extends React.Component<Props> {
  private readonly title = `Profile - ${APP_TITLE}`

  render() {
    return (
      <Page>
        <Head>
          <title>{this.title}</title>
        </Head>
        <Navbar/>
        <Wrapper>
          <div className="View">
            <ProfileEdit />
            <div className="separator"/>
            <h2 className="text-centered">LIST OF SIGNATURES</h2>
            <p className="text-centered u-mb u-mt-">
              Signature is basically an image of your handwritten signature. We accept .png and .jpg files.
            </p>
            <SignatureUploadForm />
          </div>
        </Wrapper>
        <style jsx>{`
          .View {
            margin-left: auto;
            margin-right: auto;
            max-width: 840px;
            padding: ${UI.spacing} 0;
          }
        `}</style>
      </Page>
    )
  }
}

export default Profile
