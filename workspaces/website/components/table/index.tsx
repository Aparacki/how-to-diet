import {Store} from '@website/types'
import {observable} from 'mobx'
import {inject, observer} from 'mobx-react'
import * as React from 'react'
import {hot} from 'react-hot-loader'
import {Actions, Status} from './components'
import {DocumentsTable} from './styled'

const columns = [{
  title: 'NAME OF DOCUMENT',
  dataIndex: 'name',
  key: 'name',
}, {
  title: 'UPLOADED',
  dataIndex: 'createdAt',
  key: 'createdAt',
}, {
  title: 'CREATED BY',
  dataIndex: 'fullName',
  key: 'fullName',
}, {
  title: 'STATUS',
  dataIndex: 'status',
  key: 'status',
  render: (status: string) => <Status status={status}/>,
}, {
  title: 'ACTION',
  dataIndex: 'actions',
  key: 'actions',
  render: (actions: {isAuthor: boolean, status: string, file: string, id: number}) => <Actions {...actions}/>,
}]

interface Props {
  store?: Store,
}

@hot(module)
@inject('store')
@observer
class Table extends React.Component<Props> {
  @observable private isLoading = true

  async componentDidMount() {
    await this.props.store.documentStore.getAllDocuments()
    this.isLoading = false
  }

  render() {
    const {documentsList} = this.props.store.documentStore

    return (
      <DocumentsTable
        loading={this.isLoading}
        dataSource={documentsList}
        columns={columns}
      />
    )
  }
}

export default Table
