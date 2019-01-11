import {types} from 'mobx-state-tree'

type ModalName =  string

export const Modal = types
  .model('Modal', {
    active: types.maybe(types.string),
  })
  .actions(self => ({
    open(name: ModalName) {
      self.active = name
    },
    close() {
      self.active = undefined
    },
    toggle(name: ModalName) {
      self.active = self.active ? undefined : name
    },
  }))

type ModalType = typeof Modal.Type
export interface Modal extends ModalType {}
