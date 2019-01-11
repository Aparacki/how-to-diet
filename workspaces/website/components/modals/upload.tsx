import {Textarea} from '@shared/components'
import {Store} from '@website/types'
import {Icon, message} from 'antd'
import {UploadChangeParam} from 'antd/lib/upload'
import {observable} from 'mobx'
import {inject, observer} from 'mobx-react'
import * as React from 'react'
import {hot} from 'react-hot-loader'
import {ModalButton, ModalDragger} from './styled-upload'

interface Props {
  store?: Store,
}

@hot(module)
@inject('store')
@observer
class DocumentUpload extends React.Component<Props> {
  @observable private isDisabled = false
  @observable private isLoading = false

  private form = this.props.store.formStore.add('Upload', {
    file: {
      type: 'file',
    },
    description: {
      type: 'text',
    },
  })

  componentWillUnmount() {
    this.form.clear()
  }

  onChange = ({file}: UploadChangeParam) => {
    if (file.status === 'done') {
      message.success(`${file.name} file loaded successfully.`)
    } else if (file.status === 'error') {
      message.error(`${file.name} file upload failed.`)
    } else if (file.status === 'removed') {
      this.isDisabled = false
    }
  }

  handlerRequest = ({onSuccess, file}: any) => {
    this.form.handleChange('file', file)
    this.isDisabled = true
    setTimeout(() => {
      onSuccess(null, file)
    }, 100)
  }

  handleUploadDocument = async () => {
    this.isLoading = true

    try {
      await this.props.store.documentStore.uploadDocument(this.form.data)
      message.success(`File upload successfully.`)
    } catch (err) {
      message.error(`File upload failed.`)
    } finally {
      this.isLoading = false
      this.props.store.modal.close()
    }
  }

  render() {
    return (
      <React.Fragment>
        <ModalDragger
          accept={'application/pdf'}
          data={file => ({filename: file.name, file, filetype: file.type})}
          multiple={false}
          disabled={this.isDisabled}
          customRequest={this.handlerRequest}
          onChange={this.onChange}
        >
          <p className="ant-upload-drag-icon">
            <Icon type="inbox" />
          </p>
          <p className="ant-upload-text">Click or drag document to this area to upload</p>
          <p className="ant-upload-hint">We accept only PDF files.</p>
        </ModalDragger>
        <strong className="Desc__title">Description:</strong>
        <p className="Desc">
          Add short description so anyone you invite will know what your document is - this will end up in the
          email invitation. You can edit it in next step.</p>
        <div className="Textarea_modal">
          <Textarea
            rows={3}
            name={'description'}
            value={this.form.value('description')}
            {...this.form.field('description')}
          />
        </div>
        <div className="Buttons">
          <ModalButton onClick={this.props.store.modal.close}>Cancel</ModalButton>
          <ModalButton
            disabled={!this.isDisabled}
            loading={this.isLoading}
            type="primary"
            onClick={this.handleUploadDocument}>Create</ModalButton>
        </div>

        <style jsx> {`
        .Textarea_modal {
          margin: auto;
        }
        .Desc {
          margin-bottom: 1.5em;
          font-weight: 300;
          font-size: 12px;
        }
        .Desc__title{
          font-weight: 500;
          color:#000;
        }
        .Buttons {
          margin-top:20px;
          text-align: center;
        }
        `}</style>
      </React.Fragment>
    )}
}

export  {DocumentUpload}
