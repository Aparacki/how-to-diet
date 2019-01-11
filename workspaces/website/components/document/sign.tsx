import {Spinner} from '@shared/components'
import {SignatureSource} from '@website/components'
import {Store} from '@website/types'
import {SignatureModel} from '@website/types/signature'
import {SignatureUploadUrl} from '@website/utils/url-helper'
import {Button, Icon, Upload} from 'antd'
import {inject, observer} from 'mobx-react'
import * as React from 'react'
import {hot} from 'react-hot-loader'
import {Heading} from '../invitation/styled'

interface Props {
  signatures: Array<SignatureModel>
  store?: Store
}

@hot(module)
@inject('store')
@observer
class DocumentSign extends React.Component<Props> {

  // signatureUpload = this.props.store.signStore.invitationKey ?
  //   `${SignatureUploadUrl}key=${this.props.store.signStore.invitationKey}`
  //   : SignatureUploadUrl

  signatureUpload = SignatureUploadUrl

  handleChange = ({file}) => {
    if (file.status === 'uploading') {
      this.props.store.signStore.setUploadingSignature(true)
    }
    if (file.status === 'done') {
      this.props.store.signStore.setUploadingSignature(false)
      this.props.store.signStore.fetchSignatures()
      this.props.store.userStore.getSignatures()
    }
  }
  // tslint:disable-next-line:no-empty
  handleStop({}: any) {}
  // tslint:disable-next-line:no-empty
  handleDrop({}: any, {}: any) {}
  render() {
    return (
      <section className="Document">
        <Heading>SIGN</Heading>
        <div className="Document__signatures">
          {this.props.signatures.map((item, index) => (
            <div key={index} className="Document__signature">
              <SignatureSource
                name="Signer name"
                width={item.width}
                height={item.height}
                id={item.id}
                file={item.file}
              />
            </div>
          ))}
        </div>
        <div>
          {this.props.store.signStore.uploadingSignature ? <div><Spinner/></div> : null}
          <Upload
            action={this.signatureUpload}
            data={file => ({
              filename: file.name,
              file,
              filetype: file.type,
              key: new URL(location.href).searchParams.get('key'),
            })}
            onChange={this.handleChange}
            showUploadList={false}>
            <Button>
              <Icon type="upload"/> Upload new signature
            </Button>
          </Upload>
        </div>
        <div className="u-ta-c u-mt">
          <Button
            loading={this.props.store.signStore.pending}
            onClick={this.props.store.signStore.sign}
            type="primary"
            disabled={this.props.store.documentStore.document.status === 'uploaded'}
          >
            SIGN DOCUMENT
          </Button>
        </div>
        <style jsx>{`
          .Document__pages {
            margin: 80px 0 80px 215px;
            max-width: 1000px;
          }
          .Document__sign {
            padding: 15px;
            text-align: center;
          }
          .Document__signature {
            border: 1px solid rgba(23, 21, 21, 0.5);
            max-width: 100px;
            margin-right: 15px;
            margin-bottom: 30px;
          }
          .Document__signatures {
            display: flex;
            width: 100%;
            flex-wrap: wrap;
          }
        `}</style>
      </section>
    )
  }
}
export {DocumentSign}
