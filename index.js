var express = require('express');
var jsonServer = require('json-server')
var server = jsonServer.create()
var router = jsonServer.router('db/credits.json')
var middlewares = jsonServer.defaults()

// console.log((router.db.__wrapped__))

server.use(middlewares)

server.post('/api/credits',(req, res, next)=>{
	console.log(req.body)
	next();
})

server.use(jsonServer.bodyParser)
server.use(function (req, res, next) {
  if (req.method === 'POST') {
    req.body.createdTime = Date.now();

	  if( req.path === '/api/credits'){
	  	// req.body.count = 888;
	  }
  }

  // Continue to JSON Server router
  next()
})


server.use('/lib',express.static('node_modules'))


server.use('/api',router)

let PORT = process.argv[2] || 3000;
server.listen(PORT, function () {
  console.log(`Growing Credits Server is running at http://0.0.0.0:${PORT}`)
})