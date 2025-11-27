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
})({"fhkiH":[function(require,module,exports,__globalThis) {
var global = arguments[3];
var HMR_HOST = null;
var HMR_PORT = null;
var HMR_SERVER_PORT = 1234;
var HMR_SECURE = false;
var HMR_ENV_HASH = "439701173a9199ea";
var HMR_USE_SSE = false;
module.bundle.HMR_BUNDLE_ID = "60cf7079dd755cdc";
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

},{}],"1h4WV":[function(require,module,exports,__globalThis) {
window.PokedexPokemonPanel = PokedexResultPanel.extend({
    initialize: function(id) {
        id = toID(id);
        var pokemon = BattlePokedex[id];
        this.id = id;
        this.shortTitle = pokemon.baseSpecies;
        var buf = '<div class="pfx-body dexentry">';
        buf += `<a href="${Config.baseurl}" class="pfx-backbutton" data-target="back"><i class="fa fa-chevron-left"></i> Pok&eacute;dex</a>`;
        buf += '<h1>';
        if (pokemon.forme) buf += `<a href="${Config.baseurl}pokemon/${id}" data-target="push" class="subtle">${pokemon.baseSpecies}<small>-${pokemon.forme}</small></a>`;
        else buf += `<a href="${Config.baseurl}pokemon/${id}" data-target="push" class="subtle">${pokemon.name}</a>`;
        if (pokemon.num > 0) buf += ` <code>#${pokemon.num}</code>`;
        buf += '</h1>';
        if (pokemon.isNonstandard) buf += '<div class="warning"><strong>Note:</strong> This Pok&eacute;mon is unreleased.</div>';
        buf += `<img src="${ResourcePrefix}sprites/gen5/${id}.png" alt="" width="96" height="96" class="sprite" />`;
        buf += '<dl class="typeentry">';
        buf += '<dt>Types:</dt> <dd>';
        for(var i = 0; i < pokemon.types.length; i++)buf += `<a class="type ${toID(pokemon.types[i])}" href="${Config.baseurl}types/${toID(pokemon.types[i])}" data-target="push">${pokemon.types[i]}</a> `;
        buf += '</dd>';
        buf += '</dl>';
        buf += '<dl class="sizeentry">';
        buf += '<dt>Size:</dt> <dd>';
        var gkPower = function(weightkg) {
            if (weightkg >= 200) return 120;
            if (weightkg >= 100) return 100;
            if (weightkg >= 50) return 80;
            if (weightkg >= 25) return 60;
            if (weightkg >= 10) return 40;
            return 20;
        }(pokemon.weightkg);
        buf += `${pokemon.heightm} m, ${pokemon.weightkg} kg<br /><small><a class="subtle" href="${Config.baseurl}moves/grassknot" data-target="push">Grass Knot</a>: ${gkPower}</small>`;
        buf += '</dd>';
        buf += '</dl>';
        buf += '<dl class="abilityentry">';
        buf += '<dt>Abilities:</dt> <dd class="imgentry">';
        for(var i in pokemon.abilities){
            var ability = pokemon.abilities[i];
            if (!ability) continue;
            if (i !== '0') buf += ' | ';
            if (i === 'H') ability = `<em>${pokemon.abilities[i]}</em>`;
            buf += `<a href="${Config.baseurl}abilities/${toID(pokemon.abilities[i])}" data-target="push">${ability}</a>`;
            if (i === 'H') buf += '<small> (H)</small>';
            if (i === 'S') buf += '<small> (special)</small>';
        }
        buf += '</dd>';
        buf += '</dl>';
        buf += '<dl>';
        buf += '<dt style="clear:left">Base stats:</dt><dd><table class="stats">';
        var StatTitles = {
            hp: "HP",
            atk: "Attack",
            def: "Defense",
            spa: "Sp. Atk",
            spd: "Sp. Def",
            spe: "Speed"
        };
        buf += '<tr><td></td><td></td><td style="width:200px"></td><th class="ministat"><abbr title="0 IVs, 0 EVs, negative nature">min&minus;</a></th><th class="ministat"><abbr title="31 IVs, 0 EVs, neutral nature">min</abbr></th><th class="ministat"><abbr title="31 IVs, 252 EVs, neutral nature">max</abbr></th><th class="ministat"><abbr title="31 IVs, 252 EVs, positive nature">max+</abbr></th>';
        var bst = 0;
        for(var stat in BattleStatNames){
            var baseStat = pokemon.baseStats[stat];
            bst += baseStat;
            var width = Math.floor(baseStat * 200 / 200);
            if (width > 200) width = 200;
            var color = Math.floor(baseStat * 180 / 255);
            if (color > 360) color = 360;
            buf += `<tr><th>${StatTitles[stat]}:</th><td class="stat">${baseStat}</td>`;
            buf += `<td class="statbar"><span style="width:${Math.floor(width)}px;background:hsl(${color},85%,45%);border-color:hsl(${color},75%,35%)"></span></td>`;
            buf += '<td class="ministat"><small>' + (stat === 'hp' ? '' : this.getStat(baseStat, false, 100, 0, 0, 0.9)) + '</small></td><td class="ministat"><small>' + this.getStat(baseStat, stat === 'hp', 100, 31, 0, 1.0) + '</small></td>';
            buf += '<td class="ministat"><small>' + this.getStat(baseStat, stat === 'hp', 100, 31, 255, 1.0) + '</small></td><td class="ministat"><small>' + (stat === 'hp' ? '' : this.getStat(baseStat, false, 100, 31, 255, 1.1)) + '</small></td></tr>';
        }
        buf += `<tr><th class="bst">Total:</th><td class="bst">${bst}</td><td></td><td class="ministat" colspan="4">at level <input type="text" class="textbox" name="level" placeholder="100" size="5" /></td>`;
        buf += '</table></dd>';
        // Show changes from base game if available
        var baseGame = BaseGameStats[this.id];
        if (baseGame) {
            buf += '<dt>Changes from Base Game:</dt><dd>';
            var hasChanges = false;
            var statChanges = [];
            // Check stat changes
            for(var stat in BattleStatNames){
                var currentStat = pokemon.baseStats[stat];
                var baseStat = baseGame.baseStats[stat];
                if (currentStat !== baseStat) {
                    hasChanges = true;
                    var color = currentStat > baseStat ? '#22AA22' : '#CC2222';
                    statChanges.push(`<strong>${BattleStatNames[stat]}:</strong> <span style="color:${color}">${baseStat} &rarr; ${currentStat}</span>`);
                }
            }
            // Check BST change
            var baseGameBst = 0;
            for(var stat in baseGame.baseStats)baseGameBst += baseGame.baseStats[stat];
            if (bst !== baseGameBst) {
                hasChanges = true;
                var bstColor = bst > baseGameBst ? '#22AA22' : '#CC2222';
                statChanges.push(`<strong>BST:</strong> <span style="color:${bstColor}">${baseGameBst} &rarr; ${bst}</span>`);
            }
            // Check weight change
            if (pokemon.weightkg !== baseGame.weightkg) {
                hasChanges = true;
                var weightColor = pokemon.weightkg > baseGame.weightkg ? '#22AA22' : '#CC2222';
                statChanges.push(`<strong>Weight:</strong> <span style="color:${weightColor}">${baseGame.weightkg} kg &rarr; ${pokemon.weightkg} kg</span>`);
            }
            if (hasChanges) buf += statChanges.join('<br />');
            else buf += '<em>No stat changes from base game</em>';
            buf += '</dd>';
        }
        buf += '<dt>Evolution:</dt> <dd>';
        var template = pokemon;
        while(template.prevo)template = getID(BattlePokedex, template.prevo);
        if (template.evos) {
            buf += '<table class="evos"><tr><td>';
            var evos = [
                template
            ];
            while(evos.length > 0){
                var nextEvos = [];
                for(var i = 0; i < evos.length; i++){
                    template = evos[i];
                    var name = template.forme ? template.baseSpecies + `<small>-${template.forme}</small>` : template.name;
                    name = `<span class="picon" style="${getPokemonIcon(template)}"></span>` + name;
                    if (template === pokemon) buf += `<div><strong>${name}</strong></div>`;
                    else buf += `<div><a href="${Config.baseurl}pokemon/${template.id}" data-target="replace">${name}</a></div>`;
                    for (let evo of template.evos ?? [])if (!nextEvos.find((e)=>e.target == evo.target)) nextEvos.push(evo);
                }
                evos = nextEvos.map((evo)=>getID(BattlePokedex, evo.target));
                if (evos.length > 0) buf += '</td><td class="arrow"><span>&rarr;</span></td><td>';
            }
            buf += '</td></tr></table>';
            if (pokemon.prevo) {
                let prevo = getID(BattlePokedex, pokemon.prevo);
                let evos_from_prevo = prevo.evos.filter((evo)=>toID(evo.target) == pokemon.id);
                for (let evo of evos_from_prevo)buf += `<div><small>Evolves from ${getID(BattlePokedex, pokemon.prevo).name} (${this.getEvoMethod(evo)})</small></div>`;
            }
            let a = [];
            if (pokemon.evos) for (let evo of pokemon.evos)buf += `<div><small>Evolves into ${getID(BattlePokedex, evo.target).name} (${this.getEvoMethod(evo)})</small></div>`;
        } else buf += '<em>Does not evolve</em>';
        if (pokemon.formes) {
            buf += '</dd><dt>Formes:</dt> <dd>';
            var otherFormes = pokemon.formes;
            for(var i = 0; i < otherFormes.length; i++){
                template = getID(BattlePokedex, otherFormes[i]);
                if (!template) continue;
                var name = template.forme || 'Base';
                name = `<span class="picon" style="${getPokemonIcon(template)}"></span>` + name;
                if (i > 0) buf += ', ';
                if (template === pokemon) buf += `<strong>${name}</strong>`;
                else buf += `<a href="${Config.baseurl}pokemon/${template.id}" data-target="replace">${name}</a>`;
            }
            if (pokemon.requiredItem) buf += `<div><small>Must hold <a href="${Config.baseurl}items/${toID(template.requiredItem)}" data-target="push">${template.requiredItem}</a></small></div>`;
        }
        if (pokemon.cosmeticFormes) {
            buf += '</dd><dt>Cosmetic formes:</dt> <dd>';
            name = `<span class="picon" style="${getPokemonIcon(pokemon)}"></span>` + pokemon.name;
            buf += '' + name;
            for(var i = 0; i < pokemon.cosmeticFormes.length; i++){
                name = `<span class="picon" style="${getPokemonIcon(pokemon.name + '-' + pokemon.cosmeticFormes[i])}"></span>` + pokemon.cosmeticFormes[i];
                buf += "," + name;
            }
        }
        buf += '</dd></dl>';
        if (pokemon.eggGroups) {
            buf += '<dl class="colentry"><dt>Egg groups:</dt><dd><span class="picon" style="margin-top:-12px;' + getPokemonIcon('egg') + `"></span><a href="${Config.baseurl}egggroups/` + pokemon.eggGroups.map(toID).join('+') + '" data-target="push">' + pokemon.eggGroups.join(', ') + '</a></dd></dl>';
            buf += '<dl class="colentry"><dt>Gender ratio:</dt><dd>';
            if (pokemon.gender) switch(pokemon.gender){
                case 'M':
                    buf += '100% male';
                    break;
                case 'F':
                    buf += '100% female';
                    break;
                case 'N':
                    buf += '100% genderless';
                    break;
            }
            else if (pokemon.genderRatio) buf += `${pokemon.genderRatio.M * 100}% male, ${pokemon.genderRatio.F * 100}% female`;
            else buf += '50% male, 50% female';
            buf += '</dd></dl>';
            buf += '<div style="clear:left"></div>';
        }
        // Related items - items that mention this Pokémon's name
        var relatedItemIds = ItemPokemonLinks.pokemonToItems[this.id] || [];
        if (relatedItemIds.length > 0) {
            var relatedItems = relatedItemIds.map(function(itemId) {
                return BattleItems[itemId];
            }).filter(Boolean);
            buf += '<dl class="colentry"><dt>Related item(s):</dt><dd>';
            for(var i = 0; i < relatedItems.length; i++){
                if (i > 0) buf += ', ';
                var relItem = relatedItems[i];
                buf += `<span class="itemicon" style="${getItemIcon(relItem)};width:32px;height:32px"></span><a href="${Config.baseurl}items/${relItem.id}" data-target="push">${relItem.name}</a>`;
            }
            buf += '</dd></dl>';
            buf += '<div style="clear:left"></div>';
        }
        // learnset
        buf += '<ul class="utilichart nokbd">';
        buf += '<li class="resultheader"><h3>Level-up</h3></li>';
        buf += '</ul>';
        buf += '</div>';
        this.html(buf);
        setTimeout(this.renderFullLearnset.bind(this));
    },
    events: {
        'click .tabbar button': 'selectTab',
        'input input[name=level]': 'updateLevel',
        'keyup input[name=level]': 'updateLevel',
        'change input[name=level]': 'updateLevel'
    },
    updateLevel: function(e) {
        var val = this.$('input[name=level]').val();
        var level = val === '' ? 100 : parseInt(val, 10);
        var lowIV = 31, highIV = 31;
        var lowEV = 0, highEV = 255;
        if (val.slice(-1) === ':') {
            lowIV = 0;
            highEV = 0;
        }
        var i = 0;
        var $entries = this.$('table.stats td.ministat small');
        var pokemon = getID(BattlePokedex, this.id);
        for(var stat in BattleStatNames){
            var baseStat = pokemon.baseStats[stat];
            $entries.eq(4 * i + 0).text(stat === 'hp' ? '' : this.getStat(baseStat, false, level, 0, 0, 0.9));
            $entries.eq(4 * i + 1).text(this.getStat(baseStat, stat === 'hp', level, lowIV, lowEV, 1.0));
            $entries.eq(4 * i + 2).text(this.getStat(baseStat, stat === 'hp', level, highIV, highEV, 1.0));
            $entries.eq(4 * i + 3).text(stat === 'hp' ? '' : this.getStat(baseStat, false, level, highIV, highEV, 1.1));
            i++;
        }
    },
    getEvoMethod: function(evo) {
        switch(evo.condition){
            case undefined:
                if (evo.level) return 'level ' + evo.level;
                if (evo.item) return 'use ' + evo.item;
                return 'unknown';
            case 'trade':
                return 'When traded';
            case 'friendship':
                return 'High Friendship';
            default:
                return evo.condition;
        }
    },
    selectTab: function(e) {
        this.$('.tabbar button').removeClass('cur');
        $(e.currentTarget).addClass('cur');
        switch(e.currentTarget.value){
            case 'move':
                this.renderFullLearnset();
                break;
            case 'details':
                break;
            case 'events':
                break;
        }
    },
    renderFullLearnset: function() {
        var pokemon = getID(BattlePokedex, this.id);
        var learnset = getLearnset(this.id);
        var last;
        var buf = "", desc = "";
        for (let learn of learnset){
            // Normalize move name or id to canonical BattleMovedex entry
            let move = getID(BattleMovedex, learn.move);
            if (!move) {
                // If still not found, fall back to showing a placeholder without the noisy error prefix
                buf += `<li class="result"><span class="col tagcol"></span> <span class="col shortmovenamecol">${escapeHTML(learn.move)}</span> <span class="col typecol">&mdash;</span> <span class="col labelcol"></span> <span class="col widelabelcol"></span> <span class="col pplabelcol"></span> <span class="col movedesccol"><em>Unknown move</em></span></li>`;
                continue;
            }
            var newCategory = last == undefined || last.how != learn.how;
            switch(learn.how){
                case 'lvl':
                    if (newCategory) buf += '<li class="resultheader"><h3>Level-up</h3></li>';
                    let level = learn.level;
                    if (level === 0) desc = 'Evo';
                    else desc = level <= 1 ? '&ndash;' : '<small>L</small>' + level;
                    break;
                case 'prevo':
                    if (newCategory) buf += '<li class="resultheader"><h3>From preevo</h3></li>';
                    desc = "";
                    break;
                case 'tm':
                    if (newCategory) buf += '<li class="resultheader"><h3>TM/HM</h3></li>';
                    desc = `<span class="itemicon" style="margin-top:-3px;${getItemIcon("tr01")};width:32px;height:32px"></span>`;
                    break;
                case 'tutor':
                    if (newCategory) buf += '<li class="resultheader"><h3>Tutor</h3></li>';
                    desc = `<img src="${ResourcePrefix}sprites/tutor.png" style="margin-top:-4px;opacity:.7" width="27" height="26" alt="T" />`;
                    break;
                case 'egg':
                    if (newCategory) buf += '<li class="resultheader"><h3>Egg</h3></li>';
                    desc = '<span class="picon" style="margin-top:-12px;' + getPokemonIcon('egg') + '"></span>';
                    break;
            }
            last = learn;
            buf += BattleSearch.renderTaggedMoveRow(move, desc);
        }
        this.$('.utilichart').html(buf);
    },
    getStat: function(baseStat, isHP, level, iv, ev, natureMult) {
        if (isHP) {
            if (baseStat === 1) return 1;
            return Math.floor(Math.floor(2 * baseStat + (iv || 0) + Math.floor((ev || 0) / 4) + 100) * level / 100 + 10);
        }
        var val = Math.floor(Math.floor(2 * baseStat + (iv || 0) + Math.floor((ev || 0) / 4)) * level / 100 + 5);
        if (natureMult && !isHP) val *= natureMult;
        return Math.floor(val);
    }
});

},{}]},["fhkiH","1h4WV"], "1h4WV", "parcelRequire6a64", {})

//# sourceMappingURL=Binary-Star-Pokedex.dd755cdc.js.map
