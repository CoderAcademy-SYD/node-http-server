const http = require('http');
const fs = require('fs'); // import the Node.js file system module

const hostname = '127.0.0.1';
const port = 3000;

// Callback function that will handle all of our server functions
function serverResponse(req, res) {

    // The data will be retrieved each time the server responds to a request:
    const data = getDataFromFileSystem('data.txt') // See function getDataFromFileSystem below
    const students = data.split('\n') // Split the data on line-breaks and return an array

    console.table(students)

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
                        console.log('Data', data)
                        console.log('retrieved data', data[0]);
                        
                        students.push(data[0].name); // Add the name to the students array

                        // Write the students array to the file system:
                        const dataDump = createStringFromArray(students) // see `createStringFromArray()` function below
                        writeToFileSystem('data.txt', dataDump) // see `writeToFileSystem` function below

                        res.statusCode = 201; // http status 201: created
                        res.end(JSON.stringify(students)); // return the new array of students to the client
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

const server = http.createServer(serverResponse); // see serverResponse function

server.listen(port, hostname, () => { // runs the server
    console.log(`Server running at http://${hostname}:${port}/`);
});

function invalidRequest(req, res, errorMessage) { // This function takes 
    res.statusCode = 404;
    res.setHeader('Content-type', 'text/plain');
    res.end(errorMessage);
}

// A function to return two random students as a string
function randomPair() {
    let s1Ind = Math.floor(Math.random() * students.length);
    let s2Ind = Math.floor(Math.random() * students.length);
    return `${students[s1Ind]} ${students[s2Ind]}`;
}

function createStringFromArray(array) {
    // You could do this the "long way":
    // let result = ''
    // array.forEach((value) => {
    //     if(value !== ''){
    //         result = result + `${value}\n`
    //     }
    // })
    // OR use join:
    return array.join('\n')
}

function writeToFileSystem(path, data) {
    fs.writeFileSync(path, data, (err) => {
        if (err) {
            console.error(err)
        }
    })
}

function getDataFromFileSystem(path) {
    return fs.readFileSync(path, {encoding: 'utf-8'})
}