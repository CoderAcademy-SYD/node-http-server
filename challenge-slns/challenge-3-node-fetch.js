const http = require('http')
const fetch = require('node-fetch')

const hostname = '127.0.0.1'
const port = 3000


let students = ['Carlie', 'Tony', 'Sam', 'Carl', 'Sherine', 'Lelani', 'Aidan', 'Jack', 'Mark', 'Rachel']

// Callback function that will handle all of our server functions
function serverResponse(req, res) {

    const {
        method,
        url,
        headers
    } = req;

    if (method === 'GET' && url === '/') {

        console.log('Getting a random pair of students');
        res.setHeader('Content-type', 'text/plain');
        res.end(randomPair());
    } else if (method === 'GET' && url === '/students') {

        console.log("Getting a list of students");
        res.setHeader('Content-type', 'application/json');
        res.end(JSON.stringify(students));
    } else if (method === 'POST' && url === '/students') {

        console.log('Got a POST request on /students');
        res.setHeader('Content-type', 'applicaton/json');
        // Handle getting data from the client request (on POST)
        let data = []; // Used to collect chunks of data
        req.on('data', chunk => {
            // This event fires when we receive data in the request. The data comes in chunks
            // Only handle when we have the expected url
            if (url === '/students') {
                console.log(`Data chunk available: ${chunk}`);
                // We need to parse the chunk, or we will store it as a stream object
                data.push(JSON.parse(chunk));
            }
        });
        req.on('end', () => {

            if (data.length > 0) {
                console.log('retrieved data', data[0]);
                students.push(data[0].name);
                // Send the updated list of students in the response with a 201 status
                res.statusCode = 201;
                res.end(JSON.stringify(students));
            }
        });
    } else if (method === 'GET' && url === '/users') {
        fetch('https://jsonplaceholder.typicode.com/users')
            .then(res => res.json())
            .then(json => { 
                res.end(JSON.stringify(json)) // don't forget to stringify when returning to the client!
            });
    } else if (method === 'GET' && url === '/posts') {
        fetch('https://jsonplaceholder.typicode.com/posts')
            .then(res => res.json())
            .then(json => {
                const posts = json.map((post) => { // create an array of post titles with map!
                    return post.title
                })
                res.end(JSON.stringify(posts)) // don't forget to stringify when returning to the client!
            });
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