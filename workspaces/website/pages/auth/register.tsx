import {Head, InputList, Page} from '@shared/components'
import {APP_TITLE, UI} from '@shared/config'
import {isEmail} from '@shared/utils/is-email'
import {Store} from '@website/types'
import {as} from '@website/utils/as'
import {Button, Form, Icon, Input} from 'antd'
import {inject, observer} from 'mobx-react'
import * as React from 'react'
import {NavLink, Redirect} from 'react-router-dom'
import {HeaderContainer, Nav, Wrapper} from './styled'

const FormItem = Form.Item

interface Props  {
  store?: Store
}

@inject('store')
@as.member(() => <Redirect to="/" />)
@observer
class Register extends React.Component<Props> {
  private readonly title = `${APP_TITLE}`
  private readonly form = this.props.store.formStore.add('Register', {
    username: {
      autoFocus: true,
      placeholder: 'Email',
      type: 'text',
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
      placeholder: 'Password',
      type: 'password',
    },
    confirmPassword: {
      placeholder: 'Confirm password',
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
          <div className="Register">
            <HeaderContainer>
              <h1 className="u-mb- Register__logo">Digital Sign</h1>
              <h3 className="u-mb">The easiest way to sign and manage your documents</h3>
            </HeaderContainer>
            <Nav>
              <NavLink activeClassName="active" to="/auth/login">LOG IN</NavLink>
              <NavLink activeClassName="active" to="/auth/register">REGISTER</NavLink>
            </Nav>
            <Form onSubmit={this.handleSubmit}>
              <InputList errors={this.form.errors.all}>
                <Input
                  size="large"
                  placeholder="Email"
                  type="text"
                  prefix={<Icon type="user" className="Icon" style={{color: 'rgba(0,0,0,.25)'}} />}
                  value={this.form.value('username')}
                  {...this.form.field('username')}
                  data-cy="email"
                />
                <Input
                  size="large"
                  prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}} />}
                  value={this.form.value('firstName')}
                  {...this.form.field('firstName')}
                  data-cy="name"
                />
                <Input
                  size="large"
                  prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}} />}
                  value={this.form.value('lastName')}
                  {...this.form.field('lastName')}
                  data-cy="surname"
                />
                <Input
                  size="large"
                  prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}} />}
                  value={this.form.value('password')}
                  {...this.form.field('password')}
                  data-cy="password"
                />
                <Input
                  size="large"
                  prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}} />}
                  value={this.form.value('confirmPassword')}
                  {...this.form.field('confirmPassword')}
                  data-cy="confirm-password"
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
          </div>
        </Wrapper>

        <style jsx>{`
          .Register {
            display: flex;
            flex-direction: column;
            align-items: center;
            background: #F0F3F7;
            margin: 0 ${UI.spacing.xs};
            max-width: 430px;
            width: 430px;
            padding-top: 80px;
          }
          .Register__register {
            padding: ${UI.spacing.xl} 0;
          }
          .Register__register a {
            color: #1890FF;
          }
          .Register__logo {
            font-weight: 600;
          }
        `}</style>
      </Page>
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
    } catch (err) {
      this.form.errors.replace(err.response.data)
    }
  }
}

export default Register
