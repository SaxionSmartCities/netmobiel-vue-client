// save component models in history state after navigating away from the page
export function beforeRouteLeave(saving) {
  return function(_to, _from, next) {
    const entries = {}
    for (const key in saving) {
      entries[key] = saving[key](this[key])
    }
    history.replaceState(Object.assign({}, history.state, entries), '')
    next()
  }
}

// restore component models from history state after navigating back to the page
export function beforeRouteEnter(restoring) {
  return function(_to, _from, next) {
    const { state } = history
    next(page => {
      for (const key in restoring) {
        page[key] = restoring[key](state[key])
      }
    })
  }
}
