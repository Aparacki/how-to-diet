import {Store} from '@website/types'
import {inject, observer} from 'mobx-react'
import * as React from 'react'
import {hot} from 'react-hot-loader'

interface Props {
  id: string
  store?: Store
}

@hot(module)
@inject('store')
@observer
class DocumentPreview extends React.Component<Props> {
  componentWillMount() {
    this.props.store.signStore.setDocumentId(
      parseInt(this.props.id, 10)
    )
    this.props.store.signStore.fetch()
  }
  render() {
    return (
        <React.Fragment>
          {this.props.store.signStore.pages.map((item, index) => {
            return (
              <img key={index} className="Page__content" src={item.file} />
            )
          })}
          <style jsx>{`
            .Page__content {
              display: block;
              max-width: 100%;
              width: 100%;
              margin: 15px 0;
              box-shadow:
                0 4px 8px 0 rgba(0,0,0,0.12),
                0 2px 4px 0 rgba(0,0,0,0.08);
            }
          `}</style>
        </React.Fragment>
    )
  }
}
export {DocumentPreview}
