const fs=require('node:fs'),os=require('node:os'),path=require('node:path'),{spawnSync}=require('node:child_process');
const root=path.resolve(__dirname,'..'),scratch=fs.mkdtempSync(path.join(os.tmpdir(),'expresso-tests-'));
const originals=['database.sqlite','test/test.sqlite'].map(p=>fs.readFileSync(path.join(root,p)));
try{
 for(const item of ['server.js','api','test','database.sqlite'])fs.cpSync(path.join(root,item),path.join(scratch,item),{recursive:true});
 fs.symlinkSync(path.join(root,'node_modules'),path.join(scratch,'node_modules'),'dir');
 const result=spawnSync(process.execPath,[require.resolve('mocha/bin/mocha.js'),'--exit'],{cwd:scratch,stdio:'inherit',timeout:60000});
 if(result.error)throw result.error;process.exitCode=result.status??1;
 if(!process.exitCode){const smoke=spawnSync(process.execPath,[path.join(__dirname,'dependency-check.cjs')],{cwd:scratch,stdio:'inherit',timeout:10000});if(smoke.error)throw smoke.error;process.exitCode=smoke.status??1;}
}finally{
 fs.rmSync(scratch,{recursive:true,force:true});
 for(const [i,p] of ['database.sqlite','test/test.sqlite'].entries())if(!fs.readFileSync(path.join(root,p)).equals(originals[i]))throw new Error('Original database changed: '+p);
}
