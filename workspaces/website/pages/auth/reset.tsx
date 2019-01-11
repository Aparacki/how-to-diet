import {Head, InputList, Page} from '@shared/components'
import {APP_TITLE, UI} from '@shared/config'
import {isEmail} from '@shared/utils/is-email'
import {Store} from '@website/types'
import {as} from '@website/utils/as'
import {Button, Form, Icon, Input, message} from 'antd'
import {inject, observer} from 'mobx-react'
import * as React from 'react'
import {NavLink, Redirect} from 'react-router-dom'
import {FormContainer, HeaderContainer, Nav, Wrapper} from './styled'

const FormItem = Form.Item

interface Props  {
  store?: Store
}

@inject('store')
@as.member(() => <Redirect to="/" />)
@observer
class Login extends React.Component<Props> {
  private readonly title = `${APP_TITLE}`
  private readonly form = this.props.store.formStore.add('resetPassword', {
    username: {
      autoFocus: true,
      placeholder: 'Email',
    },
  })

  render() {
    return (
      <Page>
        <Head>
          <title>{this.title}</title>
        </Head>
        <Wrapper>
          <div className="Reset">
            <HeaderContainer>
              <h1 className="u-mb- Reset__logo">Digital Sign</h1>
              <h3 className="u-mb">The easiest way to sign and manage your documents</h3>
            </HeaderContainer>
            <Nav>
              <NavLink activeClassName="active" to="/auth/reset">RESET PASSWORD</NavLink>
            </Nav>
            <FormContainer>
              <Form onSubmit={this.handleSubmit} className="Reset_form">
                <InputList errors={this.form.errors.all}>
                  <Input
                    size="large"
                    placeholder="Email"
                    type="text"
                    prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}} />}
                    value={this.form.value('username')}
                    {...this.form.field('username')}
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
                    RESET PASSWORD
                  </Button>
                </FormItem>
              </Form>
            </FormContainer>
          </div>
        </Wrapper>

        <style jsx>{`
          .Reset {
            display: flex;
            flex-direction: column;
            align-items: center;
            background: #F0F3F7;
            margin: 0 ${UI.spacing.xs};
            width: 430px;
            padding-top: 80px;
          }
          .Reset__logo {
            font-weight: 600;
          }
          .Reset_form {
            width: 100%;
          }
        `}</style>
      </Page>
    )
  }

  private get isPending(): boolean {
    return this.props.store.userStore.pending.has('reset')
  }

  private get allowSubmit(): boolean {
    return isEmail(this.form.value('username'))
  }

  private handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      await this.props.store.userStore.resetPassword(this.form.data)
      message.success('Check your e-mail.')
    } catch (err) {
      this.form.errors.replace({
        message: err.response.data.message ? err.response.data.message : 'Server 500',
      })
    }
  }
}

export default Login
