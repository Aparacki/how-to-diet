import {RowNoWrap} from '@website/components/document/styled-details'
import {Store} from '@website/types'
// import {Col, Row} from 'antd'
// import {Icon, Spin} from 'antd'
import Button from 'antd/lib/button/button'
import {inject, observer} from 'mobx-react'
import * as React from 'react'

interface Props {
  store?: Store,
  // document: any
}

@inject('store')
@observer
class HomeProduct extends React.Component<Props> {

  async componentDidMount() {
    const {productStore} = this.props.store
    await productStore.fetchAll()
    await console.log(productStore.getEatenProductByDate('13/1/2019'))
  }
  render() {
    const {productStore} = this.props.store

    return(
      <React.Fragment>
        <React.Fragment>

        </React.Fragment>
        <style jsx>{`
          :global(.Backlink) {
            color: #333;
          }
          .flexContainer {
            display: flex;
          }
        `}</style>
      </React.Fragment>
    )
  }
}

export {HomeProduct}
