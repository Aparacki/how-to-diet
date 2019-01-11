import {Store} from '@website/types'
import {message} from 'antd'
import {observable} from 'mobx'
import {inject, observer} from 'mobx-react'
import * as React from 'react'
import {RightButton} from './styled-description'

interface Props {
  store: Store
}

@inject('store')
@observer
class DeleteDocument extends React.Component<Props> {
  @observable documentId: number

  componentDidMount() {
    const document = this.props.store.documentStore.document
    this.documentId = document.id
  }

  handleRemove = async () => {
    try {
      await this.props.store.documentStore.removeDocument(this.documentId)
      this.props.store.modal.close()
      location.href = '/'
    } catch (err) {
        message.error(err.response.data.message.detail)
    }
  }

  render() {

    return (
      <React.Fragment>
        <p className="Heading">Are you shure you want to delete this document?</p>
        <div className="Buttons">
          <RightButton type="ghost" onClick={this.props.store.modal.close}>Cancel</RightButton>
          <RightButton type="danger" onClick={this.handleRemove}>Delete</RightButton>
        </div>
        <style jsx> {`
          .Buttons {
            display: flex;
            justify-content: center;
            margin-top:20px;
          }
          .Heading {
            font-family: 'Roboto';
            font-size: 18px;
            text-align: center;
            color: rgba(0, 0, 0, 0.85);
          }
        `}</style>
      </React.Fragment>
    )
  }
}

export {DeleteDocument}
