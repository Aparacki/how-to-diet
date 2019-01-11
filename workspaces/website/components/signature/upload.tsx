import {Store} from '@website/types'
import {syncanoUrl} from '@website/utils/syncano'
import {Icon, message, Modal, Spin, Upload} from 'antd'
import {observable} from 'mobx'
import {inject, observer} from 'mobx-react'
import * as React from 'react'
import * as Router from 'react-router-dom'

interface Props {
  store?: Store,
}

interface State {
  fileList: Array<any>
  loading: boolean
}

@inject('store')
@observer
class SignatureUploadForm extends React.Component<Props, State> {
  @observable previewVisible: boolean
  @observable previewImage: ''
  @observable uploadActionUrl: string
  constructor(props: any) {
    super(props)
    this.state = {
      fileList: [],
      loading: false,
    }
  }

  async componentDidMount() {
    this.setState({loading: true})
    await this.props.store.userStore.getSignatures()
    this.setState({
      fileList: this.props.store.userStore.mapSignaturesToFileList(),
      loading: false,
    })

    this.uploadActionUrl = syncanoUrl(`signature/upload`)
  }

  handleCancel = () => this.previewVisible = false

  handlePreview = (file) => {
    this.previewImage = file.url || file.thumbUrl,
    this.previewVisible = true
  }

  private get isLoggedIn(): boolean {
    return this.props.store.userStore.isLoggedIn
  }

  handleChange = ({file, fileList}) => {
    if (file.status === 'done') {
      this.props.store.userStore.addSignatureToStore(file.response.signature)
      this.setState({fileList: this.props.store.userStore.mapSignaturesToFileList()})
      message.success(`${file.name} image loaded successfully`)
    } else if (status === 'error') {
      message.error(`${file.name} image upload failed.`)
    }
    this.setState({fileList})
  }

  handleRemove = (file) => {
    // if file is just added its id will be string created by antd
    // and we must take id from response.signature to send it to socket,
    // which is not valid if we take signature in ComponentDidMount
    if (file.response) {
      this.props.store.userStore.removeSignature(file.response.signature.id)
    } else {
      this.props.store.userStore.removeSignature(file.uid)
    }
  }

  render() {
    const {fileList, loading} = this.state
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Add new signature</div>
      </div>
    )
    if (!this.isLoggedIn) {
      return <Router.Redirect to="/" />
    }

    return (
      <div className="clearfix">
      {loading ?
        <Spin />
        :
        <React.Fragment>
          <Upload
            action={this.uploadActionUrl}
            listType="picture-card"
            data={file => ({filename: file.name, file, filetype: file.type})}
            fileList={fileList}
            onPreview={this.handlePreview}
            onChange={this.handleChange}
            onRemove={this.handleRemove}
          >
            {fileList.length >= 10 ? null : uploadButton}
          </Upload>
          <Modal visible={this.previewVisible} footer={null} onCancel={this.handleCancel}>
            <img alt="your signature" className="Signature" src={this.previewImage} />
          </Modal>
          <style jsx>{`
          .Signature {
            width: 100%;
          }
          `}</style>
        </React.Fragment>
      }
    </div>
    )}}

export {SignatureUploadForm}
