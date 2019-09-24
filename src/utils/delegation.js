export default function delegation(receiver, key, behavior, optionalDefault) {
  // try specific behavior for given key
  let result = behavior[key]
  if (result === undefined) {
    // try optional default if specific behavior is not defined
    result = optionalDefault
    if (result === undefined) {
      // try default behavior if optional default is not defined
      result = behavior.default
      if (result === undefined) {
        // ran out of options...
        throw new Error('Missing default for delegation')
      }
    }
  }
  // assume that function result is a method call that should be bound to receiver
  return typeof result === 'function' ? result.call(receiver) : result
}
