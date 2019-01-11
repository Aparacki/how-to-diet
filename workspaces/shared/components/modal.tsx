import {UI} from '@shared/config.tsx'
import {Store} from '@website/types'
import {inject, observer} from 'mobx-react'
import * as React from 'react'

export interface Props {
  store?: Store
  name?: string
  title?: string
  subtitle?: string
  component?: React.ComponentType
  children?: React.ReactChild
}

@inject('store')
@observer
class Modal extends React.Component<Props> {
  render() {
    const {modal} = this.props.store
    const {name, title, subtitle, children, component: Component} = this.props

    if (modal.active !== name) {
      return null
    }

    return (
      <div className={`Modal is-visible`}>
        <div className="Modal__bg" onClick={modal.close} />
        <div className="Modal__inner">
          <div className="Modal__close" onClick={modal.close}>
              <svg aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                {/* tslint:disable-next-line:max-line-length */}
                <path fill="currentColor" d="M231.6 256l130.1-130.1c4.7-4.7 4.7-12.3 0-17l-22.6-22.6c-4.7-4.7-12.3-4.7-17 0L192 216.4 61.9 86.3c-4.7-4.7-12.3-4.7-17 0l-22.6 22.6c-4.7 4.7-4.7 12.3 0 17L152.4 256 22.3 386.1c-4.7 4.7-4.7 12.3 0 17l22.6 22.6c4.7 4.7 12.3 4.7 17 0L192 295.6l130.1 130.1c4.7 4.7 12.3 4.7 17 0l22.6-22.6c4.7-4.7 4.7-12.3 0-17L231.6 256z" />
              </svg>
            </div>
          <div className="Modal__content">
            {title && (
              <h3 className="Modal__title">{title}</h3>
            )}
            {subtitle && (
              <p className="Modal__subtitle">{subtitle}</p>
            )}
            {children || <Component />}
          </div>
        </div>

        <style jsx>{`
          .Modal {
            position: fixed;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            will-change: visibility, opacity;
            transition-duration: 0.25s;
            transition-property: visibility, opacity;
            z-index: 1000;
            opacity: 0;
            visibility: hidden;
          }

          .Modal.is-visible {
            opacity: 1;
            visibility: visible;
            overflow: auto;
          }

          .Modal__bg {
            right: 0;
            left: 0;
            top: 0;
            bottom: 0;
            position: fixed;
            z-index: -1;
            cursor: pointer;
            background: linear-gradient(to bottom,#000,#333);
            opacity: .9;
          }

          .Modal__inner {
            display: flex;
            position: relative;
            min-height: 100%;
            box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.15);
            min-width:${UI.width.sm};
            margin:auto;
            background-color: #ffffff;
            box-shadow: 0 2px 30px rgba(0,0,0,.5);
          }

          .Modal__content {
            margin: auto;
            color: #868686;
            padding-top: 40px;
            padding-bottom: 20px;
            max-width: 390px;
            position: relative;
            will-change: transform, opacity;
            transform: rotate3d(1, 1, 0, -15deg);
            transform-origin: 100% 0;
            flex-grow: 1;
            transition-duration: 0.25s;
            transition-property: transform;

          }

          .is-visible .Modal__content {
            transform: none;
          }

          .Modal__close {
            color: black;
            position: absolute;
            top: 30px;
            right: 30px;
            transition: color 0.25s;
            display: flex;
            align-items: center;
            cursor: pointer;
            position: absolute;
            z-index: 2;
          }

          .Modal__close svg {
            height: 15px;
            width: 15px;
          }

          .Modal__close:hover {
            color: #aaa;
          }

          .Modal__title {
            font-size: 20px;
            color: #171b21;
            margin-bottom: 30px;
            line-height: 28px;
            text-align: center;
            text-transform:uppercase;
          }

          .Modal__subtitle {
            font-size: 16px;
            max-width: 320px;
            margin-left: auto;
            margin-right: auto;
            text-align: center;
          }

          @media screen and (min-width: ${UI.width.l}) {
            .Modal {
              display: flex;
              align-items: center;
              justify-content: center;
              padding-top: 16px;
              padding-bottom: 16px;
            }

            .Modal__inner {
              min-height: 0;
            }

            .Modal__content {
              border-radius: 5px;
            }
          }
          @media screen and (max-width: ${UI.width.l}) {
            .Modal__inner {
              min-width: inherit;
            }
          }
          @media screen and (max-width: ${UI.width.sm}) {
            .Modal__content {
              padding-left: 5px;
              padding-right: 5px;
            }
            .Modal__close {
              top: 20px;
              right: 15px;
            }
          }
          @media screen and (max-width: ${UI.width.xs}) {
            .Modal__content {
              padding-left: 0px;
              padding-right: 0px;
            }
          }
        `}</style>
      </div>
    )
  }
}

export {Modal}
