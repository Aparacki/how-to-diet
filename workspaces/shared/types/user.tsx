import {syncano} from '@shared/utils/syncano'
import {flow, types} from 'mobx-state-tree'

export const User = types
  .model('User', {
    id: types.identifierNumber,
    username: types.string,
    firstName: types.maybeNull(types.string),
    lastName: types.maybeNull(types.string),
    avatar: types.maybeNull(types.string),
  })
  .views(self => ({
    get fullName(): string {
      return [self.firstName, self.lastName].join(' ')
    },
    get avatarUrl (): string {
      return self.avatar
    },
  }))
  .views(self => ({
    get displayName(): string {
      return self.fullName === ' ' ? self.username : self.fullName
    },
  }))

export const UserStore = types
  .model('UserStore', {
    token: types.optional(types.string, ''),
    profile: types.maybeNull(User),
    pending: types.optional(types.map(types.string), {}),
  })
  .views(self => ({
    get isLoggedIn(): boolean {
      return Boolean(self.token && self.profile)
    },
    get isGuest(): boolean {
      return Boolean(!self.token && !self.profile)
    },
  }))
  .actions(self => ({
    setToken(token: string = '') {
      self.token = token
      localStorage.setItem('token', token)
    },
  }))
  .actions(self => ({
    fetchProfile: flow(function * () {
      if (!self.token) {
        return
      }

      try {
        self.pending.set('fetch-profile', '')
        self.profile = yield syncano('user/profile')
        localStorage.setItem('profile', JSON.stringify(self.profile))
      } catch (error) {
        if (error.response.status === 401) {
          self.setToken()
        }
        throw error
      } finally {
        self.pending.delete('fetch-profile')
      }
    }),
  }))
  .actions(self => ({
    afterCreate: flow(function * () {
      self.token = window.localStorage.getItem('token') || ''
      self.profile = JSON.parse(window.localStorage.getItem('profile')) || null
      self.fetchProfile()
    }),
    logout() {
      self.setToken()
      self.profile = null
    },
    login: flow(function * (credentials: {
      username: string,
      password: string,
    }) {
      try {
        self.pending.set('login', '')
        const {token} = yield syncano('user-auth/login', credentials)
        self.setToken(token)
        yield self.fetchProfile()
      } catch (error) {
        throw error
      } finally {
        self.pending.delete('login')
      }
    }),
    register: flow(function * (credentials: {
      username: string,
      password: string,
      firstName: string,
      lastName: string,
    }) {
      try {
        self.pending.set('register', '')
        const {token} = yield syncano('user/register', credentials)
        self.setToken(token)
        yield self.fetchProfile()
      } catch (error) {
        throw error
      } finally {
        self.pending.delete('register')
      }
    }),
    resetPassword: flow(function * (credentials: {
      username: string
    }) {
      try {
        self.pending.set('reset', ' ')
        yield syncano('user/forgot-password', credentials)
      } catch (error) {
        throw error
      } finally {
        self.pending.delete('reset')
      }
    }),
    updatePassword: flow(function * (credentials: {
      password: string,
      token: string,
    }) {
      try {
        self.pending.set('update', ' ')
        const {token} = yield syncano('user/change-password', credentials)

        self.setToken(token)
      } catch (error) {
        throw error
      } finally {
        self.pending.delete('update')
      }
    }),
  }))

type UserType = typeof User.Type
export interface User extends UserType {}

type UserStoreType = typeof UserStore.Type
export interface UserStore extends UserStoreType {}
