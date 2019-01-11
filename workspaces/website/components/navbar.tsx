import {UI} from '@shared/config'
import {Store} from '@website/types'
import {observable} from 'mobx'
import {inject, observer} from 'mobx-react'
import * as React from 'react'
import {hot} from 'react-hot-loader'
import * as Router from 'react-router-dom'

interface Props {
  store?: Store
  guest?: boolean
}

@hot(module)
@inject('store')
@observer
class Navbar extends React.Component<Props> {
  @observable formSubmitted: boolean
  @observable redirectUrl: string

  componentDidMount() {
    this.formSubmitted = false
  }

  render() {
    const {isLoggedIn} = this.props.store.userStore

    if (this.formSubmitted) {
      return <Router.Redirect push={true} to={this.redirectUrl} />
    }

    return (
      <div className="Navbar">
        <div className="Navbar__content">
          <h2>
            <Router.NavLink to="/dashboard">
              Digital Sign
            </Router.NavLink>
          </h2>
          {isLoggedIn && (
            <div className="Navbar__item">
              <Router.NavLink to="/profile" data-cy="profile">
              <div className="Navbar__padding">
                <img className="Navbar__avatar" src={this.props.store.userStore.profile.avatarUrl}/>
                Profile
              </div>
              </Router.NavLink>
              <Router.NavLink to="/auth/logout" data-cy="logout">Log out</Router.NavLink>
            </div>
          )}
        </div>
        <style jsx>{`
          .Navbar__padding {
            padding-right: 10px;
          }
          .Navbar {
            background: #000;
            position: fixed;
            display: flex;
            align-items: center;
            justify-content: space-between;
            top: 0;
            left: 0;
            height: 60px;
            color: #fff;
            width: 100%;
            z-index: 3;
          }
          .Navbar :global(a) {
            color: rgb(255, 255, 255);
            display: inline-block;
          }
          .Navbar__avatar {
            width: 25px;
            height: auto;
            border-radius: 45px;
            margin-right: 10px;
          }
          .Navbar__content {
            width: 100%;
            padding: 0 80px;
            display: flex;
            justify-content: space-between;
          }
          @media screen and (min-width: ${UI.width.xxl}) {
            .Navbar {
              justify-content: center;
            }
            .Navbar__content {
              max-width: 1440px;
            }
          }
          @media screen and (max-width: ${UI.width.l}) {
            .Navbar__content {
              padding: 0 40px;
            }
          }
          @media screen and (max-width: ${UI.width.sm}) {
            .Navbar {
              font-size: 12px;
            }
          }
          @media screen and (max-width: ${UI.width.xs}) {
            .Navbar__content {
              padding: 0 20px;
            }
          }
        `}</style>
      </div>
    )}}

export {Navbar}
