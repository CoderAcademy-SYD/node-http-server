const http = require('http')

const hostname = '127.0.0.1'
const port = 3000

const students = [
    "Carlie",
    "Tony",
    "Sam",
    "Carl",
    "Sherine",
    "Lelani",
    "Aidan",
    "Jack",
    "Mark",
    "Rachel"
]

const server = http.createServer((req, res) => {
    const { method, url, headers } = req
    if (method === 'GET' && url === '/') {
        res.setHeader('Content-Type', 'text/plain; charset=utf-8')
        res.end('Matching students')
    } else if (method === "GET" && url === '/students') {
        console.log('Getting list of students')
        res.setHeader('Content-type', 'application/json');
        res.end(JSON.stringify(students));
    }
    else {
        console.error('ROUTE DOES NOT EXIST')
        throw 'ROUTE DOES NOT EXIST!'
    }
})

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`)
})