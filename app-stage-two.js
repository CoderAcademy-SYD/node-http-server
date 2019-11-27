const http = require("http") 

const hostname = "127.0.0.1" 
const port = 3000 

function serverResponse(req, res) { 
	const { method, url, headers } = req
	console.log(method)
	console.log(url)
    console.log(headers)
    res.end('Hello world')
}

const server = http.createServer(serverResponse)

server.listen(port, hostname, () => {
	console.log(`Server running at http://${hostname}:${port}/`)
})