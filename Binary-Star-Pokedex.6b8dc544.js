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
})({"bEuqE":[function(require,module,exports,__globalThis) {
var global = arguments[3];
var HMR_HOST = null;
var HMR_PORT = null;
var HMR_SERVER_PORT = 1234;
var HMR_SECURE = false;
var HMR_ENV_HASH = "439701173a9199ea";
var HMR_USE_SSE = false;
module.bundle.HMR_BUNDLE_ID = "3dc9fd9b6b8dc544";
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

},{}],"f4na6":[function(require,module,exports,__globalThis) {
window.PokedexMovePanel = PokedexResultPanel.extend({
    initialize: function(id) {
        id = toID(id);
        var move = getID(BattleMovedex, id);
        this.id = id;
        this.shortTitle = move.name;
        var buf = '<div class="pfx-body dexentry">';
        buf += '<a href="' + Config.baseurl + '" class="pfx-backbutton" data-target="back"><i class="fa fa-chevron-left"></i> Pok&eacute;dex</a>';
        buf += '<h1><a href="' + Config.baseurl + 'moves/' + id + '" data-target="push" class="subtle">' + move.name + '</a></h1>';
        if (move.id === 'magikarpsrevenge') buf += '<div class="warning"><strong>Note:</strong> Made for testing on Pok&eacute;mon Showdown, not a real move.</div>';
        else if (move.isNonstandard) {
            buf += '<div class="warning"><strong>Note:</strong> ';
            switch(move.isNonstandard){
                case 'Past':
                    buf += 'This move is only available in past generations.';
                    break;
                case 'Future':
                    buf += 'This move is only available in future generations.';
                    break;
                case 'Unobtainable':
                    if (move.isMax) buf += 'This move can\'t be learned normally, it can only be used by ' + (move.isMax === true ? 'Dynamaxing' : 'Gigantamaxing') + '.';
                    else if (move.isZ) buf += 'This move can\'t be learned normally, it can only be used with a Z-Crystal.';
                    else buf += 'This move can\'t be learned normally.';
                    break;
                case 'CAP':
                    buf += 'This is a made-up move by <a href="http://www.smogon.com/cap/" target="_blank">Smogon CAP</a>.';
                    break;
                case 'LGPE':
                    buf += 'This move is only available in Let\'s Go! Pikachu and Eevee.';
                    break;
                case 'Custom':
                    buf += 'This is a custom move, not available during normal gameplay.';
                    break;
            }
            buf += '</div>';
        }
        buf += '<dl class="movetypeentry">';
        buf += '<dt>Type:</dt> <dd>';
        buf += '<a class="type ' + toID(move.type) + '" href="' + Config.baseurl + 'types/' + toID(move.type) + '" data-target="push">' + move.type + '</a> ';
        buf += '<a class="type ' + toID(move.category) + '" href="' + Config.baseurl + 'categories/' + toID(move.category) + '" data-target="push">' + move.category + '</a>';
        buf += '</dd></dl>';
        if (move.category !== 'Status') buf += '<dl class="powerentry"><dt>Base power:</dt> <dd><strong>' + (move.basePower || '&mdash;') + '</strong></dd></dl>';
        buf += '<dl class="accuracyentry"><dt>Accuracy:</dt> <dd>' + (move.accuracy && move.accuracy !== true ? move.accuracy + '%' : '&mdash;') + '</dd></dl>';
        buf += '<dl class="ppentry"><dt>PP:</dt> <dd>' + move.pp + (move.noPPBoosts ? '' : ' <small class="minor">(max: ' + 1.6 * move.pp + ')</small>') + '</dd>';
        buf += '</dl><div style="clear:left;padding-top:1px"></div>';
        if (move.isZ) {
            buf += '<p><strong><a href="' + Config.baseurl + 'tags/zmove" data-target="push">[Z-Move]</a></strong>';
            if (move.isZ !== true) {
                var zItem = getID(BattleItems, move.isZ);
                buf += ' requiring <a href="' + Config.baseurl + 'items/' + zItem.id + '" data-target="push">' + zItem.name + '</a>';
            }
            buf += '</p>';
        } else if (move.isMax) {
            if (move.isMax !== true) {
                buf += '<p><strong><a href="' + Config.baseurl + 'tags/gmaxmove" data-target="push">[G-Max Move]</a></strong>';
                var maxUser = getID(BattlePokedex, move.isMax);
                buf += ' used by <a href="' + Config.baseurl + 'pokemon/' + maxUser.id + 'gmax" data-target="push">' + maxUser.name + '-Gmax</a>';
                if (maxUser.name === "Toxtricity") buf += ' or <a href="' + Config.baseurl + 'pokemon/' + maxUser.id + 'lowkeygmax" data-target="push">' + maxUser.name + '-Low-Key-Gmax</a>';
            } else buf += '<p><strong><a href="' + Config.baseurl + 'tags/maxmove" data-target="push">[Max Move]</a></strong>';
        }
        if (move.priority > 1) buf += '<p>Nearly always moves first <em>(priority +' + move.priority + ')</em>.</p>';
        else if (move.priority <= -1) buf += '<p>Nearly always moves last <em>(priority &minus;' + -move.priority + ')</em>.</p>';
        else if (move.priority === 1) buf += '<p>Usually moves first <em>(priority +' + move.priority + ')</em>.</p>';
        buf += '<p>' + escapeHTML(move.desc || move.shortDesc) + '</p>';
        // Special case: Certain moves should link to their related tag pages
        if (id === 'snatch') buf += '<p class="movetag"><a href="' + Config.baseurl + 'tags/snatchable" data-target="push">See all Snatchable moves</a></p>';
        if (id === 'protect' || id === 'detect' || id === 'kingsshield' || id === 'spikyshield' || id === 'banefulbunker') buf += '<p class="movetag"><a href="' + Config.baseurl + 'tags/bypassprotect" data-target="push">See all moves that bypass Protect</a></p>';
        if (id === 'magiccoat') buf += '<p class="movetag"><a href="' + Config.baseurl + 'tags/nonreflectable" data-target="push">See all Nonreflectable moves</a></p>';
        if (id === 'mirrormove') buf += '<p class="movetag"><a href="' + Config.baseurl + 'tags/nonmirror" data-target="push">See all Nonmirror moves</a></p>';
        if (id === 'substitute') buf += '<p class="movetag"><a href="' + Config.baseurl + 'tags/bypasssub" data-target="push">See all moves that bypass Substitute</a></p>';
        if ('defrost' in move.flags) buf += '<p><a class="subtle" href="' + Config.baseurl + 'tags/defrost" data-target="push">The user thaws out</a> if it is frozen.</p>';
        if (!('protect' in move.flags) && move.target !== 'self') buf += '<p class="movetag"><a href="' + Config.baseurl + 'tags/bypassprotect" data-target="push">Bypasses Protect</a> <small>(bypasses <a class="subtle" href="' + Config.baseurl + 'moves/protect" data-target="push">Protect</a>, <a class="subtle" href="' + Config.baseurl + 'moves/detect" data-target="push">Detect</a>, <a class="subtle" href="' + Config.baseurl + 'moves/kingsshield" data-target="push">King\'s Shield</a>, and <a class="subtle" href="' + Config.baseurl + 'moves/spikyshield" data-target="push">Spiky Shield</a>)</small></p>';
        if ('bypasssub' in move.flags) buf += '<p class="movetag"><a href="' + Config.baseurl + 'tags/bypasssub" data-target="push">Bypasses Substitute</a> <small>(bypasses but does not break a <a class="subtle" href="' + Config.baseurl + 'moves/substitute" data-target="push">Substitute</a>)</small></p>';
        if (!('reflectable' in move.flags) && move.target !== 'self' && move.category === 'Status') buf += '<p class="movetag"><a href="' + Config.baseurl + 'tags/nonreflectable" data-target="push">&#x2713; Nonreflectable</a> <small>(can\'t be bounced by <a class="subtle" href="' + Config.baseurl + 'moves/magiccoat" data-target="push">Magic Coat</a> or <a class="subtle" href="' + Config.baseurl + 'abilities/magicbounce" data-target="push">Magic Bounce</a>)</small></p>';
        if (!('mirror' in move.flags) && move.target !== 'self') buf += '<p class="movetag"><a href="' + Config.baseurl + 'tags/nonmirror" data-target="push">&#x2713; Nonmirror</a> <small>(can\'t be copied by <a class="subtle" href="' + Config.baseurl + 'moves/mirrormove" data-target="push">Mirror Move</a>)</small></p>';
        if (!('snatch' in move.flags) && (move.target === 'self' || move.target === 'allyTeam' || move.target === 'adjacentAllyOrSelf')) ;
        else if ('snatch' in move.flags && (move.target === 'self' || move.target === 'allyTeam' || move.target === 'adjacentAllyOrSelf')) buf += '<p class="movetag"><a href="' + Config.baseurl + 'tags/snatchable" data-target="push">&#x2713; Snatchable</a> <small>(can be copied by <a class="subtle" href="' + Config.baseurl + 'moves/snatch" data-target="push">Snatch</a>)</small></p>';
        if ('contact' in move.flags) buf += '<p class="movetag"><a href="' + Config.baseurl + 'tags/contact" data-target="push">&#x2713; Contact</a> <small>(affected by many abilities like Iron Barbs and moves like Spiky Shield)</small></p>';
        if ('sound' in move.flags) buf += '<p class="movetag"><a href="' + Config.baseurl + 'tags/sound" data-target="push">&#x2713; Sound</a> <small>(bypasses <a class="subtle" href="' + Config.baseurl + 'moves/substitute" data-target="push">Substitute</a>, doesn\'t affect <a class="subtle" href="' + Config.baseurl + 'abilities/soundproof" data-target="push">Soundproof</a> pokemon)</small></p>';
        if ('powder' in move.flags) buf += '<p class="movetag"><a href="' + Config.baseurl + 'tags/powder" data-target="push">&#x2713; Powder</a> <small>(doesn\'t affect <a class="subtle" href="' + Config.baseurl + 'types/grass" data-target="push">Grass</a>-types, <a class="subtle" href="' + Config.baseurl + 'abilities/overcoat" data-target="push">Overcoat</a> pokemon, and <a class="subtle" href="' + Config.baseurl + 'items/safetygoggles" data-target="push">Safety Goggles</a> holders)</small></p>';
        if ('punch' in move.flags) buf += '<p class="movetag"><a href="' + Config.baseurl + 'tags/fist" data-target="push">&#x2713; Fist</a> <small>(boosted by <a class="subtle" href="' + Config.baseurl + 'abilities/ironfist" data-target="push">Iron Fist</a>)</small></p>';
        if ('pulse' in move.flags) buf += '<p class="movetag"><a href="' + Config.baseurl + 'tags/pulse" data-target="push">&#x2713; Pulse</a> <small>(boosted by <a class="subtle" href="' + Config.baseurl + 'abilities/megalauncher" data-target="push">Mega Launcher</a>)</small></p>';
        if ('bite' in move.flags) buf += '<p class="movetag"><a href="' + Config.baseurl + 'tags/bite" data-target="push">&#x2713; Bite</a> <small>(boosted by <a class="subtle" href="' + Config.baseurl + 'abilities/strongjaw" data-target="push">Strong Jaw</a>)</small></p>';
        if ('bullet' in move.flags) buf += '<p class="movetag"><a href="' + Config.baseurl + 'tags/ballistic" data-target="push">&#x2713; Ballistic</a> <small>(doesn\'t affect <a class="subtle" href="' + Config.baseurl + 'abilities/bulletproof" data-target="push">Bulletproof</a> pokemon)</small></p>';
        if ('slicing' in move.flags) buf += '<p class="movetag"><a href="' + Config.baseurl + 'tags/slicing" data-target="push">&#x2713; Slicing</a> <small>(boosted by <a class="subtle" href="' + Config.baseurl + 'abilities/sharpness" data-target="push">Sharpness</a>)</small></p>';
        if ('wind' in move.flags) buf += '<p class="movetag"><a href="' + Config.baseurl + 'tags/wind" data-target="push">&#x2713; Wind</a> <small>(interacts with <a class="subtle" href="' + Config.baseurl + 'abilities/windpower" data-target="push">Wind Power</a> and <a class="subtle" href="' + Config.baseurl + 'abilities/windrider" data-target="push">Wind Rider</a>)</small></p>';
        if (move.target === 'allAdjacent') buf += '<p class="movetag"><small>In Doubles, hits all adjacent Pok\xe9mon (including allies)</small></p>';
        else if (move.target === 'allAdjacentFoes') buf += '<p class="movetag"><small>In Doubles, hits all adjacent foes</small></p>';
        else if (move.target === 'randomNormal') buf += '<p class="movetag"><small>In Doubles, hits a random foe (you can\'t choose its target)</small></p>';
        else if (move.target === 'adjacentAllyOrSelf') buf += '<p class="movetag"><small>In Doubles, can be used either on the user or an adjacent ally</small></p>';
        // Z-Move
        var zMoveTable = {
            Poison: "Acid Downpour",
            Fighting: "All-Out Pummeling",
            Dark: "Black Hole Eclipse",
            Grass: "Bloom Doom",
            Normal: "Breakneck Blitz",
            Rock: "Continental Crush",
            Steel: "Corkscrew Crash",
            Dragon: "Devastating Drake",
            Electric: "Gigavolt Havoc",
            Water: "Hydro Vortex",
            Fire: "Inferno Overdrive",
            Ghost: "Never-Ending Nightmare",
            Bug: "Savage Spin-Out",
            Psychic: "Shattered Psyche",
            Ice: "Subzero Slammer",
            Flying: "Supersonic Skystrike",
            Ground: "Tectonic Rage",
            Fairy: "Twinkle Tackle"
        };
        var zMoveVersionTable = {
            spiritshackle: "Sinister Arrow Raid",
            volttackle: "Catastropika",
            lastresort: "Extreme Evoboost",
            psychic: "Genesis Supernova",
            naturesmadness: "Guardian of Alola",
            darkestlariat: "Malicious Moonsault",
            sparklingaria: "Oceanic Operetta",
            gigaimpact: "Pulverizing Pancake",
            spectralthief: "Soul-Stealing 7-Star Strike",
            thunderbolt: "Stoked Sparksurfer",
            thunderbolt2: "10,000,000 Volt Thunderbolt",
            photongeyser: "Light That Burns the Sky",
            sunsteelstrike: "Searing Sunraze Smash",
            moongeistbeam: "Menacing Moonraze Maelstrom",
            playrough: "Let's Snuggle Forever",
            stoneedge: "Splintered Stormshards",
            clangingscales: "Clangorous Soulblaze"
        };
        if (!move.isMax && (move.zMovePower || move.zMoveEffect || move.zMoveBoost)) {
            buf += '<h3>Z-Move(s)</h3>';
            if (move.zMovePower) {
                buf += '<p><strong><a href="' + Config.baseurl + 'moves/' + toID(zMoveTable[move.type]) + '" data-target="push">';
                buf += zMoveTable[move.type];
                buf += '</a></strong>: ';
                buf += '' + move.zMovePower + ' base power, ' + move.category + '</p>';
            }
            if (move.zMoveBoost) {
                buf += '<p><strong>Z-' + move.name + '</strong>: ';
                var isFirst = true;
                for(var i in move.zMoveBoost){
                    if (!isFirst) buf += ', ';
                    isFirst = false;
                    buf += '+' + move.zMoveBoost[i] + ' ' + (BattleStatNames[i] || i);
                }
                buf += ', then uses ' + move.name + '</p>';
            }
            if (move.zMoveEffect === 'heal') buf += '<p><strong>Z-' + move.name + '</strong>: fully heals the user, then uses ' + move.name + '</p>';
            else if (move.zMoveEffect === 'clearnegativeboost') buf += '<p><strong>Z-' + move.name + '</strong>: clears the user\'s negative stat boosts, then uses ' + move.name + '</p>';
            else if (move.zMoveEffect === 'healreplacement') buf += '<p><strong>Z-' + move.name + '</strong>: uses ' + move.name + ', then heals the replacement' + '</p>';
            else if (move.zMoveEffect === 'crit2') buf += '<p><strong>Z-' + move.name + '</strong>: increases the user\'s crit rate by 2, then uses ' + move.name + '</p>';
            else if (move.zMoveEffect === 'redirect') buf += '<p><strong>Z-' + move.name + '</strong>: redirects opponent\'s moves to the user (like Follow Me) in doubles, then uses ' + move.name + '</p>';
            else if (move.zMoveEffect === 'curse') buf += '<p><strong>Z-' + move.name + '</strong>: +1 Atk if the user is a ghost, or fully heals the user otherwise, then uses ' + move.name + '</p>';
            else if (move.zMoveEffect) {
                // For Status moves: show the base move name (e.g. "Z-Swords Dance: +1 Accuracy, then uses Swords Dance")
                // For Physical/Special moves: show the base Z-Move name (e.g. "Z-Bide: recovers all of user's HP, then uses Breakneck Blitz")
                var zMoveName = move.category === 'Status' ? move.name : zMoveTable[move.type];
                buf += '<p><strong>Z-' + move.name + '</strong>: ' + escapeHTML(move.zMoveEffect) + ', then uses ' + zMoveName + '</p>';
            }
            if (id in zMoveVersionTable) {
                var zMove = getID(BattleMovedex, zMoveVersionTable[id]);
                buf += '<p><strong><a href="' + Config.baseurl + 'moves/' + zMove.id + '" data-target="push">' + zMove.name + '</a></strong>: ';
                if (zMove.basePower) buf += '' + zMove.basePower + ' base power, ' + zMove.category + '</p>';
                else buf += zMove.shortDesc;
                buf += '</p>';
            }
            if (id + '2' in zMoveVersionTable) {
                var zMove = getID(BattleMovedex, zMoveVersionTable[id + '2']);
                buf += '<p><strong><a href="' + Config.baseurl + 'moves/' + zMove.id + '" data-target="push">' + zMove.name + '</a></strong>: ';
                if (zMove.basePower) buf += '' + zMove.basePower + ' base power, ' + zMove.category + '</p>';
                else buf += zMove.shortDesc;
                buf += '</p>';
            }
        }
        // Max Move
        var maxMoveTable = {
            Poison: "Ooze",
            Fighting: "Knuckle",
            Dark: "Darkness",
            Grass: "Overgrowth",
            Normal: "Strike",
            Rock: "Rockfall",
            Steel: "Steelspike",
            Dragon: "Wyrmwind",
            Electric: "Lightning",
            Water: "Geyser",
            Fire: "Flare",
            Ghost: "Phantasm",
            Bug: "Flutterby",
            Psychic: "Mindstorm",
            Ice: "Hailstorm",
            Flying: "Airstream",
            Ground: "Quake",
            Fairy: "Starfall",
            Status: "Guard"
        };
        var gmaxMoveTable = {
            Bug: [
                "Befuddle"
            ],
            Fire: [
                "Centiferno",
                "Wildfire"
            ],
            Fighting: [
                "Chi Strike"
            ],
            Normal: [
                "Cuddle",
                "Gold Rush",
                'Replenish'
            ],
            Dragon: [
                "Depletion"
            ],
            Fairy: [
                "Finale",
                "Smite"
            ],
            Water: [
                "Foam Burst",
                "Stonesurge"
            ],
            Psychic: [
                "Gravitas"
            ],
            Poison: [
                "Malodor"
            ],
            Steel: [
                "Meltdown",
                "Steelsurge"
            ],
            Ice: [
                "Resonance"
            ],
            Ground: [
                "Sandblast"
            ],
            Dark: [
                "Snooze"
            ],
            Electric: [
                "Stun Shock",
                "Volt Crash"
            ],
            Grass: [
                "Sweetness",
                "Tartness"
            ],
            Ghost: [
                "Terror"
            ],
            Rock: [
                "Volcalith"
            ],
            Flying: [
                "Wind Rage"
            ]
        };
        if (move.gmaxPower && !move.isZ && !move.isMax) {
            buf += '<h3>Max Move</h3>';
            if (move.category !== 'Status') {
                buf += '<p><strong><a href="' + Config.baseurl + 'moves/max' + toID(maxMoveTable[move.type]) + '" data-target="push">';
                buf += 'Max ' + maxMoveTable[move.type];
                buf += '</a></strong>: ';
                buf += '' + move.gmaxPower + ' base power, ' + move.category + '</p>';
            } else {
                buf += '<p><strong><a href="' + Config.baseurl + 'moves/maxguard" data-target="push">';
                buf += 'Max Guard';
                buf += '</a></strong>';
                buf += move.shortDesc;
            }
            if (move.type in gmaxMoveTable && move.category !== 'Status') for(let i = 0; i < gmaxMoveTable[move.type].length; i++){
                var gmaxMove = getID(BattleMovedex, 'gmax' + gmaxMoveTable[move.type][i]);
                buf += '<p>Becomes <strong><a href="' + Config.baseurl + 'moves/' + gmaxMove.id + '" data-target="push">' + gmaxMove.name + '</a></strong> ';
                buf += 'if used by <strong><a href="' + Config.baseurl + 'pokemon/' + gmaxMove.isMax + 'gmax" data-target="push">' + gmaxMove.isMax + '-Gmax</a></strong>';
                if (gmaxMove.isMax === 'Toxtricity') buf += ' or <strong><a href="' + Config.baseurl + 'pokemon/' + gmaxMove.isMax + 'lowkeygmax" data-target="push">' + gmaxMove.isMax + '-Low-Key-Gmax</a></strong>';
                buf += '</p>';
            }
        }
        // distribution
        buf += "<h3>Pok\xe9mon that learn this move</h3>";
        buf += '<ul class="utilichart metricchart nokbd">';
        buf += '</ul>';
        buf += '</div>';
        this.html(buf);
        setTimeout(this.renderDistribution.bind(this));
    },
    getDistribution: function() {
        var results = [];
        var moveId = this.id; // Store the move ID we're looking for
        for(let pokeId in BattlePokedex){
            let learnset = getLearnset(pokeId);
            if (!learnset || learnset.length === 0) continue;
            // Filter moves that match this move ID
            let matchingMoves = learnset.filter((m)=>toID(m.move) === moveId);
            // Add each matching move with the pokemon ID
            results = results.concat(matchingMoves.map((m)=>{
                return {
                    poke: pokeId,
                    ...m
                };
            }));
        }
        // Collect Pokemon that learn this move as a Z-Move
        for(let pokeId in BattlePokedex){
            let pokemon = BattlePokedex[pokeId];
            if (pokemon.zmove && toID(pokemon.zmove.zMove) === moveId) results.push({
                poke: pokeId,
                how: 'zmove',
                level: 0
            });
        }
        const methods = [
            "lvl",
            "tm",
            "tutor",
            "egg",
            "zmove"
        ];
        results.sort((a, b)=>{
            // First sort by learning method
            if (a.how != b.how) return methods.indexOf(a.how) - methods.indexOf(b.how);
            // Then sort by Pokedex number
            var pokeA = BattlePokedex[a.poke];
            var pokeB = BattlePokedex[b.poke];
            return (pokeA?.num || 0) - (pokeB?.num || 0);
        });
        for (let method of methods){
            let index = results.findIndex((r)=>r.how == method);
            if (index < 0) continue;
            results.splice(index, 0, {
                start: true,
                method
            });
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
        var template = BattlePokedex[results[i].poke];
        if (results[i].start) switch(results[i].method){
            case 'lvl':
                return '<h3>Level-up</h3>';
            case 'tm':
                return '<h3>TM/HM</h3>';
            case 'tutor':
                return '<h3>Tutor</h3>';
            case 'egg':
                return '<h3>Egg</h3>';
            case 'zmove':
                return '<h3>Z-Move</h3>';
        }
        else if (offscreen) return '' + template.name + ' ' + template.abilities['0'] + ' ' + (template.abilities['1'] || '') + ' ' + (template.abilities['H'] || '') + '';
        else {
            var desc = '';
            switch(results[i].how){
                case 'lvl':
                    desc = results[i].level <= 1 ? '&ndash;' : '<small>L</small>' + (results[i].level || '?');
                    break;
                case 'tm':
                    desc = `<span class="itemicon" style="margin-top:-3px;${getItemIcon("tr01")}"></span>`;
                    break;
                case 'tutor':
                    desc = '<img src="' + ResourcePrefix + 'sprites/tutor.png" style="margin-top:-4px;opacity:.7" width="27" height="26" alt="T" />';
                    break;
                case 'egg':
                    desc = '<span class="picon" style="margin-top:-12px;' + getPokemonIcon('egg') + '"></span>';
                    break;
                case 'zmove':
                    desc = '<span style="font-size:20px;margin-right:4px">Z</span>';
                    break;
                case 'event':
                    desc = '!';
                    break;
                case 'past':
                    desc = '...';
                    break;
            }
            return BattleSearch.renderTaggedPokemonRowInner(template, desc);
        }
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

},{}]},["bEuqE","f4na6"], "f4na6", "parcelRequire6a64", {})

//# sourceMappingURL=Binary-Star-Pokedex.6b8dc544.js.map
