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
  const fcmEvent = new CustomEvent('NetmobielFcmToken', {
    detail: {
      fcmToken: token,
    },
  })
  window.dispatchEvent(fcmEvent)
}

/**
 * Setter for passing a push message ID to the Netmobiel application.
 * The message is dispatched as a Javascript custom event
 * 'NetmobielPushMessage' on the window object.
 * @param msgId the message ID as a urn.
 * @param titleEnc the message title (might be null), URI encoded.
 * @param bodyEnc the message text, URI encoded.
 */
window.dispatchNetmobielPushMessage = function(msgId, titleEnc, bodyEnc) {
  const event = new CustomEvent('NetmobielPushMessage', {
    detail: {
      msgId,
      title: titleEnc ? decodeURIComponent(titleEnc) : undefined,
      body: bodyEnc ? decodeURIComponent(bodyEnc) : undefined,
    },
  })
  window.dispatchEvent(event)
}
