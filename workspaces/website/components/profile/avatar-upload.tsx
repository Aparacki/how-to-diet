import StyledButton from '@website/components/profile/styledButton'
import StyledUpload from '@website/components/profile/uploadStyled'
import {Store} from '@website/types'
import {syncanoUrl} from '@website/utils/syncano'
import {Icon, message, Spin} from 'antd'
import {observable} from 'mobx'
import {inject, observer} from 'mobx-react'
import * as React from 'react'

interface Props {
  store?: Store,
  src?: string,
  size?: number,
}

interface State {
  loading: boolean
  avatarPreview: string
}

@inject('store')
@observer
class AvatarUpload extends React.Component<Props, State> {
  @observable private uploadActionUrl: any

  constructor(props: any) {
    super(props)
    this.state = {
      loading: false,
      avatarPreview: '',
    }
  }
  async componentDidMount() {
    this.uploadActionUrl = syncanoUrl('user/update-profile')
  }

  handleAvatarUpload = async (e) => {
    const form = new FormData()
    form.append('image', e.file)
    await this.props.store.userStore.updateProfile(form)
    message.success(`Image loaded successfully`)
  }

  removeAvatar = async () => {
    await this.props.store.userStore.updateProfile({remove: true})
    message.success(`Image deleted successfully`)
  }

  render() {
    const {loading} = this.state
    const {avatarUrl} = this.props.store.userStore.profile

    return (
      <div className="clearfix">
      {loading ?
        <Spin />
        :
        <React.Fragment>
          <StyledUpload
            customRequest={this.handleAvatarUpload}
            name="image"
            action={this.uploadActionUrl}
            listType="picture-card"
            showUploadList={false}
          >
            {avatarUrl ? (
              <img alt="your avatar" className="Avatar" src={avatarUrl} />
            ) : (
              <div>
                <Icon type="plus" />
                <div className="ant-upload-text">Add new avatar</div>
              </div>
            )}
          </StyledUpload>
          {avatarUrl && (<div className="text-centered">
            <StyledButton onClick={this.removeAvatar} type="primary">
              <div className="small-btn">DELETE AVATAR</div>
            </StyledButton>
          </div>)}
          <style jsx>{`
          .Avatar {
            width: 100px;
            height: 100px;
          }
          {/* .small-btn {
            font-size: 11px;
          } */}
          `}</style>
        </React.Fragment>
      }
      </div>
    )
  }
}

export {AvatarUpload}
