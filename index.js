// core modules
var fs = require('fs')
var http = require('http')
var path = require('path')

// server route setup
var serverSetup = function (request, response) {
  switch (request.url) {
    case '/':
      fs.readFile(path.join(__dirname, 'public', 'index.html'), (error, content) => {
        if (error) {
          throw error
        }

        response.writeHead(200, 'OK', { 'Content-Type': 'text/html' })
        response.end(content)
      })
      break

    case '/formhandler':
      if (request.method === 'POST') {
        var requestData = ''

        request.on('data', (chunk) => { requestData += chunk.toString() })

        request.on('end', () => {
          fs.readFile(path.join(__dirname, 'public', 'form-success.html'), (error, content) => {
            if (error) {
              throw error
            }

            response.writeHead(200, 'OK', { 'Content-Type': 'text/html' })
            response.end(content)
          })
        })
      } else {
        handle404(response)
      }
      break

    case '/stop-setup':
      response.writeHead(200, 'OK', { 'Content-Type': 'text/html' })
      response.end('Wifi setup complete. Server has stopped.')
      this.close(() => console.log('Wifi setup complete. Server has stopped'))
      break

    default:
      handle404(response)
      break
  }
}

// response functions

function handle404 (response) {
  fs.readFile(path.join(__dirname, 'public', '404.html'), (error, content) => {
    if (error) {
      console.log(error)
      content = error.toString()
    }

    response.writeHead(404, 'Not found', { 'Content-Type': 'text/html' })
    response.end(content)
  })
}

var TesselWifiSetup = function () {
  this.server = http.createServer(serverSetup)

  Object.defineProperties(this, {
    listening: {
      get: () => !!this.server._handle // this is how `server.listening` works under the hood, which is added in v5.7.0 but Tessel runs 4.4.3 at the moment
    }
  })
}

TesselWifiSetup.prototype.start = function (port) {
  return this.server.listen(port)
}

TesselWifiSetup.prototype.close = function (callback) {
  this.server.close(callback)
}

module.exports = TesselWifiSetup
