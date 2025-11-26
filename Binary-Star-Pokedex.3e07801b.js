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
})({"7cpv7":[function(require,module,exports,__globalThis) {
var global = arguments[3];
var HMR_HOST = null;
var HMR_PORT = null;
var HMR_SERVER_PORT = 51128;
var HMR_SECURE = false;
var HMR_ENV_HASH = "439701173a9199ea";
var HMR_USE_SSE = false;
module.bundle.HMR_BUNDLE_ID = "e6ea30ef3e07801b";
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

},{}],"93STH":[function(require,module,exports,__globalThis) {
/**
 * Search
 *
 * Code for searching for dex information
 *
 *
 * @author Guangcong Luo <guangcongluo@gmail.com>
 * @license MIT
 */ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
/** ID, SearchType, index (if alias), offset (if offset alias) */ let BattleSearchIndex = [];
let BattleSearchIndexOffset;
function hasAbility(pokemon, ability) {
    for(let key in pokemon.abilities){
        if (toID(pokemon.abilities[key]) == toID(ability)) return true;
    }
    return false;
}
function generateSearchIndex() {
    let index = [];
    index = index.concat(Object.keys(BattlePokedex).map((x)=>x + " pokemon"));
    index = index.concat(Object.keys(BattleMovedex).map((x)=>x + " move"));
    index = index.concat(Object.keys(BattleItems).map((x)=>x + " item"));
    index = index.concat(Object.keys(BattleAbilities).map((x)=>x + " ability"));
    index = index.concat(Object.keys(BattleTypeChart).map((x)=>toID(x) + " type"));
    index = index.concat([
        "physical",
        "special",
        "status"
    ].map((x)=>toID(x) + " category"));
    index = index.concat([
        "monster",
        "water1",
        "bug",
        "flying",
        "field",
        "fairy",
        "grass",
        "humanlike",
        "water3",
        "mineral",
        "amorphous",
        "water2",
        "ditto",
        "dragon",
        "undiscovered"
    ].map((x)=>toID(x) + " egggroup"));
    index.sort();
    // manually rearrange
    index[index.indexOf("grass type")] = "grass egggroup";
    index[index.indexOf("grass egggroup")] = "grass type";
    index[index.indexOf("fairy type")] = "fairy egggroup";
    index[index.indexOf("fairy egggroup")] = "fairy type";
    index[index.indexOf("flying type")] = "flying egggroup";
    index[index.indexOf("flying egggroup")] = "flying type";
    index[index.indexOf("dragon type")] = "dragon egggroup";
    index[index.indexOf("dragon egggroup")] = "dragon type";
    index[index.indexOf("bug type")] = "bug egggroup";
    index[index.indexOf("bug egggroup")] = "bug type";
    index[index.indexOf("psychic type")] = "psychic move";
    index[index.indexOf("psychic move")] = "psychic type";
    if (getID(BattlePokedex, "ditto")) {
        index[index.indexOf("ditto pokemon")] = "ditto egggroup";
        index[index.indexOf("ditto egggroup")] = "ditto pokemon";
    }
    BattleSearchIndex = index.map((x)=>{
        let split = x.split(" ");
        if (split.length > 3) {
            split[3] = Number(split[3]);
            split[2] = index.indexOf(split[2] + " " + split[1]);
        }
        return split;
    });
    BattleSearchIndexOffset = BattleSearchIndex.map((entry, i)=>{
        const id = entry[0];
        let name = "";
        switch(entry[1]){
            case "pokemon":
                name = getID(BattlePokedex, id).name ?? "";
                break;
            case "move":
                name = getID(BattleMovedex, id).name ?? "";
                break;
            case "item":
                name = getID(BattleItems, id).name ?? "";
                break;
            case "ability":
                name = getID(BattleAbilities, id).name ?? "";
                break;
        }
        let res = "";
        let nonAlnum = 0;
        for(let i = 0, j = 0; i < id.length; i++, j++){
            while(!/[a-zA-Z0-9]/.test(name[j])){
                j++;
                nonAlnum++;
            }
            res += nonAlnum;
        }
        if (nonAlnum) return res;
        return "";
    });
}
/**

/**
 * Backend for search UIs.
 */ class DexSearch {
    static{
        this.typeTable = {
            pokemon: 1,
            type: 2,
            tier: 3,
            move: 4,
            item: 5,
            ability: 6,
            egggroup: 7,
            category: 8,
            article: 9
        };
    }
    static{
        this.typeName = {
            pokemon: "Pok&eacute;mon",
            type: "Type",
            tier: "Tiers",
            move: "Moves",
            item: "Items",
            ability: "Abilities",
            egggroup: "Egg group",
            category: "Category",
            article: "Article"
        };
    }
    constructor(searchType = "", formatid = "", species = ""){
        this.query = "";
        this.typedSearch = null;
        this.results = null;
        this.exactMatch = false;
        this.firstPokemonColumn = "Number";
        /**
   * Column to sort by. Default is `null`, a smart sort determined by how good
   * things are according to the base filters, falling back to dex number (for
   * Pokemon) and name (for everything else).
   */ this.sortCol = null;
        this.reverseSort = false;
        /**
   * Filters for the search result. Does not include the two base filters
   * (format and species).
   */ this.filters = null;
        generateSearchIndex();
        this.setType(searchType, formatid, species);
    }
    getTypedSearch(searchType, format = "", speciesOrSet) {
        if (!searchType) return null;
        switch(searchType){
            case "pokemon":
                return new BattlePokemonSearch("pokemon", format, speciesOrSet);
            case "item":
                return new BattleItemSearch("item", format, speciesOrSet);
            case "move":
                return new BattleMoveSearch("move", format, speciesOrSet);
            case "ability":
                return new BattleAbilitySearch("ability", format, speciesOrSet);
            case "type":
                return new BattleTypeSearch("type", format, speciesOrSet);
            case "category":
                return new BattleCategorySearch("category", format, speciesOrSet);
        }
        return null;
    }
    find(query) {
        query = toID(query);
        if (this.query === query && this.results) return false;
        this.query = query;
        if (!query) this.results = this.typedSearch?.getResults(this.filters, this.sortCol, this.reverseSort) || [];
        else this.results = this.textSearch(query);
        return true;
    }
    setType(searchType, format = "", speciesOrSet) {
        // invalidate caches
        this.results = null;
        if (searchType !== this.typedSearch?.searchType) {
            this.filters = null;
            this.sortCol = null;
        }
        this.typedSearch = this.getTypedSearch(searchType, format, speciesOrSet);
    }
    addFilter(entry) {
        if (!this.typedSearch) return false;
        let [type] = entry;
        if (this.typedSearch.searchType === "pokemon") {
            if (type === this.sortCol) this.sortCol = null;
            if (![
                "type",
                "move",
                "ability",
                "egggroup",
                "tier"
            ].includes(type)) return false;
            if (type === "move") entry[1] = toID(entry[1]);
            if (!this.filters) this.filters = [];
            this.results = null;
            for (const filter of this.filters){
                if (filter[0] === type && filter[1] === entry[1]) return true;
            }
            this.filters.push(entry);
            return true;
        } else if (this.typedSearch.searchType === "move") {
            if (type === this.sortCol) this.sortCol = null;
            if (![
                "type",
                "category",
                "pokemon"
            ].includes(type)) return false;
            if (type === "pokemon") entry[1] = toID(entry[1]);
            if (!this.filters) this.filters = [];
            this.filters.push(entry);
            this.results = null;
            return true;
        }
        return false;
    }
    removeFilter(entry) {
        if (!this.filters) return false;
        if (entry) {
            const filterid = entry.join(":");
            let deleted = null;
            // delete specific filter
            for(let i = 0; i < this.filters.length; i++)if (filterid === this.filters[i].join(":")) {
                deleted = this.filters[i];
                this.filters.splice(i, 1);
                break;
            }
            if (!deleted) return false;
        } else this.filters.pop();
        if (!this.filters.length) this.filters = null;
        this.results = null;
        return true;
    }
    toggleSort(sortCol) {
        if (this.sortCol === sortCol) {
            if (!this.reverseSort) this.reverseSort = true;
            else {
                this.sortCol = null;
                this.reverseSort = false;
            }
        } else {
            this.sortCol = sortCol;
            this.reverseSort = false;
        }
        this.results = null;
    }
    filterLabel(filterType) {
        if (this.typedSearch && this.typedSearch.searchType !== filterType) return "Filter";
        return null;
    }
    illegalLabel(id) {
        return this.typedSearch?.illegalReasons?.[id] || null;
    }
    textSearch(query) {
        query = toID(query);
        this.exactMatch = false;
        let searchType = this.typedSearch?.searchType || "";
        // If searchType exists, we're searching mainly for results of that type.
        // We'll still search for results of other types, but those results
        // will only be used to filter results for that type.
        let searchTypeIndex = searchType ? DexSearch.typeTable[searchType] : -1;
        /** searching for "Psychic type" will make the type come up over the move */ let qFilterType = "";
        if (query.slice(-4) === "type") {
            if (query.slice(0, -4) in BattleTypeChart) {
                query = query.slice(0, -4);
                qFilterType = "type";
            }
        }
        // i represents the location of the search index we're looking at
        let i = DexSearch.getClosest(query);
        this.exactMatch = BattleSearchIndex[i][0] === query;
        // Even with output buffer buckets, we make multiple passes through
        // the search index. searchPasses is a queue of which pass we're on:
        // [passType, i, query]
        // By doing an alias pass after the normal pass, we ensure that
        // mid-word matches only display after start matches.
        let passType = "";
        let searchPasses = [
            [
                "normal",
                i,
                query
            ]
        ];
        // For performance reasons, only do an alias pass if query is at
        // least 2 chars long
        if (query.length > 1) searchPasses.push([
            "alias",
            i,
            query
        ]);
        // If there are no matches starting with query: Do a fuzzy match pass
        // Fuzzy matches will still be shown after alias matches
        if (!this.exactMatch && BattleSearchIndex[i][0].substr(0, query.length) !== query) {
            // No results start with this. Do a fuzzy match pass.
            let matchLength = query.length - 1;
            if (!i) i++;
            while(matchLength && BattleSearchIndex[i][0].substr(0, matchLength) !== query.substr(0, matchLength) && BattleSearchIndex[i - 1][0].substr(0, matchLength) !== query.substr(0, matchLength))matchLength--;
            let matchQuery = query.substr(0, matchLength);
            while(i >= 1 && BattleSearchIndex[i - 1][0].substr(0, matchLength) === matchQuery)i--;
            searchPasses.push([
                "fuzzy",
                i,
                ""
            ]);
        }
        // We split the output buffers into 8 buckets.
        // Bucket 0 is usually unused, and buckets 1-7 represent
        // pokemon, types, moves, etc (see typeTable).
        // When we're done, the buffers are concatenated together to form
        // our results, with each buffer getting its own header, unlike
        // multiple-pass results, which have no header.
        // Notes:
        // - if we have a searchType, that searchType's buffer will be on top
        let bufs = [
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            []
        ];
        let topbufIndex = -1;
        let count = 0;
        let nearMatch = false;
        /** [type, id, typeIndex] */ let instafilter = null;
        let instafilterSort = [
            0,
            1,
            2,
            5,
            4,
            3,
            6,
            7,
            8
        ];
        let illegal = this.typedSearch?.illegalReasons;
        // We aren't actually looping through the entirety of the searchIndex
        for(i = 0; i < BattleSearchIndex.length; i++){
            if (!passType) {
                let searchPass = searchPasses.shift();
                if (!searchPass) break;
                passType = searchPass[0];
                i = searchPass[1];
                query = searchPass[2];
            }
            let entry = BattleSearchIndex[i];
            let id = entry[0];
            let type = entry[1];
            if (!id) break;
            if (passType === "fuzzy") {
                // fuzzy match pass; stop after 2 results
                if (count >= 2) {
                    passType = "";
                    continue;
                }
                nearMatch = true;
            } else if (passType === "exact") // exact pass; stop after 1 result
            {
                if (count >= 1) {
                    passType = "";
                    continue;
                }
            } else if (id.substr(0, query.length) !== query) {
                // regular pass, time to move onto our next match
                passType = "";
                continue;
            }
            if (entry.length > 2) {
                // alias entry
                if (passType !== "alias") continue;
            } else {
                // normal entry
                if (passType === "alias") continue;
            }
            let typeIndex = DexSearch.typeTable[type];
            // For performance, with a query length of 1, we only fill the first bucket
            if (query.length === 1 && typeIndex !== (searchType ? searchTypeIndex : 1)) continue;
            // For pokemon queries, accept types/tier/abilities/moves/eggroups as filters
            if (searchType === "pokemon" && (typeIndex === 5 || typeIndex > 7)) continue;
            // For move queries, accept types/categories as filters
            if (searchType === "move" && (typeIndex !== 8 && typeIndex > 4 || typeIndex === 3)) continue;
            // For move queries in the teambuilder, don't accept pokemon as filters
            if (searchType === "move" && illegal && typeIndex === 1) continue;
            // For ability/item queries, don't accept anything else as a filter
            if ((searchType === "ability" || searchType === "item") && typeIndex !== searchTypeIndex) continue;
            // Query was a type name followed 'type'; only show types
            if (qFilterType === "type" && typeIndex !== 2) continue;
            // hardcode cases of duplicate non-consecutive aliases
            if ((id === "megax" || id === "megay") && "mega".startsWith(query)) continue;
            let matchStart = 0;
            let matchEnd = 0;
            if (passType === "alias") {
                // alias entry
                // [aliasid, type, originalid, matchStart, originalindex]
                matchStart = entry[3];
                let originalIndex = entry[2];
                if (matchStart) {
                    matchEnd = matchStart + query.length;
                    matchStart += (BattleSearchIndexOffset[originalIndex][matchStart] || "0").charCodeAt(0) - 48;
                    matchEnd += (BattleSearchIndexOffset[originalIndex][matchEnd - 1] || "0").charCodeAt(0) - 48;
                }
                id = BattleSearchIndex[originalIndex][0];
            } else {
                matchEnd = query.length;
                if (matchEnd) matchEnd += (BattleSearchIndexOffset[i][matchEnd - 1] || "0").charCodeAt(0) - 48;
            }
            if (searchType && searchTypeIndex !== typeIndex) // This is a filter, set it as an instafilter candidate
            {
                if (!instafilter || instafilterSort[typeIndex] < instafilterSort[instafilter[2]]) instafilter = [
                    type,
                    id,
                    typeIndex
                ];
            }
            // show types above Arceus formes
            if (topbufIndex < 0 && searchTypeIndex < 2 && passType === "alias" && !bufs[1].length && bufs[2].length) topbufIndex = 2;
            if (illegal && typeIndex === searchTypeIndex) {
                // Always show illegal results under legal results.
                // This is done by putting legal results (and the type header)
                // in bucket 0, and illegal results in the searchType's bucket.
                // searchType buckets are always on top (but under bucket 0), so
                // illegal results will be seamlessly right under legal results.
                if (!bufs[typeIndex].length && !bufs[0].length) bufs[0] = [
                    [
                        "header",
                        DexSearch.typeName[type]
                    ]
                ];
                if (!(id in illegal)) typeIndex = 0;
            } else if (!bufs[typeIndex].length) bufs[typeIndex] = [
                [
                    "header",
                    DexSearch.typeName[type]
                ]
            ];
            // don't match duplicate aliases
            let curBufLength = passType === "alias" && bufs[typeIndex].length;
            if (curBufLength && bufs[typeIndex][curBufLength - 1][1] === id) continue;
            bufs[typeIndex].push([
                type,
                id,
                matchStart,
                matchEnd
            ]);
            count++;
        }
        let topbuf = [];
        if (nearMatch) topbuf = [
            [
                "html",
                `<em>No exact match found. The closest matches alphabetically are:</em>`
            ]
        ];
        if (topbufIndex >= 0) {
            topbuf = topbuf.concat(bufs[topbufIndex]);
            bufs[topbufIndex] = [];
        }
        if (searchTypeIndex >= 0) {
            topbuf = topbuf.concat(bufs[0]);
            topbuf = topbuf.concat(bufs[searchTypeIndex]);
            bufs[searchTypeIndex] = [];
            bufs[0] = [];
        }
        if (instafilter && count < 20) // Result count is less than 20, so we can instafilter
        bufs.push(this.instafilter(searchType, instafilter[0], instafilter[1]));
        this.results = Array.prototype.concat.apply(topbuf, bufs);
        return this.results ?? [];
    }
    instafilter(searchType, fType, fId) {
        let buf = [];
        let illegalBuf = [];
        let illegal = this.typedSearch?.illegalReasons;
        if (searchType === "pokemon") switch(fType){
            case "type":
                let type = fId.charAt(0).toUpperCase() + fId.slice(1);
                buf.push([
                    "header",
                    `${type}-type Pok&eacute;mon`
                ]);
                for(let id in BattlePokedex){
                    if (!BattlePokedex[id].types) continue;
                    if (BattlePokedex[id].types.includes(type)) (illegal && id in illegal ? illegalBuf : buf).push([
                        "pokemon",
                        id
                    ]);
                }
                break;
            case "ability":
                let ability = getID(BattleAbilities, fId).name;
                buf.push([
                    "header",
                    `${ability} Pok&eacute;mon`
                ]);
                for(let id in BattlePokedex){
                    if (!BattlePokedex[id].abilities) continue;
                    if (hasAbility(BattlePokedex[id], ability)) (illegal && id in illegal ? illegalBuf : buf).push([
                        "pokemon",
                        id
                    ]);
                }
                break;
        }
        else if (searchType === "move") switch(fType){
            case "type":
                let type1 = fId.charAt(0).toUpperCase() + fId.slice(1);
                buf.push([
                    "header",
                    `${type1}-type moves`
                ]);
                for(let id in BattleMovedex)if (BattleMovedex[id].type === type1) (illegal && id in illegal ? illegalBuf : buf).push([
                    "move",
                    id
                ]);
                break;
            case "category":
                let category = fId.charAt(0).toUpperCase() + fId.slice(1);
                buf.push([
                    "header",
                    `${category} moves`
                ]);
                for(let id in BattleMovedex)if (BattleMovedex[id].category === category) (illegal && id in illegal ? illegalBuf : buf).push([
                    "move",
                    id
                ]);
                break;
        }
        return [
            ...buf,
            ...illegalBuf
        ];
    }
    static getClosest(query) {
        // binary search through the index!
        let left = 0;
        let right = BattleSearchIndex.length - 1;
        while(right > left){
            let mid = Math.floor((right - left) / 2 + left);
            if (BattleSearchIndex[mid][0] === query && (mid === 0 || BattleSearchIndex[mid - 1][0] !== query)) // that's us
            return mid;
            else if (BattleSearchIndex[mid][0] < query) left = mid + 1;
            else right = mid - 1;
        }
        if (left >= BattleSearchIndex.length - 1) left = BattleSearchIndex.length - 1;
        else if (BattleSearchIndex[left + 1][0] && BattleSearchIndex[left][0] < query) left++;
        if (left && BattleSearchIndex[left - 1][0] === query) left--;
        return left;
    }
}
class BattleTypedSearch {
    constructor(searchType, format = "", speciesOrSet = ""){
        /**
   * `species` is the second of two base filters. It constrains results to
   * things that species can use, and affects the default sort.
   */ this.species = "";
        /**
   * `set` is a pseudo-base filter; it has minor effects on move sorting.
   * (Abilities/items can affect what moves are sorted as usable.)
   */ this.set = null;
        /**
   * Cached copy of what the results list would be with only base filters
   * (i.e. with an empty `query` and `filters`)
   */ this.baseResults = null;
        /**
   * Cached copy of all results not in `baseResults` - mostly in case a user
   * is wondering why a specific result isn't showing up.
   */ this.baseIllegalResults = null;
        this.illegalReasons = null;
        this.results = null;
        this.sortRow = null;
        this.searchType = searchType;
        this.baseResults = null;
        this.baseIllegalResults = null;
        this.species = "";
        this.set = null;
        if (typeof speciesOrSet === "string") {
            if (speciesOrSet) this.species = speciesOrSet;
        } else {
            this.set = speciesOrSet;
            this.species = toID(this.set.species);
        }
        if (!searchType || !this.set) return;
    }
    getResults(filters, sortCol, reverseSort) {
        if (sortCol === "type") return [
            this.sortRow,
            ...BattleTypeSearch.prototype.getDefaultResults.call(this)
        ];
        else if (sortCol === "category") return [
            this.sortRow,
            ...BattleCategorySearch.prototype.getDefaultResults.call(this)
        ];
        else if (sortCol === "ability") return [
            this.sortRow,
            ...BattleAbilitySearch.prototype.getDefaultResults.call(this)
        ];
        if (!this.baseResults) this.baseResults = this.getBaseResults();
        if (!this.baseIllegalResults) {
            const legalityFilter = {};
            for (const [resultType, value] of this.baseResults)if (resultType === this.searchType) legalityFilter[value] = 1;
            this.baseIllegalResults = [];
            this.illegalReasons = {};
            for(const id in this.getTable())if (!(id in legalityFilter)) {
                this.baseIllegalResults.push([
                    this.searchType,
                    id
                ]);
                this.illegalReasons[id] = "Illegal";
            }
        }
        let results;
        let illegalResults;
        if (filters) {
            results = [];
            illegalResults = [];
            for (const result of this.baseResults)if (this.filter(result, filters)) {
                if (results.length && result[0] === "header" && results[results.length - 1][0] === "header") results[results.length - 1] = result;
                else results.push(result);
            }
            if (results.length && results[results.length - 1][0] === "header") results.pop();
            for (const result of this.baseIllegalResults)if (this.filter(result, filters)) illegalResults.push(result);
        } else {
            results = [
                ...this.baseResults
            ];
            illegalResults = null;
        }
        if (sortCol) {
            results = results.filter(([rowType])=>rowType === this.searchType);
            results = this.sort(results, sortCol, reverseSort);
            if (illegalResults) {
                illegalResults = illegalResults.filter(([rowType])=>rowType === this.searchType);
                illegalResults = this.sort(illegalResults, sortCol, reverseSort);
            }
        }
        if (this.sortRow) results = [
            this.sortRow,
            ...results
        ];
        if (illegalResults && illegalResults.length) results = [
            ...results,
            [
                "header",
                "Illegal results"
            ],
            ...illegalResults
        ];
        return results;
    }
}
class BattlePokemonSearch extends BattleTypedSearch {
    filter(row, filters) {
        if (!filters) return true;
        if (row[0] !== "pokemon") return true;
        const poke = getID(BattlePokedex, row[1]);
        for (const [filterType, value] of filters)switch(filterType){
            case "type":
                if (poke.types.every((t)=>t != value)) return false;
                break;
            case "move":
                if (!canLearn(poke.id, value)) return false;
                break;
            case "ability":
                if (!hasAbility(poke, value)) return false;
                break;
            case "egggroup":
                if (poke.eggGroups.every((t)=>t != value)) return false;
                break;
        }
        return true;
    }
    getTable() {
        return BattlePokedex;
    }
    getDefaultResults() {
        const groups = {};
        for(const id in BattlePokedex){
            const p = BattlePokedex[id];
            if (!p) continue;
            const baseId = toID(p.baseSpecies || p.name);
            if (!groups[baseId]) groups[baseId] = {
                base: id,
                num: p.num || 0,
                forms: []
            };
            // Identify base (prefer the entry whose name equals baseSpecies or has no forme)
            const isBase = !p.forme || p.name === p.baseSpecies;
            if (isBase) {
                groups[baseId].base = id;
                groups[baseId].num = p.num || groups[baseId].num;
            } else groups[baseId].forms.push(id);
        }
        // Sort forms within each group deterministically (by name/forme)
        for(const baseId in groups)groups[baseId].forms.sort((a, b)=>{
            const pa = BattlePokedex[a];
            const pb = BattlePokedex[b];
            const fa = (pa.forme || pa.name).toLowerCase();
            const fb = (pb.forme || pb.name).toLowerCase();
            return fa < fb ? -1 : fa > fb ? 1 : 0;
        });
        // Order groups by dex number then base id
        const ordered = Object.values(groups).sort((a, b)=>a.num - b.num || (a.base < b.base ? -1 : a.base > b.base ? 1 : 0));
        // Build global form order mapping for suffix rendering in UI
        window.BattleFormOrder = {};
        for (const g of ordered)window.BattleFormOrder[toID(BattlePokedex[g.base].baseSpecies || BattlePokedex[g.base].name)] = g.forms.slice();
        const results = [];
        for (const g of ordered){
            const baseId = g.base;
            switch(baseId){
                case "bulbasaur":
                    results.push([
                        "header",
                        "Generation 1"
                    ]);
                    break;
                case "chikorita":
                    results.push([
                        "header",
                        "Generation 2"
                    ]);
                    break;
                case "treecko":
                    results.push([
                        "header",
                        "Generation 3"
                    ]);
                    break;
                case "turtwig":
                    results.push([
                        "header",
                        "Generation 4"
                    ]);
                    break;
                case "victini":
                    results.push([
                        "header",
                        "Generation 5"
                    ]);
                    break;
                case "chespin":
                    results.push([
                        "header",
                        "Generation 6"
                    ]);
                    break;
                case "rowlet":
                    results.push([
                        "header",
                        "Generation 7"
                    ]);
                    break;
                case "grookey":
                    results.push([
                        "header",
                        "Generation 8"
                    ]);
                    break;
                case "sprigatito":
                    results.push([
                        "header",
                        "Generation 9"
                    ]);
                    break;
                case "missingno":
                    results.push([
                        "header",
                        "Glitch"
                    ]);
                    break;
                case "syclar":
                    results.push([
                        "header",
                        "CAP"
                    ]);
                    break;
                case "pikachucosplay":
                    continue; // skip cosplay aggregate
            }
            results.push([
                "pokemon",
                baseId
            ]);
            for (const fid of g.forms)results.push([
                "pokemon",
                fid
            ]);
        }
        return results;
    }
    getBaseResults() {
        return this.getDefaultResults();
    }
    sort(results, sortCol, reverseSort) {
        const sortOrder = reverseSort ? -1 : 1;
        if ([
            "hp",
            "atk",
            "def",
            "spa",
            "spd",
            "spe"
        ].includes(sortCol)) return results.sort(([rowType1, id1], [rowType2, id2])=>{
            const stat1 = getID(BattlePokedex, id1).baseStats[sortCol];
            const stat2 = getID(BattlePokedex, id2).baseStats[sortCol];
            return (stat2 - stat1) * sortOrder;
        });
        else if (sortCol === "bst") return results.sort(([rowType1, id1], [rowType2, id2])=>{
            const base1 = getID(BattlePokedex, id1).baseStats;
            const base2 = getID(BattlePokedex, id2).baseStats;
            const bst1 = base1.hp + base1.atk + base1.def + base1.spa + base1.spd + base1.spe;
            const bst2 = base2.hp + base2.atk + base2.def + base2.spa + base2.spd + base2.spe;
            return (bst2 - bst1) * sortOrder;
        });
        else if (sortCol === "name") return results.sort(([rowType1, id1], [rowType2, id2])=>{
            const name1 = id1;
            const name2 = id2;
            return (name1 < name2 ? -1 : name1 > name2 ? 1 : 0) * sortOrder;
        });
        throw new Error("invalid sortcol");
    }
    constructor(...args){
        super(...args), this.sortRow = [
            "sortpokemon",
            ""
        ];
    }
}
class BattleAbilitySearch extends BattleTypedSearch {
    getTable() {
        return BattleAbilities;
    }
    getDefaultResults() {
        const results = [];
        for(let id in BattleAbilities)results.push([
            "ability",
            id
        ]);
        return results;
    }
    getBaseResults() {
        return this.getDefaultResults();
    }
    filter(row, filters) {
        if (!filters) return true;
        if (row[0] !== "ability") return true;
        const ability = getID(BattleAbilities, row[1]);
        for (const [filterType, value] of filters)switch(filterType){
            case "pokemon":
                if (!hasAbility(getID(BattlePokedex, value), ability.name)) return false;
                break;
        }
        return true;
    }
    sort(results, sortCol, reverseSort) {
        throw new Error("invalid sortcol");
    }
}
class BattleItemSearch extends BattleTypedSearch {
    getTable() {
        return BattleItems;
    }
    getDefaultResults() {
        let results = [];
        results.push([
            "header",
            "Items"
        ]);
        for(let id in BattleItems)results.push([
            "item",
            id
        ]);
        return results;
    }
    getBaseResults() {
        return this.getDefaultResults();
    }
    filter(row, filters) {
        throw new Error("invalid filter");
    }
    sort(results, sortCol, reverseSort) {
        throw new Error("invalid sortcol");
    }
}
class BattleMoveSearch extends BattleTypedSearch {
    getTable() {
        return BattleMovedex;
    }
    getDefaultResults() {
        let results = [];
        results.push([
            "header",
            "Moves"
        ]);
        for(let id in BattleMovedex)results.push([
            "move",
            id
        ]);
        return results;
    }
    getBaseResults() {
        return this.getDefaultResults();
    }
    filter(row, filters) {
        if (!filters) return true;
        if (row[0] !== "move") return true;
        const move = getID(BattleMovedex, row[1]);
        for (const [filterType, value] of filters)switch(filterType){
            case "type":
                if (move.type !== value) return false;
                break;
            case "category":
                if (move.category !== value) return false;
                break;
            case "pokemon":
                if (!canLearn(value, move.id)) return false;
                break;
        }
        return true;
    }
    sort(results, sortCol, reverseSort) {
        const sortOrder = reverseSort ? -1 : 1;
        switch(sortCol){
            case "power":
                let powerTable = {
                    return: 102,
                    frustration: 102,
                    spitup: 300,
                    trumpcard: 200,
                    naturalgift: 80,
                    grassknot: 120,
                    lowkick: 120,
                    gyroball: 150,
                    electroball: 150,
                    flail: 200,
                    reversal: 200,
                    present: 120,
                    wringout: 120,
                    crushgrip: 120,
                    heatcrash: 120,
                    heavyslam: 120,
                    fling: 130,
                    magnitude: 150,
                    beatup: 24,
                    punishment: 1020,
                    psywave: 1250,
                    nightshade: 1200,
                    seismictoss: 1200,
                    dragonrage: 1140,
                    sonicboom: 1120,
                    superfang: 1350,
                    endeavor: 1399,
                    sheercold: 1501,
                    fissure: 1500,
                    horndrill: 1500,
                    guillotine: 1500
                };
                return results.sort(([rowType1, id1], [rowType2, id2])=>{
                    let move1 = getID(BattleMovedex, id1);
                    let move2 = getID(BattleMovedex, id2);
                    let pow1 = move1.basePower || powerTable[id1] || (move1.category === "Status" ? -1 : 1400);
                    let pow2 = move2.basePower || powerTable[id2] || (move2.category === "Status" ? -1 : 1400);
                    return (pow2 - pow1) * sortOrder;
                });
            case "accuracy":
                return results.sort(([rowType1, id1], [rowType2, id2])=>{
                    let accuracy1 = getID(BattleMovedex, id1).accuracy || 0;
                    let accuracy2 = getID(BattleMovedex, id2).accuracy || 0;
                    if (accuracy1 === true) accuracy1 = 101;
                    if (accuracy2 === true) accuracy2 = 101;
                    return (accuracy2 - accuracy1) * sortOrder;
                });
            case "pp":
                return results.sort(([rowType1, id1], [rowType2, id2])=>{
                    let pp1 = getID(BattleMovedex, id1).pp || 0;
                    let pp2 = getID(BattleMovedex, id2).pp || 0;
                    return (pp2 - pp1) * sortOrder;
                });
            case "name":
                return results.sort(([rowType1, id1], [rowType2, id2])=>{
                    const name1 = id1;
                    const name2 = id2;
                    return (name1 < name2 ? -1 : name1 > name2 ? 1 : 0) * sortOrder;
                });
        }
        throw new Error("invalid sortcol");
    }
    constructor(...args){
        super(...args), this.sortRow = [
            "sortmove",
            ""
        ];
    }
}
class BattleCategorySearch extends BattleTypedSearch {
    getTable() {
        return {
            physical: 1,
            special: 1,
            status: 1
        };
    }
    getDefaultResults() {
        return [
            [
                "category",
                "physical"
            ],
            [
                "category",
                "special"
            ],
            [
                "category",
                "status"
            ]
        ];
    }
    getBaseResults() {
        return this.getDefaultResults();
    }
    filter(row, filters) {
        throw new Error("invalid filter");
    }
    sort(results, sortCol, reverseSort) {
        throw new Error("invalid sortcol");
    }
}
class BattleTypeSearch extends BattleTypedSearch {
    getTable() {
        return BattleTypeChart;
    }
    getDefaultResults() {
        const results = [];
        for(let id in BattleTypeChart)results.push([
            "type",
            id
        ]);
        return results;
    }
    getBaseResults() {
        return this.getDefaultResults();
    }
    filter(row, filters) {
        throw new Error("invalid filter");
    }
    sort(results, sortCol, reverseSort) {
        throw new Error("invalid sortcol");
    }
}
window.DexSearch = DexSearch;

},{"@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}]},["7cpv7","93STH"], "93STH", "parcelRequire6a64", {})

//# sourceMappingURL=Binary-Star-Pokedex.3e07801b.js.map
