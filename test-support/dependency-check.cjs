const assert=require('node:assert/strict'),http=require('node:http');
const path=require('node:path');
const fbjs=require.resolve('fbjs/package.json',{paths:[path.dirname(require.resolve('react'))]});
const iso=require.resolve('isomorphic-fetch',{paths:[path.dirname(fbjs)]});
const fetch=require(iso);
const React=require('react'),ReactDOMServer=require('react-dom/server');
(async()=>{
 let first;
 try {
  first=http.createServer((req,res)=>{
   if(req.url==='/redirect'){res.writeHead(302,{Location:'/json'}).end();return}
   if(req.url==='/post'){let body='';req.on('data',b=>body+=b);req.on('end',()=>res.end(body));return}
   res.setHeader('content-type','application/json');res.end(JSON.stringify({ok:true}));
  });
  await new Promise(r=>first.listen(0,'127.0.0.1',r));const base=`http://127.0.0.1:${first.address().port}`;
  assert.deepEqual(await (await fetch(base+'/json')).json(),{ok:true});
  assert.deepEqual(await (await fetch(base+'/redirect')).json(),{ok:true});
  assert.equal(await (await fetch(base+'/post',{method:'POST',body:'fixture'})).text(),'fixture');
  assert.equal((await fetch(base+'/redirect',{redirect:'manual'})).status,302);
  assert.equal(ReactDOMServer.renderToStaticMarkup(React.createElement('p',null,'fixture')),'<p>fixture</p>');
  console.log('Fetch 2 JSON/redirect/POST/manual response and React 15 server rendering pass.');
 }finally{for(const server of [first])if(server?.listening)await new Promise(r=>server.close(r))}
})().catch(e=>{console.error(e);process.exitCode=1});
