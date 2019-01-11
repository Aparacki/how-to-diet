import {STATUS_INVITED, STATUS_SIGNED} from '@website/constants'
import {Store} from '@website/types'
import {Menu} from 'antd'
import {inject, observer} from 'mobx-react'
import * as React from 'react'
import {hot} from 'react-hot-loader'

interface Props {
  store?: Store
}

@hot(module)
@inject('store')
@observer
class FilterBar extends React.Component<Props> {

  handleClick = e => {
    this.props.store.documentStore.setDocumnetFilter(e.key)
  }

  render() {
    const {documentFilter} = this.props.store.documentStore

    return (
      <Menu
        onClick={this.handleClick}
        selectedKeys={[documentFilter]}
        mode="horizontal"
      >
        <Menu.Item key="all">
          All
        </Menu.Item>
        <Menu.Item key="my">
          My documents
        </Menu.Item>
        <Menu.Item key={STATUS_INVITED}>
          Ready to sign
        </Menu.Item>
        <Menu.Item key={STATUS_SIGNED}>
          Completed
        </Menu.Item>
      </Menu>
    )
  }

}

export default FilterBar
