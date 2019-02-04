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
    const categories = ['meat', 'fish', 'nuts', 'vegetables', 'fruits', 'grain', 'pods', 'others']
    const food = {
      'meat': ['beef,chicken,lamb,pork,turkey'],
      'nuts': ['', 'Almond,sunflower seed', 'peanut,pecan nut,sesame,pumpkin', 'hazelnut,walnut'],
      'grain': ['barley,oat,rye,', 'amaranth,gluten,rice,spelled wheat', 'wheat'],
      'pods': ['kidney,bean jaspe, corn, lentil, peas', 'pinto bean, soya,', '', 'green beans'],
      'vegetables': ['avocado,garlic,mushroom,olive,batata,potato', 'beet,carrot,lettuce,onion,pepper,radish,spinache,courgette', 'broccoli,cabbage,cauliflower,celery,cucumber,tomato'],
      'fruits': ['apple,morel,banana,cranberry,grape,lemon,papaya,peach,pear,pineapple,plum,raspberry,Strawberry'],
      'others': ['cacao,coffie', 'honey,baker yeast,beer yeast', '', 'coconut'],
    }
    // await this.props.store.documentStore.createCategories(categories)
    // await this.props.store.documentStore.cr[eateProducts(food)
    this.isLoading = false
  }

  render() {

    return (
        <div />
    )
  }
}

export default Table
