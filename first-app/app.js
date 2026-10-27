const http = require('http');
const server = http.createServer((req, res) => {
    if (req.url === '/') {
        res.end('Hello World');
    } else if (req.url === '/api/courses') {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify([1, 2, 3]));
    } else {
        res.statusCode = 404;
        res.end('Not Found');
    }
});
server.listen(3000);
console.log('Listening on port 3000...');