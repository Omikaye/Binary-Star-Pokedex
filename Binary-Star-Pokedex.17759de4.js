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
var _articlesDataJs = require("./articles-data.js");
BattleSearch.urlRoot = Config.baseurl;
// Simple markdown to HTML converter for articles
function markdownToHTML(markdown) {
    var html = markdown;
    // Convert headers
    html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');
    html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
    html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
    // Convert [[links]] to anchor tags (for moves, abilities, items, pokemon)
    html = html.replace(/\[\[([^\]]+)\]\]/g, function(match, text) {
        var id = text.toLowerCase().replace(/[^a-z0-9]+/g, '');
        // Try to determine type - if it contains "berry" or common item words, link to items
        // Otherwise default to moves for most game mechanics
        var type = 'moves';
        if (text.match(/berry|ball|stone|fossil|incense|mail|plate|gem|orb|scarf|band|lens|herb|seed|powder|wing|feather|scale|claw|fang|bone|pearl|nugget|stardust|dust|honey|mushroom|root|shell|shard|evo|mega|z-/i)) type = 'items';
        else if (text.match(/ability|stance|form|mode/i)) type = 'abilities';
        return '<a href="' + Config.baseurl + type + '/' + id + '" data-target="push">' + escapeHTML(text) + '</a>';
    });
    // Convert bold and italic
    html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
    html = html.replace(/___(.+?)___/g, '<strong><em>$1</em></strong>');
    html = html.replace(/__(.+?)__/g, '<strong>$1</strong>');
    html = html.replace(/_(.+?)_/g, '<em>$1</em>');
    // Convert lists
    html = html.replace(/^- (.+)$/gm, '<li>$1</li>');
    html = html.replace(/(<li>[\s\S]*?<\/li>\n?)+/g, '<ul>$&</ul>');
    // Convert tables (basic markdown table support)
    var lines = html.split('\n');
    var inTable = false;
    var result = [];
    for(var i = 0; i < lines.length; i++){
        var line = lines[i];
        var trimmed = line.trim();
        // Check if this is a table row
        if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
            var cells = trimmed.slice(1, -1).split('|').map(function(cell) {
                return cell.trim();
            });
            // Check if next line is a separator (---|---|---)
            var isHeader = false;
            if (i + 1 < lines.length) {
                var nextLine = lines[i + 1].trim();
                if (nextLine.match(/^\|[\s:-]+\|/)) {
                    isHeader = true;
                    if (!inTable) {
                        result.push('<table>');
                        inTable = true;
                    }
                    result.push('<thead><tr>');
                    cells.forEach(function(cell) {
                        result.push('<th>' + cell + '</th>');
                    });
                    result.push('</tr></thead><tbody>');
                    i++; // Skip the separator line
                    continue;
                }
            }
            if (!inTable) {
                result.push('<table><tbody>');
                inTable = true;
            }
            result.push('<tr>');
            cells.forEach(function(cell) {
                result.push('<td>' + cell + '</td>');
            });
            result.push('</tr>');
        } else {
            if (inTable) {
                result.push('</tbody></table>');
                inTable = false;
            }
            result.push(line);
        }
    }
    if (inTable) result.push('</tbody></table>');
    html = result.join('\n');
    // Convert paragraphs (lines not already in tags)
    lines = html.split('\n');
    var inList = false;
    result = [];
    for(var i = 0; i < lines.length; i++){
        var line = lines[i];
        var trimmed = line.trim();
        if (!trimmed) {
            if (!inList) result.push('');
            continue;
        }
        var htmlTags = [
            '<ul>',
            '</ul>',
            '<li>',
            '<h',
            '</',
            '<table',
            '<thead',
            '<tbody',
            '<tr',
            '<th',
            '<td'
        ];
        if (trimmed.startsWith('<ul>')) {
            inList = true;
            result.push(line);
        } else if (trimmed.startsWith('</ul>')) {
            inList = false;
            result.push(line);
        } else if (htmlTags.some(function(tag) {
            return trimmed.startsWith(tag);
        })) result.push(line);
        else if (!inList) {
            // Wrap in paragraph if not already in a tag
            if (!trimmed.startsWith('<')) result.push('<p>' + line + '</p>');
            else result.push(line);
        } else result.push(line);
    }
    return result.join('\n');
}
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
        buf += '<a href="' + Config.baseurl + 'dex" class="pfx-backbutton" data-target="back"><i class="fa fa-chevron-left"></i> Pok&eacute;dex</a>';
        var iconNum = window.ItemIconIndices && window.ItemIconIndices[id] ? window.ItemIconIndices[id] : '?';
        buf += '<h1 style="white-space:nowrap"><a href="' + Config.baseurl + 'items/' + id + '" data-target="push" class="subtle">' + item.name + '</a> <small style="color:#999;font-size:0.6em">#' + item.num + ', Icon: #' + iconNum + '</small></h1>';
        buf += '<div style="text-align:center;margin:10px 0"><span class="itemicon" style="' + getItemIcon(item) + ';width:32px;height:32px"></span></div>';
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
        buf += '<a href="' + Config.baseurl + 'dex" class="pfx-backbutton" data-target="back"><i class="fa fa-chevron-left"></i> Pok&eacute;dex</a>';
        buf += '<h1><a href="' + Config.baseurl + 'abilities/' + ability.id + '" data-target="push" class="subtle">' + escapeHTML(ability.name) + '</a></h1>';
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
        buf += '<a href="' + Config.baseurl + 'dex" class="pfx-backbutton" data-target="back"><i class="fa fa-chevron-left"></i> Pok&eacute;dex</a>';
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
        buf += '<a href="' + Config.baseurl + 'dex" class="pfx-backbutton" data-target="back"><i class="fa fa-chevron-left"></i> Pok&eacute;dex</a>';
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
        buf += '<a href="' + Config.baseurl + 'dex" class="pfx-backbutton" data-target="back"><i class="fa fa-chevron-left"></i> Pok&eacute;dex</a>';
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
        buf += '<a href="' + Config.baseurl + 'dex" class="pfx-backbutton" data-target="back"><i class="fa fa-chevron-left"></i> Pok&eacute;dex</a>';
        buf += '<h1><a href="' + Config.baseurl + 'categories/' + id + '" data-target="push" class="subtle">' + escapeHTML(id) + '</a></h1>';
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
        buf += '<a href="' + Config.baseurl + 'mechanics/" class="pfx-backbutton" data-target="back"><i class="fa fa-chevron-left"></i> Mechanics</a>';
        buf += '<div class="article-content"><em>Loading...</em></div>';
        buf += '</div>';
        this.html(buf);
        var self = this;
        // Get markdown from bundled articles
        var markdown = (0, _articlesDataJs.articles)[id] || '';
        if (!markdown) {
            self.$('.article-content').html('<p style="color: red;">Article not found.</p>');
            return;
        }
        // Convert markdown to HTML
        var html = markdownToHTML(markdown);
        // Extract title from h1
        var title = id;
        html = html.replace(/<h1[^>]*>([^<]+)<\/h1>/, function(match, innerMatch) {
            title = innerMatch;
            self.shortTitle = innerMatch;
            return '';
        });
        // Add CSS for article styling if not already added
        if (!$('#article-styles').length) {
            var styles = '<style id="article-styles">';
            styles += '.article-content h2 { color: #333; border-bottom: 2px solid #ddd; padding-bottom: 4px; margin-top: 20px; }';
            styles += '.article-content h3 { color: #555; margin-top: 16px; }';
            styles += '.article-content p { line-height: 1.6; margin: 10px 0; }';
            styles += '.article-content ul { margin: 10px 0; padding-left: 24px; }';
            styles += '.article-content li { margin: 6px 0; line-height: 1.5; }';
            styles += '.article-content table { border-collapse: collapse; margin: 10px 0; }';
            styles += '.article-content th, .article-content td { border: 1px solid #ddd; padding: 8px; text-align: left; }';
            styles += '.article-content th { background-color: #f2f2f2; font-weight: bold; }';
            styles += '.article-content a { color: #1976d2; text-decoration: none; }';
            styles += '.article-content a:hover { text-decoration: underline; }';
            styles += '</style>';
            $('head').append(styles);
        }
        // Build article content
        var articleBuf = '';
        articleBuf += '<h1>' + escapeHTML(title) + '</h1>';
        articleBuf += html;
        // Add special sections for specific articles
        if (id === 'zmoves') {
            // All Z-Moves section
            articleBuf += '<h2>All Z-Moves</h2>';
            articleBuf += '<ul class="utilichart nokbd">';
            for(var moveId in BattleMovedex){
                var move = BattleMovedex[moveId];
                if (move.isZ) {
                    articleBuf += '<li class="result"><a href="' + Config.baseurl + 'moves/' + moveId + '" data-target="push">';
                    articleBuf += '<span class="col numcol">' + getTypeIcon(move.type) + '</span>';
                    articleBuf += '<span class="col namecol">' + escapeHTML(move.name) + '</span>';
                    if (move.basePower) articleBuf += '<span class="col abilitydesccol">Power: ' + move.basePower + '</span>';
                    articleBuf += '</a></li>';
                }
            }
            articleBuf += '</ul>';
            // All Z-Crystals section
            articleBuf += '<h2>All Z-Crystals</h2>';
            articleBuf += '<ul class="utilichart nokbd">';
            for(var itemId in BattleItems){
                var item = BattleItems[itemId];
                if (item.isZCrystal || item.name && item.name.includes('ium Z')) {
                    articleBuf += '<li class="result"><a href="' + Config.baseurl + 'items/' + itemId + '" data-target="push">';
                    articleBuf += '<span class="col numcol"><span class="itemicon" style="' + getItemIcon(item) + ';width:24px;height:24px;display:inline-block"></span></span>';
                    articleBuf += '<span class="col namecol">' + escapeHTML(item.name) + '</span>';
                    if (item.desc) articleBuf += '<span class="col abilitydesccol">' + escapeHTML(item.desc.substring(0, 100)) + (item.desc.length > 100 ? '...' : '') + '</span>';
                    articleBuf += '</a></li>';
                }
            }
            articleBuf += '</ul>';
        }
        self.$('.article-content').html(articleBuf);
    }
});

},{"./articles-data.js":"chUaL"}],"chUaL":[function(require,module,exports,__globalThis) {
// Auto-generated file that bundles all markdown articles
// This is generated from the articles/ directory
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "articles", ()=>articles);
var _criticalhitMd = require("bundle-text:../articles/criticalhit.md");
var _criticalhitMdDefault = parcelHelpers.interopDefault(_criticalhitMd);
var _groundedMd = require("bundle-text:../articles/grounded.md");
var _groundedMdDefault = parcelHelpers.interopDefault(_groundedMd);
var _hazardsMd = require("bundle-text:../articles/hazards.md");
var _hazardsMdDefault = parcelHelpers.interopDefault(_hazardsMd);
var _maxmovesMd = require("bundle-text:../articles/maxmoves.md");
var _maxmovesMdDefault = parcelHelpers.interopDefault(_maxmovesMd);
var _phazingMd = require("bundle-text:../articles/phazing.md");
var _phazingMdDefault = parcelHelpers.interopDefault(_phazingMd);
var _submovesMd = require("bundle-text:../articles/submoves.md");
var _submovesMdDefault = parcelHelpers.interopDefault(_submovesMd);
var _terrainMd = require("bundle-text:../articles/terrain.md");
var _terrainMdDefault = parcelHelpers.interopDefault(_terrainMd);
var _zMoveResonationMd = require("bundle-text:../articles/zMoveResonation.md");
var _zMoveResonationMdDefault = parcelHelpers.interopDefault(_zMoveResonationMd);
var _zPokemonMd = require("bundle-text:../articles/zPokemon.md");
var _zPokemonMdDefault = parcelHelpers.interopDefault(_zPokemonMd);
var _zmovesMd = require("bundle-text:../articles/zmoves.md");
var _zmovesMdDefault = parcelHelpers.interopDefault(_zmovesMd);
const articles = {
    criticalhit: (0, _criticalhitMdDefault.default),
    grounded: (0, _groundedMdDefault.default),
    hazards: (0, _hazardsMdDefault.default),
    maxmoves: (0, _maxmovesMdDefault.default),
    phazing: (0, _phazingMdDefault.default),
    submoves: (0, _submovesMdDefault.default),
    terrain: (0, _terrainMdDefault.default),
    zmoveresonation: (0, _zMoveResonationMdDefault.default),
    zpokemon: (0, _zPokemonMdDefault.default),
    zmoves: (0, _zmovesMdDefault.default)
};

},{"bundle-text:../articles/criticalhit.md":"vM7yo","bundle-text:../articles/grounded.md":"7uEP9","bundle-text:../articles/hazards.md":"98BzV","bundle-text:../articles/maxmoves.md":"whAat","bundle-text:../articles/phazing.md":"2sjKK","bundle-text:../articles/submoves.md":"cFgWQ","bundle-text:../articles/terrain.md":"64WwT","bundle-text:../articles/zMoveResonation.md":"cscNI","bundle-text:../articles/zPokemon.md":"lplpd","bundle-text:../articles/zmoves.md":"jcuPW","@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"vM7yo":[function(require,module,exports,__globalThis) {
module.exports = "# Critical hit\n\nAll damaging moves with damage calculated through base power have a chance to critical hit, which multiplies the damage dealt by 1.5. If the move's user has the [[Sniper]] Ability, damage from a critical hit is again multiplied by 1.5. Additionally, if the user's attacking stat stage is less than 0, it will be treated as 0; the same is true if the target's defensive stat stage is greater than 0. If the target has Reflect, Light Screen, or Aurora Veil active, those effects are ignored.\n\nMost moves start at a critical hit ratio of +0, although high critical hit ratio moves (like [[Stone Edge]]) start at +1, [[10,000,000 Volt Thunderbolt]] starts at +2, and [[Frost Breath]] and [[Storm Throw]] always result in a critical hit.\n\n| Ratio | Rate   | Percentage |\n|------:|:------:|-----------:|\n| +0    | 1/24   |       4.2% |\n| +1    | 1/8    |      12.5% |\n| +2    | 1/2    |      50.0% |\n| +3    | always |     100.0% |\n\nItems that increase critical hit ratio:\n\n- [[Razor Claw]]: +1\n- [[Scope Lens]]: +1\n- [[Stick]]: +2 ([[Farfetch'd]] only)\n- [[Lucky Punch]]: +2 ([[Chansey]] only)\n\nAbilities that increase critical hit ratio:\n\n- [[Super Luck]]: +1\n- [[Merciless]]: +3 (only if the target is poisoned)\n\nTemporary effects that increase critical hit ratio:\n\n- Focus Energy effect: +2 until switch-out, granted by:\n    - [[Focus Energy]]\n    - Z-[[Foresight]]\n    - Z-[[Sleep Talk]]\n    - Z-[[Tailwind]]\n    - Z-[[Acupressure]]\n    - Z-[[Heart Swap]]\n    - [[Lansat Berry]] when eaten\n\n- Laser Focus effect: +3 until the end of the next turn, granted by:\n    - [[Laser Focus]]\n\nNote that the Focus Energy effect doesn't stack with itself - you can only have one Focus Energy effect at a time.\n\nCritical hits are prevented from striking a Pokemon under the effect of [[Lucky Chant]], as well as Pokemon with the [[Battle Armor]] and [[Shell Armor]] Abilities.\n\n### Past gens\n\nGen 6:\n\nAt +0, critical hit rate was 1/16 instead of 1/24.\n\nGen 2-5:\n\nThe critical damage multiplier was 2 instead of 1.5, and the critical hit rates were as follows.\n\n| Ratio | Rate   | Percentage |\n|------:|:------:|-----------:|\n| +0    | 1/16   |       6.3% |\n| +1    | 1/8    |      12.5% |\n| +2    | 1/4    |      25.0% |\n| +3    | 1/3    |      33.3% |\n| +4    | 1/2    |      50.0% |\n\nGen 2 only:\n\nThe attacking stat stage and defensive stat stage were considered as a collective unit, and either both treated as 0 or both left as their full value, depending on whether their sum was less than 0. \n\nHigh-critical-rate moves were given a starting ratio of +2 rather than +1.\n\nGen 1:\n\nThe critical modifier of 2x was applied onto the level, as opposed to the final damage. As such, at level 100 it effectively became a multiplier of 82/42x, or about 1.95x. \n\nCritical hits always caused all stat stages on both sides to be treated as 0, regardless of whether that was slated to result in more or less damage.\n\nCritical rate was calculated by default as the attacker's base speed divided by 512.\n\nFor high-critical-rate moves such as [[Slash]] or [[Razor Leaf]], the rate instead uses base speed divided by 64, with a maximum of 255/256.\n\nFocus Energy did not function properly at all, and after using it, the critical rate on all subsequent moves until switch-out was divided by 4.\n";

},{}],"7uEP9":[function(require,module,exports,__globalThis) {
module.exports = "# Grounded\n\nA grounded Pokemon is one that is not under any effect that makes it airborne. A Pokemon is airborne if they are part [[Flying type]], have the Ability [[Levitate]], are holding an [[Air Balloon]], or are under the effect of [[Magnet Rise]] or [[Telekinesis]].\n\nBeing airborne grants a Pokemon immunity to several effects. [[Ground]]-type attacking moves (other than [[Thousand Arrows]]), the Ability [[Arena Trap]], [[Terrain]] effects, [[Rototiller]], and the [[hazards]] set by [[Spikes]], [[Sticky Web]], and [[Toxic Spikes]] all have no effect on airborne Pokemon.\n\nSeveral effects also cause a Pokemon to become grounded, which negates any airborne effect the Pokemon may have had. A Pokemon is grounded if they are under the effect of [[Ingrain]], [[Smack Down]], or [[Thousand Arrows]], are holding an [[Iron Ball]], or [[Gravity]] is in effect.";

},{}],"98BzV":[function(require,module,exports,__globalThis) {
module.exports = "# Hazards\n\nHazards are a set of moves that affect Pokemon as they switch into battle, including [[Spikes]], [[Stealth Rock]], [[Sticky Web]], and [[Toxic Spikes]]. They are set up on the opposing side of the field when used, and can be removed when a Pokemon on that side uses [[Defog]] or [[Rapid Spin]], or is hit by Defog. Toxic Spikes can also be removed when a [[grounded]] [[Poison]]-type Pokemon switches in on the affected side.";

},{}],"whAat":[function(require,module,exports,__globalThis) {
module.exports = "# Max Moves\n\nMax Moves are special moves introduced in Gen 8 that can only be used a maximum of three times per battle and require a Pokemon to be Dynamaxed.\n";

},{}],"2sjKK":[function(require,module,exports,__globalThis) {
module.exports = "# Phazing\n\nPhazing moves are moves that make the opponent switch out, including [[Whirlwind]], [[Roar]], [[Dragon Tail]], and [[Circle Throw]]. These moves always come with a high negative priority (currently -6) for balance reasons, due to the disruptive effect they would have if they were routinely capable of going first and denying the opponent access to any of their turns.\n\nThe word \"phaze\" is short for \"pseudo-Haze\", since they're similar to [[Haze]] in that they reset stat boosts.\n\nNote that the Ability [[Suction Cups]] and the effect of [[Ingrain]] prevent phazing, though Pokemon with [[Mold Breaker]], [[Turboblaze]], or [[Teravolt]] can ignore the former.\n";

},{}],"cFgWQ":[function(require,module,exports,__globalThis) {
module.exports = "# Submoves\n\nThere are several situations in which a Pokémon might use a move other than the one you selected at the beginning of the turn.\n\nThese are split into two separate situations: 1. running an entirely new move action, and 2. using a move directly.\n\n\n## Using a move directly\n\nUsing a move directly is very common. Most commonly, moves that call other moves:\n\n- [[Metronome (move)]] uses a random move\n- [[Sleep Talk]] uses a random move the user knows\n- [[Assist]] uses a random move the user's team knows\n- [[Copycat]] copies the last move used in the battle\n- [[Mirror Move]] copies the last move used by the target\n- [[Me First]] copies the target's chosen damaging move action\n- [[Snatch]] copies and prevents the target's chosen status move\n- [[Nature Power]] uses a move depending on terrain\n\nAll of the above moves have exceptions; most notably, they can't call each other.\n\nAnd other effects that call other moves:\n\n- [[Magic Bounce]] reflects status moves\n- [[Magic Coat]] gives a turn of Magic Bounce\n\nUsing a move directly skips a lot of checks that are normally done during turn order. Most obviously, the move is used immediately, bypassing priority order, which can be quite powerful for moves that would be unbalanced if they didn't go last (such as Dragon Tail, Whirlwind, or Focus Punch).\n\nIn addition, it skips a lot of effects that would prevent a move from executing (you can't get fully paralyzed after using Metronome but before using the move chosen by Metronome). These include:\n\n- Sleep\n- Full paralysis\n- Flinching\n- Immobilizing from [[Attract]]\n- Hitting yourself in confusion\n- Being out of PP\n\nIt also skips other consequences of move actions, such as:\n\n- Dancer (a directly called dance move does not trigger Dancer)\n- PP deduction\n\nIn PS source code, you will see `useMove` when direct move usage happens.\n\n\n## Adding or replacing a move action\n\nRunning an entirely new move action is very rare, and done by:\n\n- [[Instruct]] adds an additional move action\n- [[Dancer]] adds an additional move action\n- [[Encore]] replaces the chosen move action with the previous turn's action (without changing timing)\n- [[Pursuit]] replaces the chosen move action with an earlier action\n\nInstruct and Dancer are unique in that they allow more than one move action per turn.\n\nUnlike a direct move usage, these are full move actions, and include all the checks skipped above, as well as PP deduction. The one exception is Dancer, which includes everything else but excludes PP deduction.\n\nIn PS source code, you will see `runMove` when a full move action happens.\n";

},{}],"64WwT":[function(require,module,exports,__globalThis) {
module.exports = "# Terrain\n\nTerrain is a set of field effects that benefit [[grounded]] Pokemon for 5 turns. Each of the four types of terrain has a move and Ability that start the effect. The moves are [[Electric Terrain]], [[Grassy Terrain]], [[Misty Terrain]], and [[Psychic Terrain]], and the corresponding Abilities are [[Electric Surge]], [[Grassy Surge]], [[Misty Surge]], and [[Psychic Surge]]. When a different terrain effect comes into play, it replaces the old one. If the Pokemon that started the effect is holding a [[Terrain Extender]], it lasts 8 turns instead.\n\nSome moves have altered behavior when used while any terrain is active, including [[Camouflage]], [[Nature Power]], and [[Secret Power]]. Certain Abilities are also activated while a specific terrain is in play, which include [[Grass Pelt]] during Grassy Terrain, and [[Surge Surfer]] during Electric Terrain. There are four items that activate as soon as the holder is on the field at the same time as the corresponding terrain effect, which are [[Electric Seed]], [[Grassy Seed]], [[Misty Seed]], and [[Psychic Seed]]. The effects of all of these moves, Abilities, and items happen even if the Pokemon is not grounded.\n\nPokemon that are in the invulnerable turn of a two-turn move are not considered grounded by terrain effects.";

},{}],"cscNI":[function(require,module,exports,__globalThis) {
module.exports = "# Z-Move Resonation\n\n## Certain Pokemon can use Resonating Z-Moves, essentially signature Z-Moves that allow certain pokemon to have another option when holding specific Z-Crystals.\n\n- A Pokemon holding a Z-Crystal that they have resonance with allows them to use a resonating [[Z-Move]]. This Z-Move will usually not be the same type as the crystal.\n- In addition, since the Z-Crystal used is still of a certain type, the Pokemon can also use those Z-Moves as normal, giving them two options in battle.\n- For example: A [[Chatot]] holding a [[Normalium-Z]] can power up any one of its Normal-Type Moves into their Z-Version, such as [[Breakneck Blitz]], or it can power up it's signature move [[Chatter]] into a [[Supersonic Skystrike-R]]. \n- Resonating Z-Moves are the same power as their original Z-Move, so it will be just as strong as if that Chatot was holding a Flyinium-Z instead.\n\n- Resonating Z-Moves are otherwise subject to the same drawbacks and limitations as regular Z-Moves.\n";

},{}],"lplpd":[function(require,module,exports,__globalThis) {
module.exports = "# Z-Pokemon\n\nZ-Pokemon are Static Encounters that have auras that boost various stats, like mini versions of Totem Pokemon.\n\nMany Z-Pokemon are catchable. They mostly act as a good and easy way to spot \"Static Encounters\", but they are also more difficult to battle than they would usually be. \n\nDuring trials, the wild Pokemon you encounter will be Z-Pokemon.\n\nIsland Scan encounters, quest Pokemon, and Ultra Space encounters are more examples of Z-Pokemon.\n\n\n";

},{}],"jcuPW":[function(require,module,exports,__globalThis) {
module.exports = "# Z-Moves\n\nZ-Moves are special moves exclusive to Gen 7 that can only be used once per battle, and require a held Z-Crystal.\n";

},{}]},["kP0AL","rXnTZ"], "rXnTZ", "parcelRequire6a64", {})

//# sourceMappingURL=Binary-Star-Pokedex.17759de4.js.map
