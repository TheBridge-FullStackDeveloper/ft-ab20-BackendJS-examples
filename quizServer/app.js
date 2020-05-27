/* -------------- Initialization -------------- */

// Load dependencies

const http = require('http');

// Global scope

const listenPort = 8888;

/* -------------- Main program -------------- */

// Create http server

const server = http.createServer((request, response) => {
    if (request.url === "/") {
        response.writeHead(200, { 'Content-Type': 'text/html' });

        response.write('<h1>Welcome to my home</h1>');
        response.write('<p>Please, enter</p>');
        response.write('<a href="/fight">Enter</a>');
    } else
    if (request.url === "/fight") {
        response.writeHead(200, { 'Content-Type': 'text/html' });

        response.write('<h1>Please, back</h1>');
        response.write('<a href="/">Back</a>');
    }
    else {
        response.writeHead(404, { 'Content-Type': 'text/html' });
        response.write('<h1>Not found</h1>');
    }

    response.end();
});

// Start server

server.listen(listenPort);
console.log('Server started listening on ' + listenPort);