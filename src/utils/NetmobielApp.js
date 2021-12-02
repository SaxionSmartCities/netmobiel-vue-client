/* global NetmobielAppRequest */

/**
 * Interface with the Flutter Netmobiel App to retrieve the Firebase
 * Cloud Messaging (FCM) token. The API comprises the name of
 * Dart JavascriptChannel for the request (NetmobielAppRequest) and
 * as a response the name of the global setter function (setNetmobielFcmToken)
 *
 * To ease integration with Vue the fcmToken is passed as an event
 * (NetmobielFcmToken), dispatched by the global window object.
 */

/**
 * Tests whether the browser might be loaded inside the Flutter App.
 * @return {false|true}
 */
export function mightHaveFcmToken() {
  return (
    window.hasOwnProperty('NetmobielAppRequest') &&
    !!NetmobielAppRequest.postMessage
  )
}

/**
 * Requests the app to send the FCM token. The token is passed through the
 * global setter function 'window.setNetmobielFcmToken'.
 * It is allowed to call this method multiple times, the call is idempotent.
 */
export function requestFcmToken() {
  if (mightHaveFcmToken()) {
    NetmobielAppRequest.postMessage('fcmToken')
  }
}

/**
 * Setter for passing the FCM token to the web application inside the Flutter
 * App. The FCM token is dispatched as a Javascript custom event
 * 'NetmobielFcmToken' on the window object.
 * @param token the current fcm token.
 */
window.setNetmobielFcmToken = function(token) {
  const fcmEvent = new CustomEvent('NetmobielFcmToken', { detail: token })
  window.dispatchEvent(fcmEvent)
}
