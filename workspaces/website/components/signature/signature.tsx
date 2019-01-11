import {DocumentPage, SignatureModel} from '@website/types'
import {observer} from 'mobx-react'
import * as React from 'react'
import {hot} from 'react-hot-loader'
import Rnd from 'react-rnd'

interface Props {
  signature: SignatureModel
  parentWidth?: number
  parentHeight?: number
  page?: DocumentPage
  renderPage: any
}

@hot(module)
@observer
class Signature extends React.Component<Props> {
  private readonly maxWidth = this.props.renderPage.clientWidth / 2

  componentDidMount() {
    if (this.maxWidth < this.props.signature.width) {
      this.props.signature.setSize(
        this.props.renderPage.clientWidth / 2,
        this.maxWidth * this.ratio
      )
    }

    this.props.signature.setPageSize(
      this.props.renderPage.clientWidth,
      this.props.renderPage.clientHeight
    )
  }

  handleResize = ({}, {}, ref: any, {}, position?: any) => {
    this.props.signature.setSize(ref.offsetWidth, ref.offsetHeight)
    this.props.signature.setPosition(position.x, position.y)
  }

  handleDrag = ({}, d: any) => {
    this.props.signature.setPosition(d.x, d.y)
  }

  get ratio() {
    return this.props.signature.height / this.props.signature.width
  }

  render() {
    const style = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(255, 255, 0, 0.3)',
      border: '1px solid #000',
    }

    const signature = this.props.signature
    const {coordinates, size} = signature

    return (
      <Rnd
        className="Signature__wrapper"
        style={style}
        size={size}
        position={coordinates}
        lockAspectRatio={true}
        maxWidth={this.maxWidth}
        maxHeight={this.maxWidth * this.ratio}
        onDragStop={this.handleDrag}
        onResize={this.handleResize}
        bounds="parent"
      >
        <div className="Signature__wrapper">
          <img className="Signature" src={signature.file} />
          <a
            onClick={this.props.signature.remove}
            className="Signature__remove"
          >
            &times;
          </a>
        </div>
        <style jsx>{`
          .Signature {
            display: block;
            width: 100%;
            cursor: pointer;
            pointer-events: none;
            position: relative;
          }
          .Signature__remove {
            opacity: 0;
            transition: all 0.1s ease-in;
            position: absolute;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            text-transform: uppercase;
            width: 28px;
            height: 28px;
            border-radius: 50%;
            font-size: 12px;
            top: -14px;
            right: -14px;
            z-index: 100;
            background: #333;
            color: #fff;
            border: none;
            outline: none;
          }
          .Signature__wrapper:hover .Signature__remove {
              opacity: .5;
          }
          .Signature__remove:hover {
            background: #a40802;
            opacity: 1 !important;
          }
        `}</style>
      </Rnd>
    )
  }
}
export {Signature}
