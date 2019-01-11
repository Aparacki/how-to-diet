import {Head, Page} from '@shared/components'
import {APP_TITLE, UI} from '@shared/config'
import {DocumentDetails, DocumentPage, DocumentSign, InviteForm, Navbar} from '@website/components'
import {Store} from '@website/types'
import {Button, Popover, Spin, Steps} from 'antd'
import {observable} from 'mobx'
import {inject, observer} from 'mobx-react'
import * as React from 'react'
import {DragDropContext} from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import * as Router from 'react-router'
import {InviteSteps, StyledInner, StyledSteps} from './styled'

const popoverStyle = {maxWidth: '350px'}

const steps = [{
  // tslint:disable-next-line:max-line-length
  title: <Popover overlayStyle={popoverStyle} content="Create list of signatories by adding their names to the list - when it’s ready hit send to generate and send email invitation.">INVITE</Popover>,
  },
  {
  // tslint:disable-next-line:max-line-length
  title: <Popover overlayStyle={popoverStyle} content="Drag your signature to the document, adjust size and drop in the signing place. Then press 'SIGN DOCUMENT' button">SIGN</Popover>,
}]

const invitedSteps = [{
  // tslint:disable-next-line:max-line-length
  title: <Popover overlayStyle={popoverStyle} content="Signature is basically an image of your handwritten signature. We accept .png and .jpg files">ADD SIGNATURE</Popover>,
  },
  {
  // tslint:disable-next-line:max-line-length
  title: <Popover overlayStyle={popoverStyle} content="Drag your signature to the document, adjust size and drop in the signing place. Then press 'SIGN DOCUMENT' button">SIGN</Popover>,
}]

interface Match {
  id?: string
}

interface Props extends Router.RouteComponentProps<Match> {
  store?: Store
}

@inject('store')
@DragDropContext(HTML5Backend)
@observer
class Details extends React.Component<Props> {
  @observable isLoading = true
  @observable current = 0
  private readonly title = `Document details - ${APP_TITLE}`

  async componentDidMount() {
    const key = new URL(location.href).searchParams.get('key')
    const {id} = this.props.match.params
    await this.props.store.documentStore.getDocument(id, key)
    await this.props.store.userStore.getSignatures()
    this.props.store.signStore.setCompleted(false)
    if (key) {
      this.props.store.signStore.setInvitationKey(key)

      if (!this.props.store.userStore.isLoggedIn) {
        this.props.store.modal.open('login')
      }
    }
    this.props.store.signStore.setDocumentId(
      parseInt(this.props.match.params.id, 10)
    )
    this.props.store.signStore.fetch()
    this.props.store.documentStore.getInvitations(key)
    this.setCurrentStep()
    this.isLoading = false
  }

  get document() {
    return this.props.store.documentStore.document
  }

  get isGuest() {
    return this.props.store.userStore.isGuest
  }

  get isAuthor() {
    return this.document.isAuthor
  }

  setCurrentStep() {
    if (this.document.status === 'invited') {
      this.current = 1
    }
  }

  // tslint:disable-next-line:no-empty
  handleStop({ }: any) { }
  // tslint:disable-next-line:no-empty
  handleDrop({ }: any, { }: any) { }

  render() {
    const Step = Steps.Step
    const {id} = this.props.match.params
    const {document} = this.props.store.documentStore
    const {current} = this
    const {pages} = this.props.store.signStore
    const {signatures} = this.props.store.userStore

    return (
      <Page>
        <Head>
          <title>{this.title}</title>
        </Head>
        <Navbar guest={!this.isGuest} />
        <React.Fragment>
          {this.isLoading ? (
          <div className="Details Details--empty">
            <Spin />
          </div>
          ) : (
          <div className="Details">
            <div className="Details__column">
              <div className="Details__list">
                <Spin spinning={this.props.store.signStore.pending}>
                  <div className="Invite__inner">
                    <DocumentDetails document={document} />
                  </div>
                  <InviteSteps>
                    {this.isAuthor && document.status !== 'signed' ? (
                      <StyledSteps current={current}>
                        {steps.map((item, index) => <Step key={index} title={item.title} />)}
                      </StyledSteps>
                    ) : this.isGuest && document.status !== 'signed' ? (
                      <StyledSteps current={current}>
                        {invitedSteps.map((item, index) => <Step key={index} title={item.title} />)}
                      </StyledSteps>
                    ) : document.status !== 'signed' ? (
                      // TODO: add descriptions for invited user who has account
                      <StyledSteps current={current}>
                        {invitedSteps.map((item, index) => <Step key={index} title={item.title} />)}
                      </StyledSteps>
                    ) : null
                    }
                    <StyledInner>
                      <InviteForm documentId={id} />
                    </StyledInner>
                    <StyledInner>
                      {document.status !== 'signed' ? (<DocumentSign
                        signatures={signatures}
                        key={id}
                      />) : (
                        <div className="u-ta-c u-mt">
                          <Button type="primary" href={document.file} target="_blank">Download Document</Button>
                        </div>
                      )}
                    </StyledInner>
                  </InviteSteps>
                </Spin>
              </div>
            </div>
            <div className="Details__column">
              <div className="Preview">
                {this.props.store.signStore.status === 'processing' ?
                  (<h2>Document is currently processing, please refresh the page</h2>
                  ) : (
                    pages.map((item, index) => {
                      return (
                        <DocumentPage
                          data={item}
                          id={index}
                          key={index}
                          // tslint:disable-next-line:no-shadowed-variable
                          onDrop={item => this.handleDrop(index, item)}
                        />
                      )
                    })
                  )}
              </div>
            </div>
          </div>
            )}
        </React.Fragment>

        <style jsx>{`
          .Details {
            width: 100%;
            padding-top: 60px;
            overflow: hidden;
          }
          .Details--empty {
            display: flex;
            height: 20vh;
            justify-content: center;
            align-items: center;
          }
          .Details__column {
            width: 50%;
            float: left;
          }
          .Details__list {
            margin: 30px 80px;
            max-width: 450px;
          }
          .Preview {
            overflow-y: scroll;
            height: 100vh;
            box-sizing: border-box;
            padding: 15px;
          }
          @media screen and (max-width: ${UI.width.l}) {
            .Details__list {
              margin: 30px 40px;
            }
          }
          @media screen and (max-width: 1090px) {
            .Details__list {
              margin-right: 20px;
            }
          }
          @media screen and (max-width: 800px) {
            .Details {
              display: flex;
              flex-wrap: wrap;
              justify-content: center
            }
            .Details__column {
              width: 70%;
              min-width: 500px;
            }
            .Details__list {
              margin: 30px 16px;
            }
          }
          @media screen and (max-width: 510px) {
            .Details__column {
              width: 100%;
              min-width: 300px;
            }
          }
         `}</style>
      </Page>
    )
  }
}

export default Details
