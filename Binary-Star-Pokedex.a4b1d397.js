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
})({"iJJzK":[function(require,module,exports,__globalThis) {
var global = arguments[3];
var HMR_HOST = null;
var HMR_PORT = null;
var HMR_SERVER_PORT = 1234;
var HMR_SECURE = false;
var HMR_ENV_HASH = "439701173a9199ea";
var HMR_USE_SSE = false;
module.bundle.HMR_BUNDLE_ID = "8a722825a4b1d397";
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

},{}],"a9pVX":[function(require,module,exports,__globalThis) {
/**
 * Search
 *
 * Basically just an improved version of utilichart
 *
 * Dependencies: jQuery, battledata, search-index
 * Optional dependencies: pokedex, moves, items, abilities
 *
 * @author Guangcong Luo <guangcongluo@gmail.com>
 */ (function(exports, $) {
    'use strict';
    function Search(elem, viewport) {
        this.$el = $(elem);
        this.el = this.$el[0];
        this.$viewport = viewport ? $(viewport) : $(window);
        this.urlRoot = '';
        this.q = undefined; // uninitialized
        this.exactMatch = false;
        this.resultSet = null;
        this.filters = null;
        this.sortCol = null;
        this.renderedIndex = 0;
        this.renderingDone = true;
        this.externalFilter = false;
        this.cur = {};
        this.$inputEl = null;
        this.gen = 9;
        this.mod = null;
        this.engine = new DexSearch();
        window.search = this;
        var self = this;
        this.$el.on('click', '.more button', function(e) {
            e.preventDefault();
            self.updateScroll(true);
        });
        this.$el.on('click', '.filter', function(e) {
            e.preventDefault();
            self.removeFilter(e);
            if (self.$inputEl) self.$inputEl.focus();
        });
        this.$el.on('click', '.sortcol', function(e) {
            e.preventDefault();
            e.stopPropagation();
            var sortCol = e.currentTarget.dataset.sort;
            self.engine.toggleSort(sortCol);
            self.sortCol = self.engine.sortCol;
            self.find('');
        });
    }
    Search.prototype.$ = function(query) {
        return this.$el.find(query);
    };
    //
    // Search functions
    //
    Search.prototype.find = function(query, firstElem) {
        if (!this.engine.find(query)) return; // nothing changed
        this.exactMatch = this.engine.exactMatch;
        this.q = this.engine.query;
        this.resultSet = this.engine.results;
        if (firstElem) {
            this.resultSet = [
                [
                    this.engine.typedSearch.searchType,
                    firstElem
                ]
            ].concat(this.resultSet);
            if (this.resultSet.length > 1 && [
                'sortpokemon',
                'sortmove'
            ].includes(this.resultSet[1][0])) {
                var sortRow = this.resultSet[1];
                this.resultSet[1] = this.resultSet[0];
                this.resultSet[0] = sortRow;
            }
        }
        if (this.filters) this.resultSet = [
            [
                'html',
                this.getFilterText()
            ]
        ].concat(this.resultSet);
        this.renderedIndex = 0;
        this.renderingDone = false;
        this.updateScroll();
        return true;
    };
    Search.prototype.addFilter = function(node) {
        if (!node.dataset.entry) return false;
        var entry = node.dataset.entry.split('|');
        var result = this.engine.addFilter(entry);
        this.filters = this.engine.filters;
        return result;
    };
    Search.prototype.removeFilter = function(e) {
        var result;
        if (e) result = this.engine.removeFilter(e.currentTarget.value.split(':'));
        else result = this.engine.removeFilter();
        this.filters = this.engine.filters;
        this.find('');
        return result;
    };
    Search.prototype.getFilterText = function(q) {
        var buf = '<p>Filters: ';
        for(var i = 0; i < this.filters.length; i++){
            var text = this.filters[i][1];
            if (this.filters[i][0] === 'move') text = getID(BattleMovedex, text).name;
            if (this.filters[i][0] === 'pokemon') text = getID(BattlePokedex, text).name;
            buf += '<button class="filter" value="' + escapeHTML(this.filters[i].join(':')) + '">' + text + ' <i class="fa fa-times-circle"></i></button> ';
        }
        if (!q) buf += '<small style="color: #888">(backspace = delete filter)</small>';
        return buf + '</p>';
    };
    Search.prototype.updateScroll = function(forceAdd) {
        if (this.renderingDone) return;
        var top = this.$viewport.scrollTop();
        var bottom = top + this.$viewport.height();
        var windowHeight = $(window).height();
        var i = this.renderedIndex;
        var finalIndex = Math.floor(bottom / 33) + 1;
        if (!forceAdd && finalIndex <= i) return;
        if (finalIndex < i + 20) finalIndex = i + 20;
        if (bottom - top > windowHeight && !i) finalIndex = 20;
        if (forceAdd && finalIndex > i + 40) finalIndex = i + 40;
        var resultSet = this.resultSet;
        var buf = '';
        while(i < finalIndex){
            if (!resultSet[i]) {
                this.renderingDone = true;
                break;
            }
            var row = resultSet[i];
            var errorMessage = '';
            var label;
            if (label = this.engine.filterLabel(row[0])) errorMessage = '<span class="col filtercol"><em>' + label + '</em></span>';
            else if (label = this.engine.illegalLabel(row[1])) errorMessage = '<span class="col illegalcol"><em>' + label + '</em></span>';
            var mStart = 0;
            var mEnd = 0;
            if (row.length > 3) {
                mStart = row[2];
                mEnd = row[3];
            }
            buf += this.renderRow(row[1], row[0], mStart, mEnd, errorMessage, row[1] in this.cur ? ' class="cur"' : '');
            i++;
        }
        if (!this.renderedIndex) {
            this.el.innerHTML = '<ul class="utilichart" style="height:' + resultSet.length * 33 + 'px">' + buf + (!this.renderingDone ? '<li class="result more"><p><button class="button big">More</button></p></li>' : '') + '</ul>';
            this.moreVisible = true;
        } else {
            if (this.moreVisible) {
                this.$el.find('.more').remove();
                if (!forceAdd) this.moreVisible = false;
            }
            $(this.el.firstChild).append(buf + (forceAdd && !this.renderingDone ? '<li class="result more"><p><button class="button big">More</button></p></li>' : ''));
        }
        this.renderedIndex = i;
    };
    Search.prototype.setType = function(qType, format, set, cur) {
        this.engine.setType(qType, format, set);
        this.filters = this.engine.filters;
        this.sortCol = this.engine.sortCol;
        this.cur = cur || {};
        var firstElem;
        for(var id in cur){
            firstElem = id;
            break;
        }
        this.find('', firstElem);
    };
    /*********************************************************
	 * Rendering functions
	 *********************************************************/ // These all have static versions
    Search.prototype.renderRow = function(id, type, matchStart, matchLength, errorMessage, attrs) {
        // errorMessage = '<span class="col illegalcol"><em>' + errorMessage + '</em></span>';
        switch(type){
            case 'html':
                return '<li class="result">' + id + '</li>';
            case 'header':
                return '<li class="result"><h3>' + id + '</h3></li>';
            case 'sortpokemon':
                return this.renderPokemonSortRow();
            case 'sortmove':
                return this.renderMoveSortRow();
            case 'pokemon':
                var pokemon = getID(BattlePokedex, id);
                return this.renderPokemonRow(pokemon, matchStart, matchLength, errorMessage, attrs);
            case 'move':
                var move = getID(BattleMovedex, id);
                return this.renderMoveRow(move, matchStart, matchLength, errorMessage, attrs);
            case 'item':
                var item = getID(BattleItems, id);
                return this.renderItemRow(item, matchStart, matchLength, errorMessage, attrs);
            case 'ability':
                var ability = getID(BattleAbilities, id);
                return this.renderAbilityRow(ability, matchStart, matchLength, errorMessage, attrs);
            case 'type':
                var type = {
                    name: id[0].toUpperCase() + id.substr(1)
                };
                return this.renderTypeRow(type, matchStart, matchLength, errorMessage);
            case 'egggroup':
                // very hardcode
                var egName;
                if (id === 'humanlike') egName = 'Human-Like';
                else if (id === 'water1') egName = 'Water 1';
                else if (id === 'water2') egName = 'Water 2';
                else if (id === 'water3') egName = 'Water 3';
                if (egName) {
                    if (matchLength > 5) matchLength++;
                } else egName = id[0].toUpperCase() + id.substr(1);
                var egggroup = {
                    name: egName
                };
                return this.renderEggGroupRow(egggroup, matchStart, matchLength, errorMessage);
            case 'tier':
                // very hardcode
                var tierTable = {
                    uber: "Uber",
                    ou: "OU",
                    uu: "UU",
                    ru: "RU",
                    nu: "NU",
                    pu: "PU",
                    zu: "(PU)",
                    nfe: "NFE",
                    lc: "LC",
                    cap: "CAP",
                    caplc: "CAP LC",
                    capnfe: "CAP NFE",
                    uubl: "UUBL",
                    rubl: "RUBL",
                    nubl: "NUBL",
                    publ: "PUBL"
                };
                var tier = {
                    name: tierTable[id]
                };
                return this.renderTierRow(tier, matchStart, matchLength, errorMessage);
            case 'category':
                var category = {
                    name: id[0].toUpperCase() + id.substr(1),
                    id: id
                };
                return this.renderCategoryRow(category, matchStart, matchLength, errorMessage);
            case 'article':
                var articleTitle = window.BattleArticleTitles && BattleArticleTitles[id] || id[0].toUpperCase() + id.substr(1);
                var article = {
                    name: articleTitle,
                    id: id
                };
                return this.renderArticleRow(article, matchStart, matchLength, errorMessage);
        }
        return 'Error: not found';
    };
    Search.prototype.renderPokemonSortRow = function() {
        var buf = '<li class="result"><div class="sortrow">';
        buf += '<button class="sortcol numsortcol' + (!this.sortCol ? ' cur' : '') + '">' + (!this.sortCol ? 'Sort: ' : this.engine.firstPokemonColumn) + '</button>';
        buf += '<button class="sortcol pnamesortcol' + (this.sortCol === 'name' ? ' cur' : '') + '" data-sort="name">Name</button>';
        buf += '<button class="sortcol typesortcol' + (this.sortCol === 'type' ? ' cur' : '') + '" data-sort="type">Types</button>';
        buf += '<button class="sortcol abilitysortcol' + (this.sortCol === 'ability' ? ' cur' : '') + '" data-sort="ability">Abilities</button>';
        buf += '<button class="sortcol statsortcol' + (this.sortCol === 'hp' ? ' cur' : '') + '" data-sort="hp">HP</button>';
        buf += '<button class="sortcol statsortcol' + (this.sortCol === 'atk' ? ' cur' : '') + '" data-sort="atk">Atk</button>';
        buf += '<button class="sortcol statsortcol' + (this.sortCol === 'def' ? ' cur' : '') + '" data-sort="def">Def</button>';
        buf += '<button class="sortcol statsortcol' + (this.sortCol === 'spa' ? ' cur' : '') + '" data-sort="spa">SpA</button>';
        buf += '<button class="sortcol statsortcol' + (this.sortCol === 'spd' ? ' cur' : '') + '" data-sort="spd">SpD</button>';
        buf += '<button class="sortcol statsortcol' + (this.sortCol === 'spe' ? ' cur' : '') + '" data-sort="spe">Spe</button>';
        buf += '<button class="sortcol statsortcol' + (this.sortCol === 'bst' ? ' cur' : '') + '" data-sort="bst">BST</button>';
        buf += '</div></li>';
        return buf;
    };
    Search.prototype.renderMoveSortRow = function() {
        var buf = '<li class="result"><div class="sortrow">';
        buf += '<button class="sortcol movenamesortcol' + (this.sortCol === 'name' ? ' cur' : '') + '" data-sort="name">Name</button>';
        buf += '<button class="sortcol movetypesortcol' + (this.sortCol === 'type' ? ' cur' : '') + '" data-sort="type">Type</button>';
        buf += '<button class="sortcol movetypesortcol' + (this.sortCol === 'category' ? ' cur' : '') + '" data-sort="category">Cat</button>';
        buf += '<button class="sortcol powersortcol' + (this.sortCol === 'power' ? ' cur' : '') + '" data-sort="power">Pow</button>';
        buf += '<button class="sortcol accuracysortcol' + (this.sortCol === 'accuracy' ? ' cur' : '') + '" data-sort="accuracy">Acc</button>';
        buf += '<button class="sortcol ppsortcol' + (this.sortCol === 'pp' ? ' cur' : '') + '" data-sort="pp">PP</button>';
        buf += '</div></li>';
        return buf;
    };
    Search.prototype.renderPokemonRow = function(pokemon, matchStart, matchLength, errorMessage, attrs) {
        if (!attrs) attrs = '';
        if (!pokemon) return '<li class="result">Unrecognized pokemon</li>';
        var id = toID(pokemon.name);
        if (Search.urlRoot) attrs += ' href="' + Search.urlRoot + 'pokemon/' + id + '" data-target="push"';
        var buf = '<li class="result"><a' + attrs + ' data-entry="pokemon|' + escapeHTML(pokemon.name) + '">';
        // Dex number with suffix for forms (A, B, C...), shown as 6-A, 10-B, etc. Base shows plain number.
        var numDisplay = pokemon.num;
        if (pokemon.forme && pokemon.name !== pokemon.baseSpecies && window.BattleFormOrder) {
            var baseId = toID(pokemon.baseSpecies || pokemon.name);
            var order = window.BattleFormOrder[baseId];
            if (order) {
                var idx = order.indexOf(pokemon.id);
                if (idx >= 0) {
                    var letter = String.fromCharCode(65 + idx);
                    numDisplay = pokemon.num + '-' + letter;
                }
            }
        }
        buf += '<span class="col numcol">' + numDisplay + "</span> ";
        // icon
        buf += '<span class="col iconcol">';
        buf += '<span style="' + getPokemonIcon(pokemon.name) + '"></span>';
        buf += '</span> ';
        // name
        var name = pokemon.name;
        var tagStart = pokemon.forme ? name.length - pokemon.forme.length - 1 : 0;
        if (tagStart) name = name.substr(0, tagStart);
        if (matchLength) name = name.substr(0, matchStart) + '<b>' + name.substr(matchStart, matchLength) + '</b>' + name.substr(matchStart + matchLength);
        if (tagStart) {
            if (matchLength && matchStart + matchLength > tagStart) {
                if (matchStart < tagStart) {
                    matchLength -= tagStart - matchStart;
                    matchStart = tagStart;
                }
                name += '<small>' + pokemon.name.substr(tagStart, matchStart - tagStart) + '<b>' + pokemon.name.substr(matchStart, matchLength) + '</b>' + pokemon.name.substr(matchStart + matchLength) + '</small>';
            } else name += '<small>' + pokemon.name.substr(tagStart) + '</small>';
        }
        buf += '<span class="col pokemonnamecol">' + name + '</span> ';
        // error
        if (errorMessage) {
            buf += errorMessage + '</a></li>';
            return buf;
        }
        // type
        buf += '<span class="col typecol">';
        var types = pokemon.types;
        for(var i = 0; i < types.length; i++)buf += getTypeIcon(types[i]);
        buf += '</span> ';
        var abilities = pokemon.abilities;
        if (abilities['1']) buf += '<span class="col twoabilitycol">' + abilities['0'] + '<br />' + abilities['1'] + '</span>';
        else buf += '<span class="col abilitycol">' + abilities['0'] + '</span>';
        if (abilities['S']) {
            if (abilities['H']) buf += '<span class="col twoabilitycol">' + (abilities['H'] || '') + '<br />(' + abilities['S'] + ')</span>';
            else buf += '<span class="col abilitycol">(' + abilities['S'] + ')</span>';
        } else if (abilities['H']) buf += '<span class="col abilitycol">' + abilities['H'] + '</span>';
        else buf += '<span class="col abilitycol"></span>';
        // base stats
        var stats = pokemon.baseStats;
        buf += '<span class="col statcol"><em>HP</em><br />' + stats.hp + '</span> ';
        buf += '<span class="col statcol"><em>Atk</em><br />' + stats.atk + '</span> ';
        buf += '<span class="col statcol"><em>Def</em><br />' + stats.def + '</span> ';
        buf += '<span class="col statcol"><em>SpA</em><br />' + stats.spa + '</span> ';
        buf += '<span class="col statcol"><em>SpD</em><br />' + stats.spd + '</span> ';
        buf += '<span class="col statcol"><em>Spe</em><br />' + stats.spe + '</span> ';
        var bst = 0;
        for(i in stats)bst += stats[i];
        buf += '<span class="col bstcol"><em>BST<br />' + bst + '</em></span> ';
        buf += '</a></li>';
        return buf;
    };
    Search.prototype.renderTaggedPokemonRowInner = function(pokemon, tag, errorMessage) {
        var attrs = '';
        if (Search.urlRoot) attrs = ' href="' + Search.urlRoot + 'pokemon/' + toID(pokemon.name) + '" data-target="push"';
        var buf = '<a' + attrs + ' data-entry="pokemon|' + escapeHTML(pokemon.name) + '">';
        // tag
        buf += '<span class="col tagcol shorttagcol">' + tag + '</span> ';
        // icon
        buf += '<span class="col iconcol">';
        buf += '<span style="' + getPokemonIcon(pokemon.name) + '"></span>';
        buf += '</span> ';
        // name
        var name = pokemon.name;
        var tagStart = pokemon.forme ? name.length - pokemon.forme.length - 1 : 0;
        if (tagStart) name = name.substr(0, tagStart) + '<small>' + pokemon.name.substr(tagStart) + '</small>';
        buf += '<span class="col shortpokemonnamecol">' + name + '</span> ';
        // error
        if (errorMessage) {
            buf += errorMessage + '</a></li>';
            return buf;
        }
        // type
        buf += '<span class="col typecol">';
        for(var i = 0; i < pokemon.types.length; i++)buf += getTypeIcon(pokemon.types[i]);
        buf += '</span> ';
        // abilities
        buf += '<span style="float:left;min-height:26px">';
        if (pokemon.abilities['1']) buf += '<span class="col twoabilitycol">';
        else buf += '<span class="col abilitycol">';
        for(var i in pokemon.abilities){
            var ability = pokemon.abilities[i];
            if (!ability) continue;
            if (i === '1') buf += '<br />';
            if (i === 'H') ability = '</span><span class="col abilitycol"><em>' + pokemon.abilities[i] + '</em>';
            buf += ability;
        }
        if (!pokemon.abilities['H']) buf += '</span><span class="col abilitycol">';
        buf += '</span>';
        buf += '</span>';
        // base stats
        buf += '<span style="float:left;min-height:26px">';
        buf += '<span class="col statcol"><em>HP</em><br />' + pokemon.baseStats.hp + '</span> ';
        buf += '<span class="col statcol"><em>Atk</em><br />' + pokemon.baseStats.atk + '</span> ';
        buf += '<span class="col statcol"><em>Def</em><br />' + pokemon.baseStats.def + '</span> ';
        buf += '<span class="col statcol"><em>SpA</em><br />' + pokemon.baseStats.spa + '</span> ';
        buf += '<span class="col statcol"><em>SpD</em><br />' + pokemon.baseStats.spd + '</span> ';
        buf += '<span class="col statcol"><em>Spe</em><br />' + pokemon.baseStats.spe + '</span> ';
        var bst = 0;
        for(i in pokemon.baseStats)bst += pokemon.baseStats[i];
        buf += '<span class="col bstcol"><em>BST<br />' + bst + '</em></span> ';
        buf += '</span>';
        buf += '</a>';
        return buf;
    };
    Search.prototype.renderItemRow = function(item, matchStart, matchLength, errorMessage, attrs) {
        if (!attrs) attrs = '';
        if (!item) return '<li class="result">Unrecognized item</li>';
        var id = toID(item.name);
        if (Search.urlRoot) attrs += ' href="' + Search.urlRoot + 'items/' + id + '" data-target="push"';
        var buf = '<li class="result"><a' + attrs + ' data-entry="item|' + escapeHTML(item.name) + '">';
        // icon
        buf += '<span class="col itemiconcol">';
        buf += '<span style="' + getItemIcon(item) + '"></span>';
        buf += '</span> ';
        // name
        var name = item.name;
        if (matchLength) name = name.substr(0, matchStart) + '<b>' + name.substr(matchStart, matchLength) + '</b>' + name.substr(matchStart + matchLength);
        buf += '<span class="col namecol">' + name + '</span> ';
        // error
        if (errorMessage) {
            buf += errorMessage + '</a></li>';
            return buf;
        }
        // desc
        buf += '<span class="col itemdesccol">' + escapeHTML(item.shortDesc || item.desc) + '</span> ';
        buf += '</a></li>';
        return buf;
    };
    Search.prototype.renderAbilityRow = function(ability, matchStart, matchLength, errorMessage, attrs) {
        if (!attrs) attrs = '';
        if (!ability) return '<li class="result">Unrecognized ability</li>';
        var id = toID(ability.name);
        if (Search.urlRoot) attrs += ' href="' + Search.urlRoot + 'abilities/' + id + '" data-target="push"';
        var buf = '<li class="result"><a' + attrs + ' data-entry="ability|' + escapeHTML(ability.name) + '">';
        // Count how many Pokémon have this ability
        var count = 0;
        for(var pokeId in BattlePokedex){
            var pokemon = BattlePokedex[pokeId];
            if (pokemon.abilities) {
                for(var slot in pokemon.abilities)if (toID(pokemon.abilities[slot]) === id) {
                    count++;
                    break; // Only count each Pokémon once
                }
            }
        }
        // name with count
        var name = ability.name;
        if (matchLength) name = name.substr(0, matchStart) + '<b>' + name.substr(matchStart, matchLength) + '</b>' + name.substr(matchStart + matchLength);
        buf += '<span class="col namecol"><small style="color:#888">(' + count + ')</small> ' + name + '</span> ';
        // error
        if (errorMessage) {
            buf += errorMessage + '</a></li>';
            return buf;
        }
        buf += '<span class="col abilitydesccol">' + escapeHTML(ability.shortDesc || ability.desc) + '</span> ';
        buf += '</a></li>';
        return buf;
    };
    Search.prototype.renderMoveRow = function(move, matchStart, matchLength, errorMessage, attrs) {
        if (!attrs) attrs = '';
        if (!move) return '<li class="result">Unrecognized move</li>';
        var id = toID(move.name);
        if (Search.urlRoot) attrs += ' href="' + Search.urlRoot + 'moves/' + id + '" data-target="push"';
        var buf = '<li class="result"><a' + attrs + ' data-entry="move|' + escapeHTML(move.name) + '">';
        // name
        var name = move.name;
        var tagStart = name.substr(0, 12) === 'Hidden Power' ? 12 : 0;
        if (tagStart) name = name.substr(0, tagStart);
        if (matchLength) name = name.substr(0, matchStart) + '<b>' + name.substr(matchStart, matchLength) + '</b>' + name.substr(matchStart + matchLength);
        if (tagStart) {
            if (matchLength && matchStart + matchLength > tagStart) {
                if (matchStart < tagStart) {
                    matchLength -= tagStart - matchStart;
                    matchStart = tagStart;
                }
                name += '<small>' + move.name.substr(tagStart, matchStart - tagStart) + '<b>' + move.name.substr(matchStart, matchLength) + '</b>' + move.name.substr(matchStart + matchLength) + '</small>';
            } else name += '<small>' + move.name.substr(tagStart) + '</small>';
        }
        buf += '<span class="col movenamecol">' + name + '</span> ';
        // error
        if (errorMessage) {
            buf += errorMessage + '</a></li>';
            return buf;
        }
        // type
        buf += '<span class="col typecol">';
        buf += getTypeIcon(move.type);
        buf += getCategoryIcon(move.category);
        buf += '</span> ';
        // power, accuracy, pp
        var pp = move.pp === 1 || move.noPPBoosts ? move.pp : move.pp * 8 / 5;
        buf += '<span class="col labelcol">' + (move.category !== 'Status' ? '<em>Power</em><br />' + (move.basePower || '&mdash;') : '') + '</span> ';
        buf += '<span class="col widelabelcol"><em>Accuracy</em><br />' + (move.accuracy && move.accuracy !== true ? move.accuracy + '%' : '&mdash;') + '</span> ';
        buf += '<span class="col pplabelcol"><em>PP</em><br />' + pp + '</span> ';
        // desc
        buf += '<span class="col movedesccol">' + escapeHTML(move.shortDesc || move.desc) + '</span> ';
        buf += '</a></li>';
        return buf;
    };
    Search.prototype.renderMoveRowInner = function(move, errorMessage) {
        var attrs = '';
        if (Search.urlRoot) attrs = ' href="' + Search.urlRoot + 'moves/' + toID(move.name) + '" data-target="push"';
        var buf = '<a' + attrs + ' data-entry="move|' + escapeHTML(move.name) + '">';
        // name
        var name = move.name;
        var tagStart = name.substr(0, 12) === 'Hidden Power' ? 12 : 0;
        if (tagStart) name = name.substr(0, tagStart) + '<small>' + move.name.substr(tagStart) + '</small>';
        buf += '<span class="col movenamecol">' + name + '</span> ';
        // error
        if (errorMessage) {
            buf += errorMessage + '</a></li>';
            return buf;
        }
        // type
        buf += '<span class="col typecol">';
        buf += getTypeIcon(move.type);
        buf += getCategoryIcon(move.category);
        buf += '</span> ';
        // power, accuracy, pp
        var pp = move.pp === 1 || move.noPPBoosts ? move.pp : move.pp * 8 / 5;
        buf += '<span class="col labelcol">' + (move.category !== 'Status' ? '<em>Power</em><br />' + (move.basePower || '&mdash;') : '') + '</span> ';
        buf += '<span class="col widelabelcol"><em>Accuracy</em><br />' + (move.accuracy && move.accuracy !== true ? move.accuracy + '%' : '&mdash;') + '</span> ';
        buf += '<span class="col pplabelcol"><em>PP</em><br />' + pp + '</span> ';
        // desc
        buf += '<span class="col movedesccol">' + escapeHTML(move.shortDesc || move.desc) + '</span> ';
        buf += '</a>';
        return buf;
    };
    Search.prototype.renderTaggedMoveRow = function(move, tag, errorMessage) {
        var attrs = '';
        if (Search.urlRoot) attrs = ' href="' + Search.urlRoot + 'moves/' + toID(move.name) + '" data-target="push"';
        var buf = '<li class="result"><a' + attrs + ' data-entry="move|' + escapeHTML(move.name) + '">';
        // tag
        buf += '<span class="col tagcol">' + tag + '</span> ';
        // name
        var name = move.name;
        if (name.substr(0, 12) === 'Hidden Power') name = 'Hidden Power';
        buf += '<span class="col shortmovenamecol">' + name + '</span> ';
        // error
        if (errorMessage) {
            buf += errorMessage + '</a></li>';
            return buf;
        }
        // type
        buf += '<span class="col typecol">';
        buf += getTypeIcon(move.type);
        buf += getCategoryIcon(move.category);
        buf += '</span> ';
        // power, accuracy, pp
        buf += '<span class="col labelcol">' + (move.category !== 'Status' ? '<em>Power</em><br />' + (move.basePower || '&mdash;') : '') + '</span> ';
        buf += '<span class="col widelabelcol"><em>Accuracy</em><br />' + (move.accuracy && move.accuracy !== true ? move.accuracy + '%' : '&mdash;') + '</span> ';
        buf += '<span class="col pplabelcol"><em>PP</em><br />' + (move.noPPBoosts ? move.pp : move.pp * 8 / 5) + '</span> ';
        // desc
        buf += '<span class="col movedesccol">' + escapeHTML(move.shortDesc || move.desc) + '</span> ';
        buf += '</a></li>';
        return buf;
    };
    Search.prototype.renderTypeRow = function(type, matchStart, matchLength, errorMessage) {
        var attrs = '';
        if (Search.urlRoot) attrs = ' href="' + Search.urlRoot + 'types/' + toID(type.name) + '" data-target="push"';
        var buf = '<li class="result"><a' + attrs + ' data-entry="type|' + escapeHTML(type.name) + '">';
        // name
        var name = type.name;
        if (matchLength) name = name.substr(0, matchStart) + '<b>' + name.substr(matchStart, matchLength) + '</b>' + name.substr(matchStart + matchLength);
        buf += '<span class="col namecol">' + name + '</span> ';
        // type
        buf += '<span class="col typecol">';
        buf += getTypeIcon(type.name);
        buf += '</span> ';
        // error
        if (errorMessage) {
            buf += errorMessage + '</a></li>';
            return buf;
        }
        buf += '</a></li>';
        return buf;
    };
    Search.prototype.renderCategoryRow = function(category, matchStart, matchLength, errorMessage) {
        var attrs = '';
        if (Search.urlRoot) attrs = ' href="' + Search.urlRoot + 'categories/' + category.id + '" data-target="push"';
        var buf = '<li class="result"><a' + attrs + ' data-entry="category|' + escapeHTML(category.name) + '">';
        // name
        var name = category.name;
        if (matchLength) name = name.substr(0, matchStart) + '<b>' + name.substr(matchStart, matchLength) + '</b>' + name.substr(matchStart + matchLength);
        buf += '<span class="col namecol">' + name + '</span> ';
        // category
        buf += '<span class="col typecol">' + getCategoryIcon(category.name) + '</span> ';
        // error
        if (errorMessage) {
            buf += errorMessage + '</a></li>';
            return buf;
        }
        buf += '</a></li>';
        return buf;
    };
    Search.prototype.renderArticleRow = function(article, matchStart, matchLength, errorMessage) {
        var attrs = '';
        if (Search.urlRoot) attrs = ' href="' + Search.urlRoot + 'articles/' + article.id + '" data-target="push"';
        var isSearchType = article.id === 'pokemon' || article.id === 'moves';
        if (isSearchType) attrs = ' href="' + article.id + '/" data-target="replace"';
        var buf = '<li class="result"><a' + attrs + ' data-entry="article|' + escapeHTML(article.name) + '">';
        // name
        var name = article.name;
        if (matchLength) name = name.substr(0, matchStart) + '<b>' + name.substr(matchStart, matchLength) + '</b>' + name.substr(matchStart + matchLength);
        buf += '<span class="col namecol">' + name + '</span> ';
        // article
        if (isSearchType) buf += '<span class="col movedesccol">(search type)</span> ';
        else buf += '<span class="col movedesccol">(article)</span> ';
        // error
        if (errorMessage) {
            buf += errorMessage + '</a></li>';
            return buf;
        }
        buf += '</a></li>';
        return buf;
    };
    Search.prototype.renderEggGroupRow = function(egggroup, matchStart, matchLength, errorMessage) {
        var attrs = '';
        if (Search.urlRoot) attrs = ' href="' + Search.urlRoot + 'egggroups/' + toID(egggroup.name) + '" data-target="push"';
        var buf = '<li class="result"><a' + attrs + ' data-entry="egggroup|' + escapeHTML(egggroup.name) + '">';
        // name
        var name = egggroup.name;
        if (matchLength) name = name.substr(0, matchStart) + '<b>' + name.substr(matchStart, matchLength) + '</b>' + name.substr(matchStart + matchLength);
        buf += '<span class="col namecol">' + name + '</span> ';
        // error
        if (errorMessage) {
            buf += errorMessage + '</a></li>';
            return buf;
        }
        buf += '</a></li>';
        return buf;
    };
    Search.prototype.renderTierRow = function(tier, matchStart, matchLength, errorMessage) {
        var attrs = '';
        if (Search.urlRoot) attrs = ' href="' + Search.urlRoot + 'tiers/' + toID(tier.name) + '" data-target="push"';
        var buf = '<li class="result"><a' + attrs + ' data-entry="tier|' + escapeHTML(tier.name) + '">';
        // name
        var name = tier.name;
        if (matchLength) name = name.substr(0, matchStart) + '<b>' + name.substr(matchStart, matchLength) + '</b>' + name.substr(matchStart + matchLength);
        buf += '<span class="col namecol">' + name + '</span> ';
        // error
        if (errorMessage) {
            buf += errorMessage + '</a></li>';
            return buf;
        }
        buf += '</a></li>';
        return buf;
    };
    Search.gen = 9;
    Search.renderRow = Search.prototype.renderRow;
    Search.renderPokemonRow = Search.prototype.renderPokemonRow;
    Search.renderTaggedPokemonRowInner = Search.prototype.renderTaggedPokemonRowInner;
    Search.renderItemRow = Search.prototype.renderItemRow;
    Search.renderAbilityRow = Search.prototype.renderAbilityRow;
    Search.renderMoveRow = Search.prototype.renderMoveRow;
    Search.renderMoveRowInner = Search.prototype.renderMoveRowInner;
    Search.renderTaggedMoveRow = Search.prototype.renderTaggedMoveRow;
    Search.renderTypeRow = Search.prototype.renderTypeRow;
    Search.renderCategoryRow = Search.prototype.renderCategoryRow;
    Search.renderEggGroupRow = Search.prototype.renderEggGroupRow;
    Search.renderTierRow = Search.prototype.renderTierRow;
    exports.BattleSearch = Search;
})(window, jQuery);

},{}]},["iJJzK","a9pVX"], "a9pVX", "parcelRequire6a64", {})

//# sourceMappingURL=Binary-Star-Pokedex.a4b1d397.js.map
