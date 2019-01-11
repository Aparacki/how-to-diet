import {Store} from '@website/types'
import {Form, Icon, message, Spin} from 'antd'
import {observable} from 'mobx'
import {inject, observer} from 'mobx-react'
import * as React from 'react'
import {hot} from 'react-hot-loader'
import InviteInputsGroup from './inputs-group'
import {InvitedListItem} from './invited-list-item'
import {Heading, InviteButton, InvitedList, Item, StyledButton} from './styled'

interface Props {
  store?: Store,
  form: any,
  documentId: string
}

@inject('store')
@hot(module)
@observer
class InviteToSignForm extends React.Component<Props> {
  @observable formSubmitted = false
  @observable isLoading = false
  @observable status = this.props.store.documentStore.document.status
  document: any

  get isAuthor() {
    return this.props.store.documentStore.document.isAuthor
  }
  async componentDidMount() {
    const key = new URL(location.href).searchParams.get('key')
    this.isLoading = true
    await this.props.store.documentStore.clear()
    if (this.props.store.documentStore.document.status === 'uploaded') {
      await this.props.store.documentStore.addCurrentUser()
    }
    await this.props.store.documentStore.getInvitations(key)
    this.isLoading = false

  }

  private get isSignatorInputAdded(): boolean {
    return this.props.store.documentStore.invitationsInputs.length > 0
  }

  handleSubmit = async e => {
    console.log(this.props.store.documentStore.invitationsInputs)
    const key = new URL(location.href).searchParams.get('key')
    e.preventDefault()
    if (!this.props.store.documentStore.validate()) {
      return
    }
    try {
      this.isLoading = true
      await this.props.store.documentStore.createInvitations(this.props.store.documentStore.invitationsInputs)
      await this.props.store.documentStore.clear()
      await this.props.store.documentStore.getInvitations(key)
      message.success('Your invitations have been send')
    } catch (err) {
      console.warn(err)
      message.error('Something went wrong, please try again')
    } finally {
      this.isLoading = false
      await this.props.store.documentStore.clear()
      this.props.store.documentStore.updateStatus('invited')
      this.status = 'invited'
    }
  }

  add = () => {
    this.props.store.documentStore.addSignatory()
  }

  render() {
    const {invitationsInputs, document, sendInvitations} = this.props.store.documentStore

    return (
      <React.Fragment>
      {this.isLoading ? (
        <Spin />
      ) : (
        <Item>
        {document.status === 'uploaded' ? (<Heading>INVITE</Heading>) : (<Heading>INVITED</Heading>)}
        {(this.status !== 'Signed' || document.status !== 'uploaded') && (
          <React.Fragment>
            <InvitedList>
              {
                sendInvitations.map((item, index) => (
                  <InvitedListItem
                  key={item.key}
                  firstName={item.firstName}
                  lastName={item.lastName}
                  status={item.status}
                  index={index}
                  />
                ))}
            </InvitedList>
            {(document.status !== 'signed') && (
               <Form onSubmit={this.handleSubmit}>
               {invitationsInputs.map((item) => (
                 <React.Fragment key={item.index}>
                   <InviteInputsGroup invited={item} inputId={item.index} />
                 </React.Fragment>
               ))}
               {this.isAuthor() ?
               <div className="u-ta-l u-mb">
                 <StyledButton onClick={this.add}>
                   <Icon type="plus-circle-o" />
                   Add signatory
                 </StyledButton>
               </div>
               : <div />}
               <div className="u-ta-c">
                 <InviteButton
                   type="primary"
                   htmlType="submit"
                   loading={this.isLoading}
                   disabled={!this.isSignatorInputAdded}
                 >
                   INVITE
                 </InviteButton>
               </div>
             </Form>
            )}
           </React.Fragment>
          )}
      </Item>
      )}
      </React.Fragment>
    )
  }
}

export const InviteForm = Form.create()(InviteToSignForm)
