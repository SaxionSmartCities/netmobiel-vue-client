/* eslint-disable */

export default function init(user) {
  // https://ybug.io/docs/installation

  Ybug.setUser({
    id: 'dummy_id',
    username: user.name,
    // any other info you need to identify the user
  })

  Ybug.on('load', function() {
    console.log('Ybug loaded and ready')
  })

  Ybug.on('open', function() {
    console.log('opened')
  })
  Ybug.on('beforesend', function(report) {
    console.log('Before report is sent: '+JSON.stringify(report))
    // setTimeout(() => {
    //   Ybug.close()
    // }, 100)
  })
  Ybug.on('cancel', function() {
    console.log('canceled')
  })
  Ybug.on('close', function() {
    console.log('closed')
  })
}
