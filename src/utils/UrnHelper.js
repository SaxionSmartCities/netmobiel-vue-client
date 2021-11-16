const NETMOBIEL_SERVICE = {
  BANKER: 'bn',
  COMMUNICATOR: 'cm',
  KEYCLOAK: 'kc',
  PLANNER: 'pn',
  PROFILE: 'pf',
  RIDESHARE: 'rs',
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

export { NETMOBIEL_SERVICE, isUrn, decodeUrn }
