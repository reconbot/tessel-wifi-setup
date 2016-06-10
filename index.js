// core modules
var fs = require('fs');
var http = require('http');
var path = require('path');
var querystring = require('querystring');

// server route setup
var server = http.createServer((request, response) => {
  switch (request.url) {
    case '/':
      fs.readFile(path.join(__dirname, 'index.html'), (error, content) => {
        response.writeHead(200, 'OK', { 'Content-Type': 'text/html' });
        response.end(content);
      });
      break;

    case '/formhandler':
      if (request.method === 'POST') {
        var requestData = '';

        request.on('data', (chunk) => requestData += chunk.toString());

        request.on('end', () => {
          fs.readFile(path.join(__dirname, 'form-success.html'), (error, content) => {
            response.writeHead(200, 'OK', { 'Content-Type': 'text/html' });
            response.end(content);
          });
        });
      } else {
        handle404(response);
      }
      break;

    case '/stop-setup':
      response.writeHead(200, 'OK', { 'Content-Type': 'text/html' });
      response.end('Wifi setup complete. Server has stopped.');
      server.close(() => console.log('Wifi setup complete. Server has stopped'));
      break;
    default:
      handle404(response);
      break;
  }
});

server.listen(process.argv[2] || 8080);

console.log('Server running at %d', process.argv[2] || 8080);

// response functions

function handle404 (response) {
  fs.readFile(path.join(__dirname, '404.html'), (error, content) => {
    if (error) {
      console.log(error);
      content = error.toString();
    }

    response.writeHead(404, 'Not found', { 'Content-Type': 'text/html' });
    response.end(content);
  });
}
