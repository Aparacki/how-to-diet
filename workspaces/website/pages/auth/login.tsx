import {Head, InputList, Page} from '@shared/components'
import {APP_TITLE, UI} from '@shared/config'
import {isEmail} from '@shared/utils/is-email'
import {Store} from '@website/types'
import {as} from '@website/utils/as'
import {Button, Form, Icon, Input} from 'antd'
import {inject, observer} from 'mobx-react'
import * as React from 'react'
import {NavLink, Redirect} from 'react-router-dom'
import {Forgot, FormContainer, HeaderContainer, Nav, Wrapper} from './styled'

const FormItem = Form.Item

interface Props  {
  store?: Store
}

@inject('store')
@as.member(() => <Redirect to="/" />)
@observer
class Login extends React.Component<Props> {
  private readonly title = `${APP_TITLE}`
  private readonly form = this.props.store.formStore.add('Login', {
    username: {
      autoFocus: true,
      placeholder: 'Email',
    },
    password: {
      type: 'password',
    },
  })

  render() {
    return (
      <Page>
        <Head>
          <title>{this.title}</title>
        </Head>
        <Wrapper>
          <div className="Login">
            <HeaderContainer>
              <h1 className="u-mb- Login__logo">Digital Sign</h1>
              <h3 className="u-mb">The easiest way to sign and manage your documents</h3>
            </HeaderContainer>
            <Nav>
              <NavLink activeClassName="active" to="/auth/login">LOG IN</NavLink>
              <NavLink activeClassName="active" to="/auth/register" data-cy="register">REGISTER</NavLink>
            </Nav>
            <FormContainer>
              <Form onSubmit={this.handleSubmit}>
                <InputList errors={this.form.errors.all}>
                  <Input
                    size="large"
                    placeholder="Email"
                    type="text"
                    prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}} />}
                    value={this.form.value('username')}
                    {...this.form.field('username')}
                    data-cy="email"
                  />
                  <Input
                    size="large"
                    placeholder="Password"
                    type="password"
                    prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}} />}
                    value={this.form.value('password')}
                    {...this.form.field('password')}
                    data-cy="password"
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
          </div>
        </Wrapper>

        <style jsx>{`
          .Login {
            display: flex;
            flex-direction: column;
            align-items: center;
            background: #F0F3F7;
            margin: 0 ${UI.spacing.xs};
            width: 430px;
            padding-top: 80px;
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
        `}</style>
      </Page>
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
    } catch (err) {
      this.form.errors.replace({
        message: err.response.data.message,
      })
    }
  }
}

export default Login
