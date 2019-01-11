import {Signature} from '@website/components'
import {observer} from 'mobx-react'
import * as React from 'react'
import {
  DropTarget,
  DropTargetCollector,
  IDropTargetConnector,
  IDropTargetMonitor,
  JsxWrapper
} from 'react-dnd'
import {hot} from 'react-hot-loader'
import ItemTypes from '../signature/itemTypes'

export interface CollectedProps {
  id: number,
  isOver?: boolean,
  canDrop?: boolean,
  onDrop?: any,
  connectDropTarget?: JsxWrapper
}

const collect: DropTargetCollector<CollectedProps> = (
  connect: IDropTargetConnector,
  monitor: IDropTargetMonitor
) => {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: !!monitor.isOver(),
    canDrop: !!monitor.canDrop(),
  }
}

const pageTarget = {
  drop(props: any, monitor: any) {
    props.data.addSignature(monitor.getItem().props)
    props.onDrop(monitor.getItem().props)
  },
}

export interface PageProps extends CollectedProps {
  data: any
}

@DropTarget(ItemTypes.SIGNATURE, pageTarget, collect)
@hot(module)
@observer
class DocumentPage extends React.Component<PageProps> {
  private renderPage

  render() {
    const {connectDropTarget} = this.props
    const pageContent = this.props.data

    return connectDropTarget(
      <div className="Page" >
        {pageContent.signatures.map((item, index) => {
          return <Signature
            key={index}
            signature={item}
            parentWidth={pageContent.width}
            parentHeight={pageContent.height}
            page={pageContent}
            renderPage={this.renderPage}
          />
        })}

        <img className="Page__content" src={this.props.data.file} ref={(e: any) => this.renderPage = e}/>

         <style jsx>{`
          .Page {
            max-width: 100%;
            overflow: hidden;
            margin: 0 auto 30px;
            box-shadow:
              0 4px 8px 0 rgba(0,0,0,0.12),
              0 2px 4px 0 rgba(0,0,0,0.08);
          }
          .Page__content {
            display: block;
            width: 100%;
            margin-bottom: 15px;
          }
        `}</style>
      </div>
    )
  }
}
export {DocumentPage}
