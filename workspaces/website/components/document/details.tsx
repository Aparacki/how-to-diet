import {RowNoWrap} from '@website/components/document/styled-details'
import {Store} from '@website/types'
import {Col, Row} from 'antd'
import {Icon, Spin} from 'antd'
import Button from 'antd/lib/button/button'
import {inject, observer} from 'mobx-react'
import * as React from 'react'

interface Props {
  store?: Store,
  document: any
}

@inject('store')
@observer
class DocumentDetails extends React.Component<Props> {

  get isAuthor() {
    return this.props.store.documentStore.document.isAuthor
  }

  render() {
    const iconStyle = {
      fontSize: '16px',
      cursor: 'pointer',
    }

    const modal = this.props.store.modal
    const {document} = this.props
    const documentCreatedAt = document.createdAt.split('T')[0]

    return document ? (
      <React.Fragment>
        <React.Fragment>
          <RowNoWrap type="flex" justify="space-between">
            <Col span={18}>
              <p className="Document__name">{document.name}</p>
            </Col>
            <Col span={4}>
              {document.status === 'uploaded' && this.isAuthor() && (
                <Button type="danger" onClick={() => modal.open('deleteDocument')}>Delete</Button>
              )}
            </Col>
          </RowNoWrap>
          <Row type="flex">
            <p className="Document__creation__date">{documentCreatedAt}</p>
          </Row>
          <Row>
            <div className="u-mv- flexContainer">
              <div className="description_text">Description: </div>
              {document.status === 'uploaded' && this.isAuthor() && (
                <span className="Document__icon">
                  <Icon type="edit" style={iconStyle} onClick={() => modal.open('description')} />
                </span>
              )}
            </div>
            <p>{document.description}</p>
          </Row>
        </React.Fragment>
        <style jsx>{`
          :global(.Backlink) {
            color: #333;
          }
          :global(.accepted) {
            color: green;
            display: inline-block;
            margin-right: 10px;
          }

          :global(.declined) {
            color: red;
            display: inline-block;
            margin-right: 10px;
          }
          .description_text {
            font-size: 14px;
            font-weight: 500;
            color: black;
            line-height: 22px;
          }

          .Document__icon {
            margin-left: 7px;
          }

          .Document__name {
            font-family: 'PingFang SC', 'Roboto', 'Arial';
            font-size: 20px;
            line-height: 28px;
            color: rgba(0, 0, 0, 0.85);

          }
          .Document__creation__date {
            font-family: Roboto;
            font-size: 14px;
            padding-top: 10px;
            color: rgba(0, 0, 0, 0.5);
          }

          .Details__list {
            list-style-type: none;
            margin: 30px 0;
          }

          .Details__list li {
            margin: 15px 0;
            padding: 0;
          }
          .flexContainer {
            display: flex;
          }

        `}</style>
      </React.Fragment>
    ) : (<Spin />)
  }
}

export {DocumentDetails}
