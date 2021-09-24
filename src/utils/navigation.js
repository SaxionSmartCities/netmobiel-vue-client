// save component models in history state after navigating away from the page
export function saveDataBeforeRouteLeave(vm, model) {
  const entries = {}
  for (const key in model) {
    entries[key] = model[key](vm[key])
    // console.log(`Save - Key: ${key} Value: ${entries[key]}`)
  }
  history.replaceState(Object.assign({}, history.state, entries), '')
}

export function restoreDataBeforeRouteEnter(vm, model) {
  for (const key in model) {
    // The restore is called after the mount(). Do not override the initialization in the component
    if (typeof history.state[key] !== 'undefined') {
      vm[key] = model[key](history.state[key])
      // console.log(`Restore - Key: ${key} Value: ${vm[key]}`)
    }
  }
}

export function beforeRouteLeave(saving) {
  return function(_to, _from, next) {
    saveDataBeforeRouteLeave(this, saving)
    next()
  }
}

//restore component models from history state after navigating back to the page
export function beforeRouteEnter(restoring) {
  return function(_to, _from, next) {
    // NO access to this. Use the next callback the restore the attribute values.
    next(vm => restoreDataBeforeRouteEnter(vm, restoring))
  }
}
