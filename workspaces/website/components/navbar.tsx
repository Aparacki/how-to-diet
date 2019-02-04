import {UI} from '@shared/config'
import {Store} from '@website/types'
import {observable} from 'mobx'
import {inject, observer} from 'mobx-react'
import * as React from 'react'
import {hot} from 'react-hot-loader'
import * as Router from 'react-router-dom'
import * as fns from 'date-fns'

interface Props {
  store?: Store
  guest?: boolean
}

@hot(module)
@inject('store')
@observer
class Navbar extends React.Component<Props> {

  componentDidMount() {
    // console.log(this.props.store.productStore.lookInDate)
  }

  render() {
    const {getLookInDate, addDateToUpdate, changeLookInDateByDay} = this.props.store.productStore


    return (
      <React.Fragment>
      <button onClick={() => {changeLookInDateByDay(-1)}}>prev</button>
      <button onClick={() => {changeLookInDateByDay(1)}}>next</button>
      <button onClick={addDateToUpdate}>change eaten products</button>
        {getLookInDate()}
      </React.Fragment>
    )}}

export {Navbar}
