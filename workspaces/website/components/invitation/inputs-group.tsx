import {Store} from '@website/types'
import {validateEmail, validateIsNotEmpty} from '@website/utils/validators'
import {Col, Input} from 'antd'
import {inject, observer} from 'mobx-react'
import * as React from 'react'
import {StyledButton, StyledIcon} from './styled'

interface Props {
  store?: Store,
  inputId?: number,
  invited?: any
}

@inject('store')
@observer
class InviteInputsGroup extends React.Component<Props> {
  render() {
    const {invited} = this.props

    return (
      <div className="Invitation">
        <React.Fragment>
          <Input.Group compact>
            <Col span={9}>
              <div className={invited.email.isInvalidAndValidated() ? 'has-error' : ''}>
                <Input className="ant-input"
                  placeholder="Email"
                  onChange={e => invited.email.onChange(e.target.value)}
                  onBlur={() => invited.email.validate(validateEmail)}
                  value={invited.email.value} />
                {invited.email.isValidated() && !invited.email.isValid() ?
                  <div className="ant-form-explain">The input is not valid email</div>
                  :
                  null
                }
              </div>
            </Col>
            <Col span={7}>
              <div className={invited.firstName.isInvalidAndValidated() ? 'has-error' : ''}>
                <Input placeholder="First Name"
                  onChange={e => invited.firstName.onChange(e.target.value)}
                  onBlur={() => invited.firstName.validate(validateIsNotEmpty)}
                  value={invited.firstName.value} />
                {invited.firstName.isValidated() && !invited.firstName.isValid() ?
                  <div className="ant-form-explain">First name is required</div>
                  :
                  null
                }
              </div>
            </Col>
            <Col span={7}>
              <div className={invited.lastName.isInvalidAndValidated() ? 'has-error' : ''}>
                <Input placeholder="Surname"
                  onChange={e => invited.lastName.onChange(e.target.value)}
                  onBlur={() => invited.lastName.validate(validateIsNotEmpty)}
                  value={invited.lastName.value} />
                {invited.lastName.isValidated() && !invited.lastName.isValid() ?
                  <div className="ant-form-explain">Last name is required</div>
                  :
                  null
                }
              </div>
            </Col>
            <Col span={1}>
              {this.props.store.documentStore.invitationsInputs.length >= 1 ?
                <StyledButton
                  onClick={() => this.props.store.documentStore.removeSignatory(this.props.inputId)}>
                  <StyledIcon type="delete" />
                </StyledButton>
                :
                ''
              }
            </Col>
          </Input.Group>
        </React.Fragment>
        <style jsx>{`
        .Invitation {
          margin-bottom: 10px;
        }
        :global(.ant-form-explain) {
          font-size: 9px;
        }
      `}</style>
      </div>
    )
  }
}

export default InviteInputsGroup
