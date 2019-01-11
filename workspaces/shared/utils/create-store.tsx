import {IModelType, onSnapshot} from 'mobx-state-tree'
import {IDisposer} from 'mobx-state-tree/dist/utils'

let snapshotListener: IDisposer

export const createStore = (Store: IModelType<{}, {}>, storageKey) => {
  const snapshot = JSON.parse(localStorage.getItem(storageKey) || '{}')

  // clean up snapshot listener
  if (snapshotListener) { snapshotListener() }

  window.store = window.store || Store.create(snapshot)

  if (storageKey) {
    // On every store change, save whole store to localStorage
    snapshotListener = onSnapshot(window.store, state =>
      localStorage.setItem(storageKey, JSON.stringify(state))
    )
  }

  return window.store
}
