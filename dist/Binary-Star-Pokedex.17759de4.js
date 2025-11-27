// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

(function (
  modules,
  entry,
  mainEntry,
  parcelRequireName,
  externals,
  distDir,
  publicUrl,
  devServer
) {
  /* eslint-disable no-undef */
  var globalObject =
    typeof globalThis !== 'undefined'
      ? globalThis
      : typeof self !== 'undefined'
      ? self
      : typeof window !== 'undefined'
      ? window
      : typeof global !== 'undefined'
      ? global
      : {};
  /* eslint-enable no-undef */

  // Save the require from previous bundle to this closure if any
  var previousRequire =
    typeof globalObject[parcelRequireName] === 'function' &&
    globalObject[parcelRequireName];

  var importMap = previousRequire.i || {};
  var cache = previousRequire.cache || {};
  // Do not use `require` to prevent Webpack from trying to bundle this call
  var nodeRequire =
    typeof module !== 'undefined' &&
    typeof module.require === 'function' &&
    module.require.bind(module);

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        if (externals[name]) {
          return externals[name];
        }
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire =
          typeof globalObject[parcelRequireName] === 'function' &&
          globalObject[parcelRequireName];
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error("Cannot find module '" + name + "'");
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = (cache[name] = new newRequire.Module(name));

      modules[name][0].call(
        module.exports,
        localRequire,
        module,
        module.exports,
        globalObject
      );
    }

    return cache[name].exports;

    function localRequire(x) {
      var res = localRequire.resolve(x);
      if (res === false) {
        return {};
      }
      // Synthesize a module to follow re-exports.
      if (Array.isArray(res)) {
        var m = {__esModule: true};
        res.forEach(function (v) {
          var key = v[0];
          var id = v[1];
          var exp = v[2] || v[0];
          var x = newRequire(id);
          if (key === '*') {
            Object.keys(x).forEach(function (key) {
              if (
                key === 'default' ||
                key === '__esModule' ||
                Object.prototype.hasOwnProperty.call(m, key)
              ) {
                return;
              }

              Object.defineProperty(m, key, {
                enumerable: true,
                get: function () {
                  return x[key];
                },
              });
            });
          } else if (exp === '*') {
            Object.defineProperty(m, key, {
              enumerable: true,
              value: x,
            });
          } else {
            Object.defineProperty(m, key, {
              enumerable: true,
              get: function () {
                if (exp === 'default') {
                  return x.__esModule ? x.default : x;
                }
                return x[exp];
              },
            });
          }
        });
        return m;
      }
      return newRequire(res);
    }

    function resolve(x) {
      var id = modules[name][1][x];
      return id != null ? id : x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.require = nodeRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.distDir = distDir;
  newRequire.publicUrl = publicUrl;
  newRequire.devServer = devServer;
  newRequire.i = importMap;
  newRequire.register = function (id, exports) {
    modules[id] = [
      function (require, module) {
        module.exports = exports;
      },
      {},
    ];
  };

  // Only insert newRequire.load when it is actually used.
  // The code in this file is linted against ES5, so dynamic import is not allowed.
  // INSERT_LOAD_HERE

  Object.defineProperty(newRequire, 'root', {
    get: function () {
      return globalObject[parcelRequireName];
    },
  });

  globalObject[parcelRequireName] = newRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (mainEntry) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(mainEntry);

    // CommonJS
    if (typeof exports === 'object' && typeof module !== 'undefined') {
      module.exports = mainExports;

      // RequireJS
    } else if (typeof define === 'function' && define.amd) {
      define(function () {
        return mainExports;
      });
    }
  }
})({"kP0AL":[function(require,module,exports,__globalThis) {
var global = arguments[3];
var HMR_HOST = null;
var HMR_PORT = null;
var HMR_SERVER_PORT = 1234;
var HMR_SECURE = false;
var HMR_ENV_HASH = "439701173a9199ea";
var HMR_USE_SSE = false;
module.bundle.HMR_BUNDLE_ID = "c8ee7d1e17759de4";
"use strict";
/* global HMR_HOST, HMR_PORT, HMR_SERVER_PORT, HMR_ENV_HASH, HMR_SECURE, HMR_USE_SSE, chrome, browser, __parcel__import__, __parcel__importScripts__, ServiceWorkerGlobalScope */ /*::
import type {
  HMRAsset,
  HMRMessage,
} from '@parcel/reporter-dev-server/src/HMRServer.js';
interface ParcelRequire {
  (string): mixed;
  cache: {|[string]: ParcelModule|};
  hotData: {|[string]: mixed|};
  Module: any;
  parent: ?ParcelRequire;
  isParcelRequire: true;
  modules: {|[string]: [Function, {|[string]: string|}]|};
  HMR_BUNDLE_ID: string;
  root: ParcelRequire;
}
interface ParcelModule {
  hot: {|
    data: mixed,
    accept(cb: (Function) => void): void,
    dispose(cb: (mixed) => void): void,
    // accept(deps: Array<string> | string, cb: (Function) => void): void,
    // decline(): void,
    _acceptCallbacks: Array<(Function) => void>,
    _disposeCallbacks: Array<(mixed) => void>,
  |};
}
interface ExtensionContext {
  runtime: {|
    reload(): void,
    getURL(url: string): string;
    getManifest(): {manifest_version: number, ...};
  |};
}
declare var module: {bundle: ParcelRequire, ...};
declare var HMR_HOST: string;
declare var HMR_PORT: string;
declare var HMR_SERVER_PORT: string;
declare var HMR_ENV_HASH: string;
declare var HMR_SECURE: boolean;
declare var HMR_USE_SSE: boolean;
declare var chrome: ExtensionContext;
declare var browser: ExtensionContext;
declare var __parcel__import__: (string) => Promise<void>;
declare var __parcel__importScripts__: (string) => Promise<void>;
declare var globalThis: typeof self;
declare var ServiceWorkerGlobalScope: Object;
*/ var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;
function Module(moduleName) {
    OldModule.call(this, moduleName);
    this.hot = {
        data: module.bundle.hotData[moduleName],
        _acceptCallbacks: [],
        _disposeCallbacks: [],
        accept: function(fn) {
            this._acceptCallbacks.push(fn || function() {});
        },
        dispose: function(fn) {
            this._disposeCallbacks.push(fn);
        }
    };
    module.bundle.hotData[moduleName] = undefined;
}
module.bundle.Module = Module;
module.bundle.hotData = {};
var checkedAssets /*: {|[string]: boolean|} */ , disposedAssets /*: {|[string]: boolean|} */ , assetsToDispose /*: Array<[ParcelRequire, string]> */ , assetsToAccept /*: Array<[ParcelRequire, string]> */ , bundleNotFound = false;
function getHostname() {
    return HMR_HOST || (typeof location !== 'undefined' && location.protocol.indexOf('http') === 0 ? location.hostname : 'localhost');
}
function getPort() {
    return HMR_PORT || (typeof location !== 'undefined' ? location.port : HMR_SERVER_PORT);
}
// eslint-disable-next-line no-redeclare
let WebSocket = globalThis.WebSocket;
if (!WebSocket && typeof module.bundle.root === 'function') try {
    // eslint-disable-next-line no-global-assign
    WebSocket = module.bundle.root('ws');
} catch  {
// ignore.
}
var hostname = getHostname();
var port = getPort();
var protocol = HMR_SECURE || typeof location !== 'undefined' && location.protocol === 'https:' && ![
    'localhost',
    '127.0.0.1',
    '0.0.0.0'
].includes(hostname) ? 'wss' : 'ws';
// eslint-disable-next-line no-redeclare
var parent = module.bundle.parent;
if (!parent || !parent.isParcelRequire) {
    // Web extension context
    var extCtx = typeof browser === 'undefined' ? typeof chrome === 'undefined' ? null : chrome : browser;
    // Safari doesn't support sourceURL in error stacks.
    // eval may also be disabled via CSP, so do a quick check.
    var supportsSourceURL = false;
    try {
        (0, eval)('throw new Error("test"); //# sourceURL=test.js');
    } catch (err) {
        supportsSourceURL = err.stack.includes('test.js');
    }
    var ws;
    if (HMR_USE_SSE) ws = new EventSource('/__parcel_hmr');
    else try {
        // If we're running in the dev server's node runner, listen for messages on the parent port.
        let { workerData, parentPort } = module.bundle.root('node:worker_threads') /*: any*/ ;
        if (workerData !== null && workerData !== void 0 && workerData.__parcel) {
            parentPort.on('message', async (message)=>{
                try {
                    await handleMessage(message);
                    parentPort.postMessage('updated');
                } catch  {
                    parentPort.postMessage('restart');
                }
            });
            // After the bundle has finished running, notify the dev server that the HMR update is complete.
            queueMicrotask(()=>parentPort.postMessage('ready'));
        }
    } catch  {
        if (typeof WebSocket !== 'undefined') try {
            ws = new WebSocket(protocol + '://' + hostname + (port ? ':' + port : '') + '/');
        } catch (err) {
            // Ignore cloudflare workers error.
            if (err.message && !err.message.includes('Disallowed operation called within global scope')) console.error(err.message);
        }
    }
    if (ws) {
        // $FlowFixMe
        ws.onmessage = async function(event /*: {data: string, ...} */ ) {
            var data /*: HMRMessage */  = JSON.parse(event.data);
            await handleMessage(data);
        };
        if (ws instanceof WebSocket) {
            ws.onerror = function(e) {
                if (e.message) console.error(e.message);
            };
            ws.onclose = function() {
                console.warn("[parcel] \uD83D\uDEA8 Connection to the HMR server was lost");
            };
        }
    }
}
async function handleMessage(data /*: HMRMessage */ ) {
    checkedAssets = {} /*: {|[string]: boolean|} */ ;
    disposedAssets = {} /*: {|[string]: boolean|} */ ;
    assetsToAccept = [];
    assetsToDispose = [];
    bundleNotFound = false;
    if (data.type === 'reload') fullReload();
    else if (data.type === 'update') {
        // Remove error overlay if there is one
        if (typeof document !== 'undefined') removeErrorOverlay();
        let assets = data.assets;
        // Handle HMR Update
        let handled = assets.every((asset)=>{
            return asset.type === 'css' || asset.type === 'js' && hmrAcceptCheck(module.bundle.root, asset.id, asset.depsByBundle);
        });
        // Dispatch a custom event in case a bundle was not found. This might mean
        // an asset on the server changed and we should reload the page. This event
        // gives the client an opportunity to refresh without losing state
        // (e.g. via React Server Components). If e.preventDefault() is not called,
        // we will trigger a full page reload.
        if (handled && bundleNotFound && assets.some((a)=>a.envHash !== HMR_ENV_HASH) && typeof window !== 'undefined' && typeof CustomEvent !== 'undefined') handled = !window.dispatchEvent(new CustomEvent('parcelhmrreload', {
            cancelable: true
        }));
        if (handled) {
            console.clear();
            // Dispatch custom event so other runtimes (e.g React Refresh) are aware.
            if (typeof window !== 'undefined' && typeof CustomEvent !== 'undefined') window.dispatchEvent(new CustomEvent('parcelhmraccept'));
            await hmrApplyUpdates(assets);
            hmrDisposeQueue();
            // Run accept callbacks. This will also re-execute other disposed assets in topological order.
            let processedAssets = {};
            for(let i = 0; i < assetsToAccept.length; i++){
                let id = assetsToAccept[i][1];
                if (!processedAssets[id]) {
                    hmrAccept(assetsToAccept[i][0], id);
                    processedAssets[id] = true;
                }
            }
        } else fullReload();
    }
    if (data.type === 'error') {
        // Log parcel errors to console
        for (let ansiDiagnostic of data.diagnostics.ansi){
            let stack = ansiDiagnostic.codeframe ? ansiDiagnostic.codeframe : ansiDiagnostic.stack;
            console.error("\uD83D\uDEA8 [parcel]: " + ansiDiagnostic.message + '\n' + stack + '\n\n' + ansiDiagnostic.hints.join('\n'));
        }
        if (typeof document !== 'undefined') {
            // Render the fancy html overlay
            removeErrorOverlay();
            var overlay = createErrorOverlay(data.diagnostics.html);
            // $FlowFixMe
            document.body.appendChild(overlay);
        }
    }
}
function removeErrorOverlay() {
    var overlay = document.getElementById(OVERLAY_ID);
    if (overlay) {
        overlay.remove();
        console.log("[parcel] \u2728 Error resolved");
    }
}
function createErrorOverlay(diagnostics) {
    var overlay = document.createElement('div');
    overlay.id = OVERLAY_ID;
    let errorHTML = '<div style="background: black; opacity: 0.85; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; font-family: Menlo, Consolas, monospace; z-index: 9999;">';
    for (let diagnostic of diagnostics){
        let stack = diagnostic.frames.length ? diagnostic.frames.reduce((p, frame)=>{
            return `${p}
<a href="${protocol === 'wss' ? 'https' : 'http'}://${hostname}:${port}/__parcel_launch_editor?file=${encodeURIComponent(frame.location)}" style="text-decoration: underline; color: #888" onclick="fetch(this.href); return false">${frame.location}</a>
${frame.code}`;
        }, '') : diagnostic.stack;
        errorHTML += `
      <div>
        <div style="font-size: 18px; font-weight: bold; margin-top: 20px;">
          \u{1F6A8} ${diagnostic.message}
        </div>
        <pre>${stack}</pre>
        <div>
          ${diagnostic.hints.map((hint)=>"<div>\uD83D\uDCA1 " + hint + '</div>').join('')}
        </div>
        ${diagnostic.documentation ? `<div>\u{1F4DD} <a style="color: violet" href="${diagnostic.documentation}" target="_blank">Learn more</a></div>` : ''}
      </div>
    `;
    }
    errorHTML += '</div>';
    overlay.innerHTML = errorHTML;
    return overlay;
}
function fullReload() {
    if (typeof location !== 'undefined' && 'reload' in location) location.reload();
    else if (typeof extCtx !== 'undefined' && extCtx && extCtx.runtime && extCtx.runtime.reload) extCtx.runtime.reload();
    else try {
        let { workerData, parentPort } = module.bundle.root('node:worker_threads') /*: any*/ ;
        if (workerData !== null && workerData !== void 0 && workerData.__parcel) parentPort.postMessage('restart');
    } catch (err) {
        console.error("[parcel] \u26A0\uFE0F An HMR update was not accepted. Please restart the process.");
    }
}
function getParents(bundle, id) /*: Array<[ParcelRequire, string]> */ {
    var modules = bundle.modules;
    if (!modules) return [];
    var parents = [];
    var k, d, dep;
    for(k in modules)for(d in modules[k][1]){
        dep = modules[k][1][d];
        if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) parents.push([
            bundle,
            k
        ]);
    }
    if (bundle.parent) parents = parents.concat(getParents(bundle.parent, id));
    return parents;
}
function updateLink(link) {
    var href = link.getAttribute('href');
    if (!href) return;
    var newLink = link.cloneNode();
    newLink.onload = function() {
        if (link.parentNode !== null) // $FlowFixMe
        link.parentNode.removeChild(link);
    };
    newLink.setAttribute('href', // $FlowFixMe
    href.split('?')[0] + '?' + Date.now());
    // $FlowFixMe
    link.parentNode.insertBefore(newLink, link.nextSibling);
}
var cssTimeout = null;
function reloadCSS() {
    if (cssTimeout || typeof document === 'undefined') return;
    cssTimeout = setTimeout(function() {
        var links = document.querySelectorAll('link[rel="stylesheet"]');
        for(var i = 0; i < links.length; i++){
            // $FlowFixMe[incompatible-type]
            var href /*: string */  = links[i].getAttribute('href');
            var hostname = getHostname();
            var servedFromHMRServer = hostname === 'localhost' ? new RegExp('^(https?:\\/\\/(0.0.0.0|127.0.0.1)|localhost):' + getPort()).test(href) : href.indexOf(hostname + ':' + getPort());
            var absolute = /^https?:\/\//i.test(href) && href.indexOf(location.origin) !== 0 && !servedFromHMRServer;
            if (!absolute) updateLink(links[i]);
        }
        cssTimeout = null;
    }, 50);
}
function hmrDownload(asset) {
    if (asset.type === 'js') {
        if (typeof document !== 'undefined') {
            let script = document.createElement('script');
            script.src = asset.url + '?t=' + Date.now();
            if (asset.outputFormat === 'esmodule') script.type = 'module';
            return new Promise((resolve, reject)=>{
                var _document$head;
                script.onload = ()=>resolve(script);
                script.onerror = reject;
                (_document$head = document.head) === null || _document$head === void 0 || _document$head.appendChild(script);
            });
        } else if (typeof importScripts === 'function') {
            // Worker scripts
            if (asset.outputFormat === 'esmodule') return import(asset.url + '?t=' + Date.now());
            else return new Promise((resolve, reject)=>{
                try {
                    importScripts(asset.url + '?t=' + Date.now());
                    resolve();
                } catch (err) {
                    reject(err);
                }
            });
        }
    }
}
async function hmrApplyUpdates(assets) {
    global.parcelHotUpdate = Object.create(null);
    let scriptsToRemove;
    try {
        // If sourceURL comments aren't supported in eval, we need to load
        // the update from the dev server over HTTP so that stack traces
        // are correct in errors/logs. This is much slower than eval, so
        // we only do it if needed (currently just Safari).
        // https://bugs.webkit.org/show_bug.cgi?id=137297
        // This path is also taken if a CSP disallows eval.
        if (!supportsSourceURL) {
            let promises = assets.map((asset)=>{
                var _hmrDownload;
                return (_hmrDownload = hmrDownload(asset)) === null || _hmrDownload === void 0 ? void 0 : _hmrDownload.catch((err)=>{
                    // Web extension fix
                    if (extCtx && extCtx.runtime && extCtx.runtime.getManifest().manifest_version == 3 && typeof ServiceWorkerGlobalScope != 'undefined' && global instanceof ServiceWorkerGlobalScope) {
                        extCtx.runtime.reload();
                        return;
                    }
                    throw err;
                });
            });
            scriptsToRemove = await Promise.all(promises);
        }
        assets.forEach(function(asset) {
            hmrApply(module.bundle.root, asset);
        });
    } finally{
        delete global.parcelHotUpdate;
        if (scriptsToRemove) scriptsToRemove.forEach((script)=>{
            if (script) {
                var _document$head2;
                (_document$head2 = document.head) === null || _document$head2 === void 0 || _document$head2.removeChild(script);
            }
        });
    }
}
function hmrApply(bundle /*: ParcelRequire */ , asset /*:  HMRAsset */ ) {
    var modules = bundle.modules;
    if (!modules) return;
    if (asset.type === 'css') reloadCSS();
    else if (asset.type === 'js') {
        let deps = asset.depsByBundle[bundle.HMR_BUNDLE_ID];
        if (deps) {
            if (modules[asset.id]) {
                // Remove dependencies that are removed and will become orphaned.
                // This is necessary so that if the asset is added back again, the cache is gone, and we prevent a full page reload.
                let oldDeps = modules[asset.id][1];
                for(let dep in oldDeps)if (!deps[dep] || deps[dep] !== oldDeps[dep]) {
                    let id = oldDeps[dep];
                    let parents = getParents(module.bundle.root, id);
                    if (parents.length === 1) hmrDelete(module.bundle.root, id);
                }
            }
            if (supportsSourceURL) // Global eval. We would use `new Function` here but browser
            // support for source maps is better with eval.
            (0, eval)(asset.output);
            // $FlowFixMe
            let fn = global.parcelHotUpdate[asset.id];
            modules[asset.id] = [
                fn,
                deps
            ];
        }
        // Always traverse to the parent bundle, even if we already replaced the asset in this bundle.
        // This is required in case modules are duplicated. We need to ensure all instances have the updated code.
        if (bundle.parent) hmrApply(bundle.parent, asset);
    }
}
function hmrDelete(bundle, id) {
    let modules = bundle.modules;
    if (!modules) return;
    if (modules[id]) {
        // Collect dependencies that will become orphaned when this module is deleted.
        let deps = modules[id][1];
        let orphans = [];
        for(let dep in deps){
            let parents = getParents(module.bundle.root, deps[dep]);
            if (parents.length === 1) orphans.push(deps[dep]);
        }
        // Delete the module. This must be done before deleting dependencies in case of circular dependencies.
        delete modules[id];
        delete bundle.cache[id];
        // Now delete the orphans.
        orphans.forEach((id)=>{
            hmrDelete(module.bundle.root, id);
        });
    } else if (bundle.parent) hmrDelete(bundle.parent, id);
}
function hmrAcceptCheck(bundle /*: ParcelRequire */ , id /*: string */ , depsByBundle /*: ?{ [string]: { [string]: string } }*/ ) {
    checkedAssets = {};
    if (hmrAcceptCheckOne(bundle, id, depsByBundle)) return true;
    // Traverse parents breadth first. All possible ancestries must accept the HMR update, or we'll reload.
    let parents = getParents(module.bundle.root, id);
    let accepted = false;
    while(parents.length > 0){
        let v = parents.shift();
        let a = hmrAcceptCheckOne(v[0], v[1], null);
        if (a) // If this parent accepts, stop traversing upward, but still consider siblings.
        accepted = true;
        else if (a !== null) {
            // Otherwise, queue the parents in the next level upward.
            let p = getParents(module.bundle.root, v[1]);
            if (p.length === 0) {
                // If there are no parents, then we've reached an entry without accepting. Reload.
                accepted = false;
                break;
            }
            parents.push(...p);
        }
    }
    return accepted;
}
function hmrAcceptCheckOne(bundle /*: ParcelRequire */ , id /*: string */ , depsByBundle /*: ?{ [string]: { [string]: string } }*/ ) {
    var modules = bundle.modules;
    if (!modules) return;
    if (depsByBundle && !depsByBundle[bundle.HMR_BUNDLE_ID]) {
        // If we reached the root bundle without finding where the asset should go,
        // there's nothing to do. Mark as "accepted" so we don't reload the page.
        if (!bundle.parent) {
            bundleNotFound = true;
            return true;
        }
        return hmrAcceptCheckOne(bundle.parent, id, depsByBundle);
    }
    if (checkedAssets[id]) return null;
    checkedAssets[id] = true;
    var cached = bundle.cache[id];
    if (!cached) return true;
    assetsToDispose.push([
        bundle,
        id
    ]);
    if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
        assetsToAccept.push([
            bundle,
            id
        ]);
        return true;
    }
    return false;
}
function hmrDisposeQueue() {
    // Dispose all old assets.
    for(let i = 0; i < assetsToDispose.length; i++){
        let id = assetsToDispose[i][1];
        if (!disposedAssets[id]) {
            hmrDispose(assetsToDispose[i][0], id);
            disposedAssets[id] = true;
        }
    }
    assetsToDispose = [];
}
function hmrDispose(bundle /*: ParcelRequire */ , id /*: string */ ) {
    var cached = bundle.cache[id];
    bundle.hotData[id] = {};
    if (cached && cached.hot) cached.hot.data = bundle.hotData[id];
    if (cached && cached.hot && cached.hot._disposeCallbacks.length) cached.hot._disposeCallbacks.forEach(function(cb) {
        cb(bundle.hotData[id]);
    });
    delete bundle.cache[id];
}
function hmrAccept(bundle /*: ParcelRequire */ , id /*: string */ ) {
    // Execute the module.
    bundle(id);
    // Run the accept callbacks in the new version of the module.
    var cached = bundle.cache[id];
    if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
        let assetsToAlsoAccept = [];
        cached.hot._acceptCallbacks.forEach(function(cb) {
            let additionalAssets = cb(function() {
                return getParents(module.bundle.root, id);
            });
            if (Array.isArray(additionalAssets) && additionalAssets.length) assetsToAlsoAccept.push(...additionalAssets);
        });
        if (assetsToAlsoAccept.length) {
            let handled = assetsToAlsoAccept.every(function(a) {
                return hmrAcceptCheck(a[0], a[1]);
            });
            if (!handled) return fullReload();
            hmrDisposeQueue();
        }
    }
}

},{}],"rXnTZ":[function(require,module,exports,__globalThis) {
BattleSearch.urlRoot = Config.baseurl;
window.Topbar = Panels.Topbar.extend({
    height: 51
});
window.PokedexResultPanel = Panels.Panel.extend({
    minWidth: 639,
    maxWidth: 639,
    initialize: function() {
        this.html('not found: ' + Array.prototype.join.call(arguments, ' || '));
    }
});
window.PokedexItemPanel = PokedexResultPanel.extend({
    initialize: function(id) {
        id = toID(id);
        var item = getID(BattleItems, id);
        this.shortTitle = item.name;
        var buf = '<div class="pfx-body dexentry">';
        buf += '<a href="' + Config.baseurl + '" class="pfx-backbutton" data-target="back"><i class="fa fa-chevron-left"></i> Pok&eacute;dex</a>';
        buf += '<h1><span class="itemicon" style="' + getItemIcon(item) + '"</span> <a href="' + Config.baseurl + 'items/' + id + '" data-target="push" class="subtle">' + item.name + '</a></h1>';
        // Buy and sell prices
        var buyPrice = item.buyPrice || 0;
        var sellPrice = item.sellPrice || 0;
        if (buyPrice > 0 || sellPrice > 0) {
            buf += '<p class="resultsub">';
            buf += '<strong>Buy:</strong> ' + (buyPrice > 0 ? '$' + buyPrice.toLocaleString() : 'N/A');
            buf += ' &nbsp;&nbsp; <strong>Sell:</strong> ' + (sellPrice > 0 ? '$' + sellPrice.toLocaleString() : 'N/A');
            buf += '</p>';
        }
        buf += '<p>' + escapeHTML(item.desc || item.shortDesc) + '</p>';
        // Related Pokémon - Pokémon mentioned in this item's description
        var relatedPokemonIds = ItemPokemonLinks.itemToPokemon[id] || [];
        if (relatedPokemonIds.length > 0) {
            var relatedPokemon = relatedPokemonIds.map(function(pokemonId) {
                return BattlePokedex[pokemonId];
            }).filter(Boolean);
            buf += '<h3>Related Pok&eacute;mon</h3>';
            buf += '<ul class="utilichart nokbd">';
            for(var i = 0; i < relatedPokemon.length; i++)buf += BattleSearch.renderPokemonRow(relatedPokemon[i]);
            buf += '</ul>';
        }
        buf += '</div>';
        this.html(buf);
    }
});
window.PokedexAbilityPanel = PokedexResultPanel.extend({
    abilityTags: {
        'ironfist': 'fist',
        'megalauncher': 'pulse',
        'strongjaw': 'bite',
        'bulletproof': 'ballistic',
        'sharpness': 'slicing',
        'windpower': 'wind',
        'windrider': 'wind',
        'soundproof': 'sound',
        'overcoat': 'powder'
    },
    initialize: function(id) {
        id = toID(id);
        var ability = getID(BattleAbilities, id);
        this.id = id;
        this.shortTitle = ability.name;
        var buf = '<div class="pfx-body dexentry">';
        buf += '<a href="' + Config.baseurl + '" class="pfx-backbutton" data-target="back"><i class="fa fa-chevron-left"></i> Pok&eacute;dex</a>';
        buf += '<h1><a href="' + Config.baseurl + 'abilities/' + id + '" data-target="push" class="subtle">' + ability.name + '</a></h1>';
        if (ability.isNonstandard && ability.id !== 'noability') buf += '<div class="warning"><strong>Note:</strong> This is a made-up ability by <a href="http://www.smogon.com/cap/" target="_blank">Smogon CAP</a>.</div>';
        buf += '<p>' + escapeHTML(ability.desc) + '</p>';
        // Add tag links if this ability has associated tags
        if (this.abilityTags[id]) {
            var tag = this.abilityTags[id];
            var tagName = tag.charAt(0).toUpperCase() + tag.slice(1);
            if (tag === 'fist') tagName = 'Fist';
            if (tag === 'ballistic') tagName = 'Ballistic';
            buf += '<p class="movetag"><a href="' + Config.baseurl + 'tags/' + tag + '" data-target="push">Related moves: ' + tagName + '</a></p>';
        }
        // pokemon
        buf += '<h3>Pok&eacute;mon with this ability</h3>';
        buf += '<ul class="utilichart nokbd">';
        buf += '</ul>';
        buf += '</div>';
        this.html(buf);
        setTimeout(this.renderPokemonList.bind(this));
    },
    renderPokemonList: function(list) {
        var ability = getID(BattleAbilities, this.id);
        var buf = '';
        for(var pokemonid in BattlePokedex){
            var template = BattlePokedex[pokemonid];
            if (template.isNonstandard && !ability.isNonstandard) continue;
            if (template.abilities['0'] === ability.name || template.abilities['1'] === ability.name || template.abilities['H'] === ability.name) buf += BattleSearch.renderPokemonRow(template);
        }
        this.$('.utilichart').html(buf);
    }
});
window.PokedexTypePanel = PokedexResultPanel.extend({
    BattleSearchCountIndex: {},
    buildCountIndex: function() {
        for(const type in BattleTypeChart){
            this.BattleSearchCountIndex[type + " move"] = Object.values(BattleMovedex).filter((move)=>move.type === type.name).length;
            this.BattleSearchCountIndex[type + "pokemon"] = Object.values(BattlePokedex).filter((p)=>p.types.indexOf(type.name) >= 0).length;
        }
    },
    initialize: function(id) {
        id = toID(id);
        this.type = id[0].toUpperCase() + id.substr(1);
        var type = getID(BattleTypeChart, this.type);
        this.shortTitle = this.type;
        this.buildCountIndex();
        var buf = '<div class="pfx-body dexentry">';
        buf += '<a href="' + Config.baseurl + '" class="pfx-backbutton" data-target="back"><i class="fa fa-chevron-left"></i> Pok&eacute;dex</a>';
        buf += '<h1><a href="' + Config.baseurl + 'types/' + id + '" data-target="push" class="subtle">' + this.type + '</a></h1>';
        buf += '<dl>';
        var atLeastOne = false;
        buf += '<dt>Weaknesses:</dt> <dd>';
        for(let id in BattleTypeChart){
            let attackType = BattleTypeChart[id];
            if (attackType.effectiveness[type.name] == 2) {
                buf += '<a href="' + Config.baseurl + 'types/' + toID(attackType) + '" data-target="push">' + getTypeIcon(attackType) + '</a> ';
                atLeastOne = true;
            }
        }
        if (!atLeastOne) buf += '<em>No weaknesses</em>';
        buf += '</dd>';
        buf += '<dt>Resistances:</dt> <dd>';
        atLeastOne = false;
        for(let id in BattleTypeChart){
            let attackType = BattleTypeChart[id];
            if (attackType.effectiveness[type.name] == 0.5) {
                buf += '<a href="' + Config.baseurl + 'types/' + toID(attackType) + '" data-target="push">' + getTypeIcon(attackType) + '</a> ';
                atLeastOne = true;
            }
        }
        if (!atLeastOne) buf += '<em>No resistances</em>';
        buf += '</dd>';
        buf += '<dt>Immunities:</dt> <dd>';
        atLeastOne = false;
        for(let id in BattleTypeChart){
            let attackType = BattleTypeChart[id];
            if (attackType.effectiveness[type.name] == 0) {
                buf += '<a href="' + Config.baseurl + 'types/' + toID(attackType) + '" data-target="push">' + getTypeIcon(attackType) + '</a> ';
                atLeastOne = true;
            }
        }
        if (!atLeastOne) buf += '<em>No immunities</em>';
        buf += '</dd>';
        buf += '</dl>';
        // move list
        buf += '<ul class="tabbar"><li><button class="button nav-first cur" value="move">Moves</button></li><li><button class="button nav-last" value="pokemon">Pokemon</button></li></ul>';
        buf += '<ul class="utilichart nokbd">';
        buf += '</ul>';
        buf += '</div>';
        this.html(buf);
        setTimeout(this.renderMoveList.bind(this));
    },
    events: {
        'click .tabbar button': 'selectTab'
    },
    selectTab: function(e) {
        this.$('.tabbar button').removeClass('cur');
        $(e.currentTarget).addClass('cur');
        switch(e.currentTarget.value){
            case 'move':
                this.renderMoveList();
                break;
            case 'pokemon':
                this.renderPokemonList();
                break;
        }
    },
    renderMoveList: function() {
        var type = this.type;
        var buf = '<li class="resultheader"><h3>Physical ' + type + ' moves</h3></li>';
        for(var moveid in BattleMovedex){
            var move = BattleMovedex[moveid];
            if (move.type === type && move.category === 'Physical') buf += BattleSearch.renderMoveRow(move);
        }
        this.$('.utilichart').html(buf).css('min-height', 81 + 33 * this.BattleSearchCountIndex[type + ' move']);
        setTimeout(this.renderMoveList2.bind(this));
    },
    renderMoveList2: function() {
        var type = this.type;
        var bufs = [
            '<li class="resultheader"><h3>Physical ' + type + ' moves</h3></li>',
            '<li class="resultheader"><h3>Special ' + type + ' moves</h3></li>',
            '<li class="resultheader"><h3>Status ' + type + ' moves</h3></li>'
        ];
        var bufChart = {
            Physical: 0,
            Special: 1,
            Status: 2
        };
        for(var moveid in BattleMovedex){
            var move = BattleMovedex[moveid];
            if (move.type === type) bufs[bufChart[move.category]] += BattleSearch.renderMoveRow(move);
        }
        this.$('.utilichart').html(bufs.join('')).css('min-height', 81 + 33 * this.BattleSearchCountIndex[type + ' move']);
    },
    renderPokemonList: function() {
        var type = this.type;
        var pureBuf = '<li class="resultheader"><h3>Pure ' + type + ' Pok&eacute;mon</h3></li>';
        for(var templateid in BattlePokedex){
            var template = BattlePokedex[templateid];
            if (template.types[0] === type && !template.types[1]) pureBuf += BattleSearch.renderPokemonRow(template);
        }
        this.$('.utilichart').html(pureBuf).css('min-height', 81 + 33 * this.BattleSearchCountIndex[type + ' pokemon']);
        setTimeout(this.renderPokemonList2.bind(this));
    },
    renderPokemonList2: function() {
        var type = this.type;
        var primaryBuf = '<li class="resultheader"><h3>Primary ' + type + ' Pok&eacute;mon</h3></li>';
        var secondaryBuf = '<li class="resultheader"><h3>Secondary ' + type + ' Pok&eacute;mon</h3></li>';
        for(var templateid in BattlePokedex){
            var template = BattlePokedex[templateid];
            if (template.types[0] === type) {
                if (template.types[1]) primaryBuf += BattleSearch.renderPokemonRow(template);
            } else if (template.types[1] === type) secondaryBuf += BattleSearch.renderPokemonRow(template);
        }
        this.$('.utilichart').append(primaryBuf + secondaryBuf);
    }
});
window.PokedexTagPanel = PokedexResultPanel.extend({
    table: {
        contact: {
            name: 'Contact',
            tag: 'contact',
            desc: 'Affected by a variety of moves, abilities, and items.</p><p>Moves affected by contact moves include: Spiky Shield, King\'s Shield. Abilities affected by contact moves include: Iron Barbs, Rough Skin, Gooey, Flame Body, Static, Tough Claws. Items affected by contact moves include: Rocky Helmet, Sticky Barb.'
        },
        sound: {
            name: 'Sound',
            tag: 'sound',
            desc: 'Bypasses <a href="' + Config.baseurl + 'moves/substitute" data-target="push">Substitute</a>. Doesn\'t affect <a href="' + Config.baseurl + 'abilities/soundproof" data-target="push">Soundproof</a> Pok&eacute;mon.'
        },
        powder: {
            name: 'Powder',
            tag: 'powder',
            desc: 'Doesn\'t affect <a href="' + Config.baseurl + 'types/grass" data-target="push">Grass-type</a> Pok&eacute;mon, <a href="' + Config.baseurl + 'abilities/overcoat" data-target="push">Overcoat</a> Pok&eacute;mon, or <a href="' + Config.baseurl + 'items/safetygoggles" data-target="push">Safety Goggles</a> holders.'
        },
        fist: {
            name: 'Fist',
            tag: 'punch',
            desc: 'Boosted 1.2x by <a href="' + Config.baseurl + 'abilities/ironfist" data-target="push">Iron Fist</a>.'
        },
        pulse: {
            name: 'Pulse',
            tag: 'pulse',
            desc: 'Boosted 1.5x by <a href="' + Config.baseurl + 'abilities/megalauncher" data-target="push">Mega Launcher</a>.'
        },
        bite: {
            name: 'Bite',
            tag: 'bite',
            desc: 'Boosted 1.5x by <a href="' + Config.baseurl + 'abilities/strongjaw" data-target="push">Strong Jaw</a>.'
        },
        ballistic: {
            name: 'Ballistic',
            tag: 'bullet',
            desc: 'Doesn\'t affect <a href="' + Config.baseurl + 'abilities/bulletproof" data-target="push">Bulletproof</a> Pok&eacute;mon.'
        },
        slicing: {
            name: 'Slicing',
            tag: 'slicing',
            desc: 'Boosted 1.5x by <a href="' + Config.baseurl + 'abilities/sharpness" data-target="push">Sharpness</a>.'
        },
        wind: {
            name: 'Wind',
            tag: 'wind',
            desc: 'Pok&eacute;mon with <a href="' + Config.baseurl + 'abilities/windpower" data-target="push">Wind Power</a> gain the charge effect after being hit. Pok&eacute;mon with <a href="' + Config.baseurl + 'abilities/windrider" data-target="push">Wind Rider</a> have their Attack raised by 1 stage and are immune.'
        },
        bypassprotect: {
            name: 'Bypass Protect',
            tag: '',
            desc: 'Bypasses <a class="subtle" href="' + Config.baseurl + 'moves/protect" data-target="push">Protect</a>, <a class="subtle" href="' + Config.baseurl + 'moves/detect" data-target="push">Detect</a>, <a class="subtle" href="' + Config.baseurl + 'moves/kingsshield" data-target="push">King\'s Shield</a>, and <a class="subtle" href="' + Config.baseurl + 'moves/spikyshield" data-target="push">Spiky Shield</a>.'
        },
        nonreflectable: {
            name: 'Nonreflectable',
            tag: '',
            desc: 'Can\'t be bounced by <a class="subtle" href="' + Config.baseurl + 'moves/magiccoat" data-target="push">Magic Coat</a> or <a class="subtle" href="' + Config.baseurl + 'abilities/magicbounce" data-target="push">Magic Bounce</a>.'
        },
        nonmirror: {
            name: 'Nonmirror',
            tag: '',
            desc: 'Can\'t be copied by <a class="subtle" href="' + Config.baseurl + 'moves/mirrormove" data-target="push">Mirror Move</a>.'
        },
        nonsnatchable: {
            name: 'Nonsnatchable',
            tag: '',
            desc: 'Can\'t be stolen by <a class="subtle" href="' + Config.baseurl + 'moves/snatch" data-target="push">Snatch</a>.'
        },
        bypasssub: {
            name: 'Bypass Substitute',
            tag: 'bypasssub',
            desc: 'Bypasses but does not break a <a class="subtle" href="' + Config.baseurl + 'moves/substitute" data-target="push">Substitute</a>.'
        },
        snatchable: {
            name: 'Snatchable',
            tag: '',
            desc: 'Can be stolen by <a class="subtle" href="' + Config.baseurl + 'moves/snatch" data-target="push">Snatch</a>.'
        },
        zmove: {
            name: 'Z-Move',
            tag: '',
            desc: 'Is a <a class="subtle" href="' + Config.baseurl + 'articles/zmoves" data-target="push">Z-Move</a>.'
        },
        maxmove: {
            name: 'Max Move',
            tag: '',
            desc: 'Is a <a class="subtle" href="' + Config.baseurl + 'articles/maxmoves" data-target="push">Max Move</a>.'
        },
        gmaxmove: {
            name: 'G-Max Move',
            tag: '',
            desc: 'Is a <a class="subtle" href="' + Config.baseurl + 'articles/gmaxmoves" data-target="push">G-Max Move</a>.'
        }
    },
    initialize: function(id) {
        var tag = this.table[id];
        var name = tag ? tag.name : id;
        this.id = id;
        this.shortTitle = name;
        var buf = '<div class="pfx-body dexentry">';
        buf += '<a href="' + Config.baseurl + '" class="pfx-backbutton" data-target="back"><i class="fa fa-chevron-left"></i> Pok&eacute;dex</a>';
        buf += '<h1><a href="' + Config.baseurl + 'tags/' + id + '" data-target="push" class="subtle">' + name + '</a></h1>';
        if (tag) buf += '<p>' + tag.desc + '</p>';
        // distribution
        buf += '<h3>' + name + ' moves</h3>';
        buf += '<ul class="utilichart metricchart nokbd">';
        buf += '</ul>';
        buf += '</div>';
        this.html(buf);
        setTimeout(this.renderDistribution.bind(this));
    },
    getDistribution: function() {
        if (this.results) return this.results;
        var tag = this.id in this.table ? this.table[this.id].tag : this.id;
        var results = [];
        if (tag) {
            for(var moveid in BattleMovedex)if (BattleMovedex[moveid].flags && tag in BattleMovedex[moveid].flags) results.push(moveid);
        } else if (this.id === 'bypassprotect') {
            for(var moveid in BattleMovedex)if (BattleMovedex[moveid].target !== 'self' && BattleMovedex[moveid].flags && !('protect' in BattleMovedex[moveid].flags)) results.push(moveid);
        } else if (this.id === 'nonreflectable') {
            for(var moveid in BattleMovedex)if (BattleMovedex[moveid].target !== 'self' && BattleMovedex[moveid].category === 'Status' && BattleMovedex[moveid].flags && !('reflectable' in BattleMovedex[moveid].flags)) results.push(moveid);
        } else if (this.id === 'zmove') {
            for(var moveid in BattleMovedex)if (BattleMovedex[moveid].isZ) results.push(moveid);
        } else if (this.id === 'nonmirror') {
            for(var moveid in BattleMovedex)if (BattleMovedex[moveid].target !== 'self' && BattleMovedex[moveid].flags && !('mirror' in BattleMovedex[moveid].flags)) results.push(moveid);
        } else if (this.id === 'nonsnatchable') {
            for(var moveid in BattleMovedex)if ((BattleMovedex[moveid].target === 'allyTeam' || BattleMovedex[moveid].target === 'self' || BattleMovedex[moveid].target === 'adjacentAllyOrSelf') && BattleMovedex[moveid].flags && !('snatch' in BattleMovedex[moveid].flags)) results.push(moveid);
        } else if (this.id === 'snatchable') {
            for(var moveid in BattleMovedex)if ((BattleMovedex[moveid].target === 'allyTeam' || BattleMovedex[moveid].target === 'self' || BattleMovedex[moveid].target === 'adjacentAllyOrSelf') && BattleMovedex[moveid].flags && 'snatch' in BattleMovedex[moveid].flags) results.push(moveid);
        }
        return this.results = results;
    },
    renderDistribution: function() {
        var results = this.getDistribution();
        this.$chart = this.$('.utilichart');
        if (results.length > 1600 / 33) {
            this.streamLoading = true;
            this.$el.on('scroll', this.handleScroll.bind(this));
            var panelTop = this.$el.children().offset().top;
            var panelHeight = this.$el.outerHeight();
            var chartTop = this.$chart.offset().top;
            var scrollLoc = this.scrollLoc = this.$el.scrollTop();
            var start = Math.floor((scrollLoc - (chartTop - panelTop)) / 33 - 35);
            var end = Math.floor(start + 35 + panelHeight / 33 + 35);
            if (start < 0) start = 0;
            if (end > results.length - 1) end = results.length - 1;
            this.start = start, this.end = end;
            // distribution
            var buf = '';
            for(var i = 0, len = results.length; i < len; i++)buf += '<li class="result">' + this.renderRow(i, i < start || i > end) + '</li>';
            this.$chart.html(buf);
        } else {
            var buf = '';
            for(var i = 0, len = results.length; i < len; i++)buf += '<li class="result">' + this.renderRow(i) + '</li>';
            this.$chart.html(buf);
        }
    },
    renderRow: function(i, offscreen) {
        var results = this.results;
        var move = BattleMovedex[results[i]];
        if (offscreen) return move.name;
        else return BattleSearch.renderMoveRowInner(move);
    },
    handleScroll: function() {
        var scrollLoc = this.$el.scrollTop();
        if (Math.abs(scrollLoc - this.scrollLoc) > 660) this.renderUpdateDistribution();
    },
    debouncedPurgeTimer: null,
    renderUpdateDistribution: function(fullUpdate) {
        if (this.debouncedPurgeTimer) {
            clearTimeout(this.debouncedPurgeTimer);
            this.debouncedPurgeTimer = null;
        }
        var panelTop = this.$el.children().offset().top;
        var panelHeight = this.$el.outerHeight();
        var chartTop = this.$chart.offset().top;
        var scrollLoc = this.scrollLoc = this.$el.scrollTop();
        var results = this.results;
        var rowFit = Math.floor(panelHeight / 33);
        var start = Math.floor((scrollLoc - (chartTop - panelTop)) / 33 - 35);
        var end = start + 35 + rowFit + 35;
        if (start < 0) start = 0;
        if (end > results.length - 1) end = results.length - 1;
        var $rows = this.$chart.children();
        if (fullUpdate || start < this.start - rowFit - 30 || end > this.end + rowFit + 30) {
            var buf = '';
            for(var i = 0, len = results.length; i < len; i++)buf += '<li class="result">' + this.renderRow(i, i < start || i > end) + '</li>';
            this.$chart.html(buf);
            this.start = start, this.end = end;
            return;
        }
        if (start < this.start) {
            for(var i = start; i < this.start; i++)$rows[i].innerHTML = this.renderRow(i);
            this.start = start;
        }
        if (end > this.end) {
            for(var i = this.end + 1; i <= end; i++)$rows[i].innerHTML = this.renderRow(i);
            this.end = end;
        }
        if (this.end - this.start > rowFit + 90) {
            var self = this;
            this.debouncedPurgeTimer = setTimeout(function() {
                self.renderUpdateDistribution(true);
            }, 1000);
        }
    }
});
window.PokedexEggGroupPanel = PokedexResultPanel.extend({
    table: {
        amorphous: {
            name: 'Amorphous',
            desc: ""
        },
        bug: {
            name: 'Bug',
            desc: ""
        },
        ditto: {
            name: 'Ditto',
            desc: "Can breed with anything."
        },
        dragon: {
            name: 'Dragon',
            desc: ""
        },
        fairy: {
            name: 'Fairy',
            desc: ""
        },
        field: {
            name: 'Field',
            desc: ""
        },
        flying: {
            name: 'Flying',
            desc: ""
        },
        grass: {
            name: 'Grass',
            desc: ""
        },
        humanlike: {
            name: 'Human-Like',
            desc: ""
        },
        mineral: {
            name: 'Mineral',
            desc: ""
        },
        monster: {
            name: 'Monster',
            desc: ""
        },
        plant: {
            name: 'Plant',
            desc: ""
        },
        undiscovered: {
            name: 'Undiscovered',
            desc: "Can't breed."
        },
        water1: {
            name: 'Water 1',
            desc: ""
        },
        water2: {
            name: 'Water 2',
            desc: ""
        },
        water3: {
            name: 'Water 3',
            desc: ""
        }
    },
    initialize: function(id) {
        var ids = id.split('+');
        for(var i = 0; i < ids.length; i++)ids[i] = toID(ids[i]);
        this.id = ids[0];
        var names = this.table[ids[0]].name;
        this.shortTitle = names;
        if (ids[1]) {
            this.id2 = ids[1];
            names += ' + ' + this.table[ids[1]].name;
            this.shortTitle = "Egg groups";
        }
        var buf = '<div class="pfx-body dexentry">';
        buf += '<a href="' + Config.baseurl + '" class="pfx-backbutton" data-target="back"><i class="fa fa-chevron-left"></i> Pok&eacute;dex</a>';
        buf += '<h1><a href="' + Config.baseurl + 'egggroups/' + id + '" data-target="push" class="subtle">' + names + '</a></h1>';
        if (this.id2) buf += '<p>All Pok&eacute;mon in either the <a href="' + Config.baseurl + 'egggroups/' + this.id + '" data-target="push">' + this.table[ids[0]].name + '</a> or <a href="' + Config.baseurl + 'egggroups/' + this.id2 + '" data-target="push">' + this.table[ids[1]].name + '</a> egg group.</p>';
        else buf += '<p>' + this.table[ids[0]].desc + '</p>';
        // distribution
        buf += '<h3>Basic ' + names + ' pokemon</h3>';
        buf += '<ul class="utilichart metricchart nokbd">';
        buf += '</ul>';
        buf += '</div>';
        this.html(buf);
        setTimeout(this.renderDistribution.bind(this));
    },
    getDistribution: function() {
        var name = this.table[this.id].name;
        var name2 = '!';
        if (this.id2) name2 = this.table[this.id2].name;
        if (this.results) return this.results;
        var results = [];
        for(var pokemonid in BattlePokedex){
            var pokemon = BattlePokedex[pokemonid];
            var eggGroups = pokemon.eggGroups;
            // var prevo = toID(pokemon.prevo);
            if (!eggGroups || pokemon.forme) continue;
            // || (prevo && BattlePokedex[prevo].eggGroups[0] !== "Undiscovered") - irrelevant in gen 9
            if (pokemon && pokemon.isNonstandard) continue;
            if (eggGroups[0] === name || eggGroups[1] === name || eggGroups[0] === name2 || eggGroups[1] === name2) results.push(pokemonid);
        }
        results.sort();
        return this.results = results;
    },
    renderDistribution: function() {
        var results = this.getDistribution();
        this.$chart = this.$('.utilichart');
        if (results.length > 1600 / 33) {
            this.streamLoading = true;
            this.$el.on('scroll', this.handleScroll.bind(this));
            var panelTop = this.$el.children().offset().top;
            var panelHeight = this.$el.outerHeight();
            var chartTop = this.$chart.offset().top;
            var scrollLoc = this.scrollLoc = this.$el.scrollTop();
            var start = Math.floor((scrollLoc - (chartTop - panelTop)) / 33 - 35);
            var end = Math.floor(start + 35 + panelHeight / 33 + 35);
            if (start < 0) start = 0;
            if (end > results.length - 1) end = results.length - 1;
            this.start = start, this.end = end;
            // distribution
            var buf = '';
            for(var i = 0, len = results.length; i < len; i++)buf += '<li class="result">' + this.renderRow(i, i < start || i > end) + '</li>';
            this.$chart.html(buf);
        } else {
            var buf = '';
            for(var i = 0, len = results.length; i < len; i++)buf += '<li class="result">' + this.renderRow(i) + '</li>';
            this.$chart.html(buf);
        }
    },
    renderRow: function(i, offscreen) {
        var results = this.results;
        var template = BattlePokedex[results[i]];
        if (offscreen) return '' + template.species + ' ' + template.abilities['0'] + ' ' + (template.abilities['1'] || '') + ' ' + (template.abilities['H'] || '') + '';
        else return BattleSearch.renderTaggedPokemonRowInner(template, '<span class="picon" style="margin-top:-12px;' + getPokemonIcon('egg') + '"></span>');
    },
    handleScroll: function() {
        var scrollLoc = this.$el.scrollTop();
        if (Math.abs(scrollLoc - this.scrollLoc) > 660) this.renderUpdateDistribution();
    },
    debouncedPurgeTimer: null,
    renderUpdateDistribution: function(fullUpdate) {
        if (this.debouncedPurgeTimer) {
            clearTimeout(this.debouncedPurgeTimer);
            this.debouncedPurgeTimer = null;
        }
        var panelTop = this.$el.children().offset().top;
        var panelHeight = this.$el.outerHeight();
        var chartTop = this.$chart.offset().top;
        var scrollLoc = this.scrollLoc = this.$el.scrollTop();
        var results = this.results;
        var rowFit = Math.floor(panelHeight / 33);
        var start = Math.floor((scrollLoc - (chartTop - panelTop)) / 33 - 35);
        var end = start + 35 + rowFit + 35;
        if (start < 0) start = 0;
        if (end > results.length - 1) end = results.length - 1;
        var $rows = this.$chart.children();
        if (fullUpdate || start < this.start - rowFit - 30 || end > this.end + rowFit + 30) {
            var buf = '';
            for(var i = 0, len = results.length; i < len; i++)buf += '<li class="result">' + this.renderRow(i, i < start || i > end) + '</li>';
            this.$chart.html(buf);
            this.start = start, this.end = end;
            return;
        }
        if (start < this.start) {
            for(var i = start; i < this.start; i++)$rows[i].innerHTML = this.renderRow(i);
            this.start = start;
        }
        if (end > this.end) {
            for(var i = this.end + 1; i <= end; i++)$rows[i].innerHTML = this.renderRow(i);
            this.end = end;
        }
        if (this.end - this.start > rowFit + 90) {
            var self = this;
            this.debouncedPurgeTimer = setTimeout(function() {
                self.renderUpdateDistribution(true);
            }, 1000);
        }
    }
});
window.PokedexCategoryPanel = PokedexResultPanel.extend({
    initialize: function(id) {
        id = toID(id);
        var category = {
            id: id,
            name: id[0].toUpperCase() + id.substr(1)
        };
        this.shortTitle = category.name;
        var buf = '<div class="pfx-body dexentry">';
        buf += '<a href="' + Config.baseurl + '" class="pfx-backbutton" data-target="back"><i class="fa fa-chevron-left"></i> Pok&eacute;dex</a>';
        buf += '<h1><a href="' + Config.baseurl + 'categories/' + id + '" data-target="push" class="subtle">' + category.name + '</a></h1>';
        switch(id){
            case 'physical':
                buf += '<p>Physical moves are damaging moves generally calculated with the user\'s Attack stat and the target\'s Defense stat.</p>';
                break;
            case 'special':
                buf += '<p>Special moves are damaging moves generally calculated with the user\'s Special Attack stat and the target\'s Special Defense stat.</p>';
                break;
            case 'status':
                buf += '<p>Status moves are moves that don\'t deal damage directly.</p>';
                break;
        }
        buf += '</div>';
        this.html(buf);
    }
});
window.PokedexTierPanel = PokedexResultPanel.extend({
    initialize: function(id) {
        var tierTable = {
            ag: "AG",
            uber: "Uber",
            ou: "OU",
            uu: "UU",
            ru: "RU",
            nu: "NU",
            pu: "PU",
            nfe: "NFE",
            lcuber: "LC Uber",
            lc: "LC",
            cap: "CAP",
            capnfe: "CAP NFE",
            caplc: "CAP LC",
            uubl: "UUBL",
            rubl: "RUBL",
            nubl: "NUBL",
            publ: "PUBL",
            unreleased: "Unreleased",
            illegal: "Illegal"
        };
        var name = tierTable[id] || id;
        this.id = id;
        this.shortTitle = name;
        var buf = '<div class="pfx-body dexentry">';
        buf += '<a href="' + Config.baseurl + '" class="pfx-backbutton" data-target="back"><i class="fa fa-chevron-left"></i> Pok&eacute;dex</a>';
        buf += '<h1><a href="' + Config.baseurl + 'tiers/' + id + '" data-target="push" class="subtle">' + name + '</a></h1>';
        if (id === 'nfe') buf += "<p>\"NFE\" (Not Fully Evolved) as a tier refers to NFE Pok\xe9mon that aren't legal in LC and don't make the usage cutoff for a tier such as PU.</p>";
        if (id.startsWith('cap')) buf += '<div class="warning"><strong>Note:</strong> <a href="http://www.smogon.com/cap/" target="_blank">Smogon CAP</a> is a project to make up Pok&eacute;mon.</div>';
        // buf += '<p></p>';
        // pokemon
        buf += '<h3>Pok&eacute;mon in this tier</h3>';
        buf += '<ul class="utilichart nokbd">';
        buf += '</ul>';
        buf += '</div>';
        this.html(buf);
        setTimeout(this.renderPokemonList.bind(this));
    },
    renderPokemonList: function(list) {
        var tierName = this.shortTitle;
        var tierName2 = '(' + tierName + ')';
        var buf = '';
        for(var pokemonid in BattlePokedex){
            var template = BattlePokedex[pokemonid];
            if (template.tier === tierName || template.tier === tierName2) buf += BattleSearch.renderPokemonRow(template);
        }
        this.$('.utilichart').html(buf);
    }
});
window.PokedexArticlePanel = PokedexResultPanel.extend({
    initialize: function(id) {
        id = toID(id);
        this.shortTitle = id;
        var buf = '<div class="pfx-body dexentry">';
        buf += '<a href="' + Config.baseurl + '" class="pfx-backbutton" data-target="back"><i class="fa fa-chevron-left"></i> Pok&eacute;dex</a>';
        buf += '<h1><a href="' + Config.baseurl + 'articles/' + id + '" data-target="push" class="subtle">' + id + '</a></h1>';
        buf += '<div class="article-content"><em>Loading...</em></div>';
        buf += '</div>';
        this.html(buf);
        var self = this;
        $.get('/.articles-cached/' + id + '.html').done(function(html) {
            var html = html.replace(/<h1[^>]*>([^<]+)<\/h1>/, function(match, innerMatch) {
                self.shortTitle = innerMatch;
                self.$('h1').first().html('<a href="' + Config.baseurl + 'articles/' + id + '" class="subtle" data-target="push">' + innerMatch + '</a>');
                return '';
            });
            self.$('.article-content').html(html);
        });
    }
});

},{}]},["kP0AL","rXnTZ"], "rXnTZ", "parcelRequire6a64", {})

//# sourceMappingURL=Binary-Star-Pokedex.17759de4.js.map
