var express = require('express');
var jsonServer = require('json-server')
var server = jsonServer.create()
var router = jsonServer.router('db/credits.json')
var middlewares = jsonServer.defaults()

const Statistics = require('./lib/statistics');

var statistics = new Statistics(router.db);

console.log('daily::',statistics.daily(2016,11,25))
console.log('monthly::',statistics.monthly(2016,11))
console.log('yearly::',statistics.yearly(2017))
console.log('sum::',statistics.sum())
console.log('sumRange::',statistics.sumRange('2016-12-25','2017-1-31'))


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


server.get('/api/scores',(req, res)=>{

  let _date = req.query && req.query.date ? new Date(req.query.date) : new Date();
  let _year = _date.getFullYear();
  let _month = _date.getMonth();
  let _day = _date.getDate();

  res.send({
    sum: statistics.sum(),
    date: _date.toISOString(),
    daily: statistics.daily(_year, _month, _day),
    monthly: statistics.monthly(_year, _month),
    lastweek: statistics.sumRange(new Date(_year, _month, _day - 7).getTime(), _date.getTime())
  })
})




server.use('/lib',express.static('node_modules'))


server.use('/api',router)

let PORT = process.argv[2] || 3000;
server.listen(PORT, function () {
  console.log(`Growing Credits Server is running at http://0.0.0.0:${PORT}`)
})