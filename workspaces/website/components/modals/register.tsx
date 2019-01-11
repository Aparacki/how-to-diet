import {InputList} from '@shared/components'
import {UI} from '@shared/config'
import {isEmail} from '@shared/utils/is-email'
import {FormContainer, HeaderContainer, Nav, Split} from '@website/pages/auth/styled'
import {Store} from '@website/types'
// import {as} from '@website/utils/as'
import {Button, Form, Icon, Input} from 'antd'
import {inject, observer} from 'mobx-react'
import * as React from 'react'
// import {Redirect} from 'react-router-dom'

const FormItem = Form.Item

interface Props  {
  store?: Store
}

@inject('store')
@observer
class Register extends React.Component<Props> {
  private readonly form = this.props.store.formStore.add('Register', {
    username: {
      autoFocus: true,
      placeholder: 'Email',
    },
    firstName: {
      placeholder: 'Name',
      type: 'text',
    },
    lastName: {
      placeholder: 'Surname',
      type: 'text',
    },
    password: {
      type: 'password',
    },
    confirmPassword: {
      placeholder: 'Confirm password',
      type: 'password',
    },
  })

  render() {
    const {modal} = this.props.store

    return (
      <div className="Login">
        <HeaderContainer>
          <h1 className="u-mb- Login__logo">Digital Sign</h1>
          <h3 className="u-mb">The easiest way to sign and manage your documents</h3>
        </HeaderContainer>
        <Nav>
          <button
            className={modal.active === 'login' ? 'active' : ''}
            onClick={() => modal.open('login')}
          >
            LOG IN
          </button>
          <button
            className={modal.active === 'register' ? 'active' : ''}
            onClick={() => modal.open('register')}
          >
            REGISTER
          </button>
        </Nav>
        <FormContainer>
          <Form onSubmit={this.handleSubmit}>
            <InputList errors={this.form.errors.all}>
              <Input
                size="large"
                prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}} />}
                value={this.form.value('username')}
                {...this.form.field('username')}
              />
              <Input
                  size="large"
                  prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}} />}
                  value={this.form.value('firstName')}
                  {...this.form.field('firstName')}
              />
              <Input
                size="large"
                prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}} />}
                value={this.form.value('lastName')}
                {...this.form.field('lastName')}
              />
              <Input
                size="large"
                prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}} />}
                value={this.form.value('password')}
                {...this.form.field('password')}
              />
              <Input
                  size="large"
                  prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}} />}
                  value={this.form.value('confirmPassword')}
                  {...this.form.field('confirmPassword')}
              />
            </InputList>
            <FormItem>
              <Button
                type="primary"
                size="large"
                htmlType="submit"
                block loading={this.isPending}
                disabled={!this.allowSubmit}
              >
                REGISTER
              </Button>
            </FormItem>
          </Form>
        </FormContainer>
        <div className="SplitContainer">
          <Split/>
          <div className="SplitWord">or</div>
          <Split/>
        </div>
        <div className="u-mv">You don't need an account to sign the document</div>
        <Button
          type="default"
          size="large"
          onClick={modal.close}
          block
        >
          CONTINUE AS A GUEST
        </Button>
        <style jsx>{`
          .Login {
            display: flex;
            width: 600px;
            flex-direction: column;
            align-items: center;
            background: #FFFFFF;
            margin: 0 auto;
            width: 360px;
            padding-top: 0px;
          }
          .Login__register {
            padding: ${UI.spacing.xs} 0;
          }
          .Login__register a {
            color: #1890FF;
          }
          .Login__logo {
            font-weight: 600;
          }
          .SplitContainer {
            width: calc(100% + 250px);
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .SplitWord {
            text-align: center;
            width: 8%;
          }
        `}</style>
      </div>
    )
  }

  private get isPending(): boolean {
    return this.props.store.userStore.pending.has('register')
  }

  private get allowSubmit(): boolean {
    return isEmail(this.form.value('username'))
      && this.form.value('password')
      && this.form.value('confirmPassword')
      && this.form.value('firstName')
      && this.form.value('lastName')
  }

  private handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      if (this.form.value('password') !== this.form.value('confirmPassword')) {
        throw new Error('Provided passwords do not match!')
      }
      await this.props.store.userStore.register(this.form.data)
      this.props.store.modal.close()
    } catch (err) {
      this.form.errors.replace(err.response.data)
    }
  }
}

export {Register}
