import {AvatarUpload} from '@website/components'
import {Store} from '@website/types'
import {Alert, Button, Form, Input, message, Spin} from 'antd'
import {observable} from 'mobx'
import {inject, observer} from 'mobx-react'
import * as React from 'react'
import {FormContainer, FormContainerAvatar, FormContainerFlex} from './styled'

interface Props {
  store?: Store,
  form: any
}

const FormItem = Form.Item

@inject('store')
@observer
class ProfileEditForm extends React.Component<Props> {
  @observable formSubmitted: boolean
  @observable firstName: string
  @observable lastName: string
  @observable loading: boolean
  @observable avatar: any
  async componentDidMount() {
    this.formSubmitted = false
    this.loading = true
    await this.props.store.userStore.fetchProfile()
    this.firstName = this.props.store.userStore.profile.firstName
    this.lastName = this.props.store.userStore.profile.lastName
    this.loading = false
  }

  handleSubmit = (e) => {
    e.preventDefault()
    try {
      this.props.store.userStore.updateProfile({firstName: this.firstName, lastName: this.lastName})
      this.formSubmitted = true
    } catch (error) {
      message.error(`Something went wrong. Please retry.`)
    }
  }

  changeLastName = (newValue: string) => {
    this.lastName = newValue
    this.formSubmitted = false
  }

  changeFirstName = (newValue: string) => {
    this.firstName = newValue
    this.formSubmitted = false
  }

  render() {
    const {getFieldDecorator} = this.props.form
    const formItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 8},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 16},
      },
    }
    const buttonForm = {
      labelCol: {
        sm: {span: 8},
      },
      wrapperCol: {
        sm: {span: 16, offset: 8},
      },
    }

    if (this.loading) {
      return <Spin />
    }

    return (
      <React.Fragment>
        <h2 className="u-mb text-centered">PROFILE FORM</h2>
        <FormContainerFlex>
          <FormContainer>
            {this.formSubmitted && (
              <Alert message="Profile updated" type="success" showIcon />
            )}
            <Form onSubmit={this.handleSubmit}>
            <FormItem {...formItemLayout} label="First Name">
              {getFieldDecorator('firstName', {
                initialValue: [this.firstName],
                rules: [{required: true, message: 'Please enter your first name', whitespace: true}],
              })(
                <Input onChange={e => this.changeFirstName(e.target.value)}/>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="Last Name">
              {getFieldDecorator('lastName', {
                initialValue: [this.lastName],
                rules: [{required: true, message: 'Please enter your last name', whitespace: true}],
              })(
                <Input onChange={e => this.changeLastName(e.target.value)}/>
              )}
              </FormItem>
            <FormItem {...formItemLayout} label="E-mail" >
              {getFieldDecorator('email', {
                initialValue: [this.props.store.userStore.profile.username],
                rules: [{
                  type: 'email', message: 'This is not a valid e-mail',
                }, {
                  required: true, message: 'Please enter your e-mail',
                }],
              })(
                <Input disabled={true}/>
              )}
            </FormItem>
            <FormItem {...buttonForm}>
              <div className="text-centered">
                <Button type="primary" htmlType="submit">SAVE</Button>
              </div>
            </FormItem>
            </Form>
          </FormContainer>
          <FormContainerAvatar>
            <AvatarUpload />
          </FormContainerAvatar>
        </FormContainerFlex>
      </React.Fragment>
    )
  }
}

const ProfileEdit = Form.create()(ProfileEditForm)
export {ProfileEdit}
