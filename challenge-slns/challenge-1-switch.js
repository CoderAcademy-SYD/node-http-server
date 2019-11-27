const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

// Initialise our array of students with some names
let students = ['Carlie', 'Tony', 'Sam', 'Carl', 'Sherine', 'Lelani', 'Aidan', 'Jack', 'Mark', 'Rachel'];

// Callback function that will handle all of our server functions
function serverResponse(req, res) {

    // Get the http method, url, and headers from the request
    const {
        method,
        url,
        headers
    } = req;

    console.log(`Method: ${method}, URL: ${url}, Headers: ${headers}`)
    // handle the routes

    if (method === 'GET') { // Use if and else if to handle the method since there are a finite amount of them
        switch (url) { // Use switch to handle routes because it's easier to read and there could be LOTS! 
            case '/':
                console.log('Getting a random pair of students');
                res.setHeader('Content-type', 'text/plain');
                res.end(randomPair());
                break;

            case '/students':
                console.log("Getting a list of students");
                res.setHeader('Content-type', 'application/json');
                res.end(JSON.stringify(students));
                break;

            default: // You can set a different response for invalid route for each method if you want
                invalidRequest('Invalid GET request.')
                break;
        }
    } else if (method === 'POST') {
        switch (url) {
            case '/students':
                console.log('Got a POST request on /students');
                res.setHeader('Content-type', 'applicaton/json');

                let data = [];
                req.on('data', chunk => {
                    if (url === '/students') {
                        console.log(`Data chunk available: ${chunk}`);
                        data.push(JSON.parse(chunk));
                    }
                });
                req.on('end', () => {
                    if (data.length > 0) {
                        console.log('retrieved data', data[0]);
                        students.push(data[0].name);
                        res.statusCode = 201;
                        res.end(JSON.stringify(students));
                    }
                });
                break;
            default: // You can set a different response for invalid route for each method if you want
                invalidRequest(req, res, 'Invalid POST request.')
                break;
        }
    } else {
        console.log('Got an invalid method or route');
        invalidRequest('Invalid request and url.')
    }
}

const server = http.createServer(serverResponse);

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

function invalidRequest(req, res, errorMessage) { // This function takes 
    res.statusCode = 404;
    res.setHeader('Content-type', 'text/plain');
    res.end(errorMessage);
}

// A function to return two random students as a string
// It is possible we'll get the same student twice
function randomPair() {
    let s1Ind = Math.floor(Math.random() * students.length);
    let s2Ind = Math.floor(Math.random() * students.length);
    return `${students[s1Ind]} ${students[s2Ind]}`;
}