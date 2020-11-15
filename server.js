/* global require, process */

const fs = require('fs');
const path = require('path');
const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('build/db/app.json');
const middlewares = jsonServer.defaults({
  static: 'build',
  noCors: false,
});
const port = process.env.PORT || 3131;

server.get(/^\/panel.*/, (req,res) =>{
  if(req.url === '/panel'){
    req.url += '/';
  }
  const filePath = __dirname+req.url.replace('/panel', '/build');
  if(fs.existsSync(filePath)){
    res.sendFile(filePath);
  } else {
    res.sendFile(path.join(__dirname+'/build/index.html'));
  }
});

server.use(function(req, res, next) {
  const api = /^\/api(.*)$/.exec(req.url);

  if (api && api.length > 1) {
    req.url = api[1] || '/';
  } else {
    req.url = '/front' + req.url;
  }
  next();
});

server.use(middlewares);
server.use(router);

server.listen(port);