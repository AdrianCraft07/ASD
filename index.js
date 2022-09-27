const IS_WEB = !!globalThis.window;

if(!IS_WEB){
  globalThis.fetch = globalThis.require('@agacraft/http').request;
}

if(IS_WEB){
  globalThis.include = async function (path) {
    const res = await fetch(path);
    const text = await res.text();
    const module = { exports: {} };
    new Function('module', 'exports', 'require', text)(module, module.exports, globalThis.include);
    return module.exports;
  };
  globalThis.__dirname = globalThis.location.href.split('/').slice(0, -1).join('/');
  globalThis.__filename = globalThis.location.href;
}
else{
  globalThis.include = async function (path) {
    if(isURL(path)){
      const res = await fetch(path);
      const text = await res.text();
      const module = { exports: {} };
      new Function('module', 'exports', 'require', text)(module, module.exports, globalThis.include);
      return module.exports;
    }
    return globalThis.require(path);
  };
  globalThis.__dirname = globalThis.process.cwd();
  globalThis.__filename = globalThis.process.argv[1];
}

function isURL(path){
  return path.startsWith('http://') || path.startsWith('https://')
}
