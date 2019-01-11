import {Head, InputList, Page} from '@shared/components'
import {APP_TITLE, UI} from '@shared/config'
import {Store} from '@website/types'
import {as} from '@website/utils/as'
import {Button, Form, Icon, Input} from 'antd'
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
class Update extends React.Component<Props> {
  private readonly title = `${APP_TITLE}`
  private readonly form = this.props.store.formStore.add('update-password', {
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
          <div className="Login">
            <HeaderContainer>
              <h1 className="u-mb- Login__logo">Digital Sign</h1>
              <h3 className="u-mb">The easiest way to sign and manage your documents</h3>
            </HeaderContainer>
            <Nav>
              <NavLink activeClassName="active" to="/auth/update">UPDATE PASSWORD</NavLink>
            </Nav>
            <FormContainer>
              <Form onSubmit={this.handleSubmit}>
                <InputList errors={this.form.errors.all}>
                  <Input
                    size="large"
                    placeholder="Password"
                    type="text"
                    prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}} />}
                    value={this.form.value('password')}
                    {...this.form.field('password')}
                  />
                  <Input
                    size="large"
                    placeholder="Confirm password"
                    type="password"
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
                    SUBMIT
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
          .Login__logo {
            font-weight: 600;
          }
        `}</style>
      </Page>
    )
  }

  private get isPending(): boolean {
    return this.props.store.userStore.pending.has('update')
  }

  private get allowSubmit(): boolean {
    return (this.form.value('password') !== '' && this.form.value('confirmPassword') !== '')
  }

  private handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      if (this.form.value('password') !== this.form.value('confirmPassword')) {

        throw new Error('Provided passwords do not match!')
      }

      const url = new URL(window.location.href)
      const token = url.searchParams.get('token')

      await this.props.store.userStore.updatePassword({...this.form.data, token})
    } catch (err) {
      this.form.errors.replace(err.response ? err.response.data : err.message)
    }
  }
}

export default Update
