var fs = require('fs')
var http = require('http')
var path = require('path')

var test = require('tap').test

var TesselWifiSetup = require('../index.js')

process.on('uncaughtException', function (err) {
  console.log(err)
})

test('Server starts on passed in port argument', (t) => {
  t.plan(1)
  var session = new TesselWifiSetup()
  session.start(8080)

  http.get('http://localhost:8080', (response) => {
    t.is(response.statusCode, 200, 'OK response')

    session.close()
  })
})

test('Index route returns public/index.html', (t) => {
  t.plan(1)

  var session = new TesselWifiSetup()
  session.start(8081)

  var indexPage = fs.readFileSync(path.join(__dirname, '../public/index.html'))

  http.get('http://localhost:8081', (response) => {
    var data = ''

    response.on('data', (chunk) => { data += chunk })

    response.on('end', () => {
      session.close()
      t.is(data.toString(), indexPage.toString(), 'matching HTML')
    })
  })
  .on('error', t.fail)
})

test('Formhandler route returns public/form-success.html when POST', (t) => {
  t.plan(2)

  var session = new TesselWifiSetup()
  session.start(8080)

  var formSuccessPage = fs.readFileSync(path.join(__dirname, '..', 'public', 'form-success.html'))

  http.request({
    port: 8080,
    path: '/formhandler',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }, (response) => {
    var data = ''

    response.on('data', (chunk) => { data += chunk })

    response.on('end', () => {
      session.close()
      t.is(response.statusCode, 200, 'successful status code')
      t.is(data.toString(), formSuccessPage.toString(), 'matching HTML')
    })
  })
  .on('error', t.fail)
  .end()
})

test('Formhandler route returns public/404.html when not POST', (t) => {
  t.plan(2)

  var session = new TesselWifiSetup()
  session.start(8080)

  var notFoundPage = fs.readFileSync(path.join(__dirname, '..', 'public', '404.html'))

  http.request({
    port: 8080,
    path: '/formhandler',
    method: 'GET'
  }, (response) => {
    var data = ''

    response.on('data', (chunk) => { data += chunk })

    response.on('end', () => {
      session.close()
      t.is(response.statusCode, 404, 'correct status code')
      t.is(data.toString(), notFoundPage.toString(), 'matching HTML')
    })
  })
  .on('error', t.fail)
  .end()
})

test('Default route returns public/404.html', (t) => {
  t.plan(2)

  var session = new TesselWifiSetup()
  session.start(8080)

  var notFoundPage = fs.readFileSync(path.join(__dirname, '..', 'public', '404.html'))

  http.request({
    port: 8080,
    path: '/test',
    method: 'GET'
  }, (response) => {
    var data = ''

    response.on('data', (chunk) => { data += chunk })

    response.on('end', () => {
      session.close()
      t.is(response.statusCode, 404, 'correct status code')
      t.is(data.toString(), notFoundPage.toString(), 'matching HTML')
    })
  })
  .on('error', t.fail)
  .end()
})

test('/stop-setup route closes the server session', (t) => {
  t.plan(3)

  var session = new TesselWifiSetup()
  session.start(8080)

  var expectedMessage = 'Wifi setup complete. Server has stopped.'

  http.get('http://localhost:8080/stop-setup', (response) => {
    var data = ''

    response.on('data', (chunk) => { data += chunk })

    response.on('end', () => {
      t.is(response.statusCode, 200, 'correct status code')
      t.is(data.toString(), expectedMessage, 'returns correct message')
      t.is(session.listening, false, 'server has closed')
    })
  })
})
