/* eslint-disable */

// Due to the asynchronous loading of ybug, the Ybug object is sometimes not yet visible.

function initialize(user) {
  // https://ybug.io/docs/installation

  // The onLoad event should be set in the ybug configuration object
  // Ybug.on('load', function() {
  //   console.log('Ybug loaded and ready')
  // })

  // Ybug.on('open', function() {
  //   console.log('opened')
  // })
  // Ybug.on('beforesend', function(report) {
  //   console.log('Before report is sent: '+JSON.stringify(report))
  //   // setTimeout(() => {
  //   //   Ybug.close()
  //   // }, 100)
  // })
  // Ybug.on('cancel', function() {
  //   console.log('canceled')
  // })
  // Ybug.on('close', function() {
  //   console.log('closed')
  // })
}

function setUser(id, name) {
  if (Ybug?.setUser) {
    Ybug.setUser({
      id: id,
      username: name,
      // any other info you need to identify the user
    })
  }
}

function show() {
  if (Ybug?.show) {
    Ybug.show('launcher')
  }
}

function hide() {
  if (Ybug?.hide) {
    Ybug.hide('launcher')
  }
}

export {
  initialize,
  setUser,
  show,
  hide
}
