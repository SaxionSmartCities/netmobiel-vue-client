const NETMOBIEL_SERVICE = {
  BANKER: 'bn',
  COMMUNICATOR: 'cm',
  KEYCLOAK: 'kc',
  PLANNER: 'pn',
  PROFILE: 'pf',
  RIDESHARE: 'rs',
}

const NETMOBIEL_CLASS = {
  USER: 'user',
}

function isUrn(urn) {
  return urn && urn.startsWith('urn:')
}

function decodeUrn(urn) {
  // urn:nb:pn:tripplan:1234
  if (!isUrn(urn)) {
    return undefined
  }
  const parts = urn.split(':')
  return {
    service: parts[2],
    class: parts[3],
    id: parts[4],
  }
}
//Example urn:nb:kc:user:71f69345-42e1-4d17-a7c4-7c47178edcd7
function encodeUrn(service, clazz, id) {
  return `urn:nb:${service}:${clazz}:${id}`
}

export { NETMOBIEL_SERVICE, NETMOBIEL_CLASS, isUrn, decodeUrn, encodeUrn }
