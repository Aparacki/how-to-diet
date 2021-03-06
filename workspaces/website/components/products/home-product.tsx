import {RowNoWrap} from '@website/components/document/styled-details'
import {Store} from '@website/types'
// import {Col, Row} from 'antd'
import {Icon, Spin} from 'antd'
import Button from 'antd/lib/button/button'
import {inject, observer} from 'mobx-react'
import * as React from 'react'
import itemTypes from '../signature/itemTypes';
import { observable } from 'mobx';

interface Props {
  store?: Store,
  // document: any
}

@inject('store')
@observer
class HomeProduct extends React.Component<Props> {
@observable eatenProducts

  async componentDidMount() {
    const {productStore} = this.props.store
    await productStore.fetchAll()
  }

  renderProducts() {
    const {getProductParams, toggleProduct, getTimes} = this.props.store.productStore
    // return this.eatenProducts = getEatenProductByDate().map((item) => {
    //   return <li key={item.id} onClick={() => {{toggleProduct(item.id)}}}>{item.name}</li>
    // })
    return getTimes().product.map((item) => {
      const product = getProductParams(item)
      return <li key={item} onClick={() => {{toggleProduct(item)}}}>{product.name}</li>
    })
  }

  render() {
    const {products} = this.props.store.productStore

    return products.length ? (
      <React.Fragment>
        <React.Fragment>
          <ul>
          {this.renderProducts()}
          </ul>
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
     ) : <Spin />
  }
}

export {HomeProduct}
