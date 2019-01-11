import {STATUS_DECLINED, STATUS_INVITED, STATUS_SIGNED} from '@website/constants'
import {Store} from '@website/types'
import {Spin} from 'antd'
import {observable} from 'mobx'
import {inject, observer} from 'mobx-react'
import * as React from 'react'
import * as Router from 'react-router-dom'

interface Props {
  store?: Store
}

@inject('store')
@observer
class InvitationList extends React.Component<Props> {
  @observable loading: boolean

  async componentDidMount() {
    this.loading = true
    await this.props.store.userStore.getAllInvitations()
    this.loading = false
  }

  returnAction = (invite: any) => {
    const signUrl = `/document/sign/${invite.document.id}`
    const previewUrl = `/document/preview/${invite.document.id}`

    return {
      [STATUS_INVITED]: <Router.Link to={signUrl}>{this.actionDescription(invite.status)}</Router.Link>,
      [STATUS_SIGNED]: <Router.Link to={previewUrl}>{this.actionDescription(invite.status)}</Router.Link>,
    }[invite.status] || ''
  }

  actionDescription = (status: string) => {
    return {
      [STATUS_INVITED]: 'Sign',
      [STATUS_SIGNED]: 'Preview',
      [STATUS_DECLINED]: '',
    }[status] || ''
  }

  statusDecription = (status: string) => {
    return {
      [STATUS_INVITED]: 'We are waiting for your signature',
      [STATUS_SIGNED]: 'You signed this document',
      [STATUS_DECLINED]: 'One or more signatories declined to sign',
    }[status] || ''
  }

  render() {
    if (this.loading) {
      return (
        <Spin />
      )
    }

    return (
      <React.Fragment>
        <div className="Invitations__header">
        <h1>Documents to sign</h1>
        </div>
        <br />
        <br />
        <div className="ant-table-wrapper">
          <table className="Table">
            <thead className="ant-table-thead">
              <tr className="Tr">
                <th className="Th">
                  <span>Document</span>
                </th>
                <th className="Th">
                  <span>Status</span>
                </th>
                <th className="Th Td">
                  <span>Invited by</span>
                </th>
                <th className="Th">
                  <span>Action</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {this.props.store.userStore.invitations.map((item, index) => {
                return (
                  <React.Fragment key={index}>
                    <tr className="ant-table-row  ant-table-row-level-0">
                      <td className="Td">
                        <span className="ant-table-row-indent indent-level-0"/>
                        {item.document.name}
                      </td>
                      <td className="Td">{this.statusDecription(item.status)}</td>
                      <td className="Td">{item.inviter}</td>
                      <td className="Td">
                        {this.returnAction(item)}
                      </td>
                    </tr>
                  </React.Fragment>
              )})}
            </tbody>
          </table>
        </div>
        <style jsx>{`
        .Invitations__header {
          display: flex;
          margin: 30px 0 0;
          justify-content: space-between;
        }
        .Td {
          padding: 16px 16px;
          border-bottom: 1px solid #e8e8e8;
          transition: all .3s;
        }
        .Table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
          text-align: left;
          border-radius: 4px 4px 0 0;
        }
        .Th {
          background: #fafafa;
          transition: background .3s ease;
          text-align: left;
          padding: 15px;
          color: rgba(0, 0, 0, 0.85);
          font-weight: 500;
          border-bottom: 1px solid #e8e8e8;
        }
        .Tr {
          display: table-row;
          vertical-align: inherit;
          border-color: inherit;
        }
        `}</style>
      </React.Fragment>
    )
  }
}

export {InvitationList}
