const http = require('http')
const fetch = require('node-fetch')
const urlLib = require('url')
const queryString = require('querystring')

const hostname = '127.0.0.1'
const port = 3000


let students = ['Carlie', 'Tony', 'Sam', 'Carl', 'Sherine', 'Lelani', 'Aidan', 'Jack', 'Mark', 'Rachel']

// Callback function that will handle all of our server functions
function serverResponse(req, res) {

    const {
        method,
        headers
    } = req;

    const url = urlLib.parse(req.url) // Parse the url using the url module
    console.log(url)
    const query = queryString.parse(url.query) // Parse the query string using the querystring module
    console.log(query)

    if (method === 'GET' && url === '/') {
        console.log('Getting a random pair of students');
        res.setHeader('Content-type', 'text/plain');
        res.end(randomPair());
    } else if (method === 'GET' && url === '/students') {
        console.log("Getting a list of students");
        res.setHeader('Content-type', 'application/json');
        res.end(JSON.stringify(students));
    } else if (method === 'GET' && url.pathname === '/students/') {
        res.setHeader('Content-type', 'application/json')
        filteredStudents = students.filter((value) => {
            return value === query.filter
        })
        res.end(JSON.stringify(filteredStudents))
    }
    else {
        console.log('Got an invalid method or route');
        res.statusCode = 404;
        res.setHeader('Content-type', 'text/plain');
        res.end('Route not found');
    }
}

// When we create an http server, we will pass it a callback function that the routes for the server
const server = http.createServer(serverResponse);

// What is the third argument to the listen method on http server? When do you think it is called?
server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

// A function to return two random students as a string
// It is possible we'll get the same student twice
function randomPair() {
    let s1Ind = Math.floor(Math.random() * students.length);
    let s2Ind = Math.floor(Math.random() * students.length);
    return `${students[s1Ind]} ${students[s2Ind]}`;
}