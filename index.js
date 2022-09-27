console.log("start")

const IS_WEB = !!globalThis.window;
globalThis._require = globalThis.require;

if(!IS_WEB){
  globalThis.fetch = globalThis.require('@agacraft/http').request;
}

if(IS_WEB){
  globalThis.require = async function (path) {
    const res = await fetch(path);
    const text = await res.text();
    const module = { exports: {} };
    new Function('module', 'exports', 'require', text)(module, module.exports, globalThis.require);
    return module.exports;
  };
  globalThis.__dirname = globalThis.location.href.split('/').slice(0, -1).join('/');
  globalThis.__filename = globalThis.location.href;
}
else{
  globalThis.require = async function (path) {
    return globalThis._require(path);
  };
  globalThis.__dirname = globalThis.process.cwd();
  globalThis.__filename = globalThis.process.argv[1];
}
console.log("end")
