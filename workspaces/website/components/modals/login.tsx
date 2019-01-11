import {InputList} from '@shared/components'
import {UI} from '@shared/config'
import {isEmail} from '@shared/utils/is-email'
import {Forgot, FormContainer, HeaderContainer, Nav, Split} from '@website/pages/auth/styled'
import {Store} from '@website/types'
import {Button, Form, Icon, Input} from 'antd'
import {inject, observer} from 'mobx-react'
import * as React from 'react'
import {NavLink} from 'react-router-dom'
import {ButtonAuth} from './styled-auth'
const FormItem = Form.Item

interface Props  {
  store?: Store
}

@inject('store')
@observer
class Login extends React.Component<Props> {
  private readonly form = this.props.store.formStore.add('Login', {
    username: {
      placeholder: 'Email',
    },
    password: {
      type: 'password',
      autoFocus: true,
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
          <ButtonAuth
            className={modal.active === 'login' ? 'active' : ''}
            onClick={() => modal.open('login')}
          >
            LOG IN
          </ButtonAuth>
          <ButtonAuth
            className={modal.active === 'register' ? 'active' : ''}
            onClick={() => modal.open('register')}
          >
            REGISTER
          </ButtonAuth>
        </Nav>
        <FormContainer>
          <Form onSubmit={this.handleSubmit}>
            <InputList errors={this.form.errors.all}>
              <Input
                readonly
                size="large"
                placeholder="Email"
                type="text"
                prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}} />}
                value={this.form.value('username')}
                {...this.form.field('username')}
              />
              <Input
                size="large"
                placeholder="Password"
                type="password"
                prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}} />}
                value={this.form.value('password')}
                {...this.form.field('password')}
              />
            </InputList>
            <div className="Login__register">
              <Forgot>
                <NavLink className="test" to="/auth/reset">I forgot my password</NavLink>
              </Forgot>
            </div>
            <FormItem>
              <Button
                type="primary"
                size="large"
                htmlType="submit"
                block loading={this.isPending}
                disabled={!this.allowSubmit}
              >
                LOG IN
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
          @media screen and (max-width: ${UI.width.sm}) {
            .SplitContainer {
              width: 100%;
            }
          }
          @media screen and (max-width: ${UI.width.xs}) {
            .Login {
              width: 100%;
              padding: 0 10px;
            }
            .SplitWord {
              margin: 0 10px;
            }
          }
        `}</style>
      </div>
    )
  }

  private get isPending(): boolean {
    return this.props.store.userStore.pending.has('login')
  }

  private get allowSubmit(): boolean {
    return isEmail(this.form.value('username')) && this.form.value('password')
  }

  private handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      await this.props.store.userStore.login(this.form.data)
      this.props.store.modal.close()
    } catch (err) {
      this.form.errors.replace({
        message: err.response.data.message,
      })
    }
  }
}

export {Login}
