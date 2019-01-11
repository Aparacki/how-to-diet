import * as React from 'react'
import {
  DragSource,
  DragSourceCollector,
  IDragSourceConnector,
  IDragSourceMonitor,
  JsxWrapper
} from 'react-dnd'
import {hot} from 'react-hot-loader'
import ItemTypes from './itemTypes'

export interface SignatureProps {
  connectDragSource?: JsxWrapper
  connectDragPreview?: JsxWrapper
  isDragging?: boolean
  file?: string
  name?: string
  id?: number
  width?: number
  height?: number
}

const collect: DragSourceCollector<SignatureProps> = (
  connect: IDragSourceConnector,
  monitor: IDragSourceMonitor
) => ({
  connectDragSource: connect.dragSource(),
  connectDragPreview: connect.dragPreview(),
  isDragging: monitor.isDragging(),
})

const boxSource = {
  beginDrag(props: any) {
    return {
      props,
    }
  },
  endDrag({}: any, monitor?: any) {
    monitor.getDropResult()
  },
}

@hot(module)
@DragSource(ItemTypes.SIGNATURE, boxSource, collect)
class SignatureSource extends React.Component<SignatureProps> {
  render() {
    const {connectDragSource} = this.props

    return connectDragSource(
      <div>
        <img className="Signature" src={this.props.file} />
        <style jsx>{`
          .Signature {
            display: block;
            width: 100%;
            cursor: move;
          }
        `}</style>
      </div>
    )
  }
}

export {SignatureSource}
