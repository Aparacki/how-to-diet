import {Store} from '@website/types'
import {Badge, Button, Icon} from 'antd'
import {observable} from 'mobx'
import {inject, observer} from 'mobx-react'
import * as React from 'react'
import {hot} from 'react-hot-loader'
import {InvitedListItem as StyledListItem} from './styled'

interface Props {
  store?: Store,
  firstName: string,
  lastName: string,
  status: string,
  index: number,
  key: string,
}

@inject('store')
@hot(module)
@observer
class InvitedListItem extends React.Component<Props> {
  @observable isDisabled = false
  @observable isLoading = false

  get isAuthor() {
    return this.props.store.documentStore.document.isAuthor
  }

  handleRemind = async () => {
    this.isLoading = true
    try {
      await this.props.store.documentStore.sendInvitations[this.props.index]
      .sendReminder()
      this.isDisabled = true
      this.isLoading = false
    } catch (err) {
      this.isLoading = false
      throw(err)
    }
  }

  render() {
    const {firstName, lastName, status} = this.props

    return (
        <StyledListItem>
          <div>
            {firstName}
            {lastName}
          </div>
          <div>
            <Badge status={
              status === 'invited' ? 'success' : 'warning'
            }/>
            {status === 'invited' ? 'Waiting for accept' : 'Signed'}
          </div>
          {(this.isAuthor() && status === 'invited') && (
            <Button
            onClick={this.handleRemind}
            disabled={this.isDisabled}
            loading={this.isLoading}>
            <Icon type="reload" /> Remind
          </Button>
          )}
        </StyledListItem>

    )
  }
}
export {InvitedListItem}
