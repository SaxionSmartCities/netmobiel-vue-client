export function setValue(key, value) {
  localStorage.setItem(key, value)
}

export function hasValue(key) {
  return localStorage.getItem(key) != null
}

export function getValue(key) {
  return localStorage.getItem(key)
}

export function clearValue(key) {
  localStorage.removeItem(key)
}
