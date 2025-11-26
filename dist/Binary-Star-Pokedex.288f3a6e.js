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
})({"dNbck":[function(require,module,exports,__globalThis) {
var global = arguments[3];
var HMR_HOST = null;
var HMR_PORT = null;
var HMR_SERVER_PORT = 51128;
var HMR_SECURE = false;
var HMR_ENV_HASH = "439701173a9199ea";
var HMR_USE_SSE = false;
module.bundle.HMR_BUNDLE_ID = "39132bd1288f3a6e";
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

},{}],"LGavx":[function(require,module,exports,__globalThis) {
/*
 * Panels 0.1
 */ // ES-5 15.3.4.5
// http://es5.github.com/#x15.3.4.5
if (!Function.prototype.bind) {
    var slice = Array.prototype.slice;
    Function.prototype.bind = function bind(that) {
        var target = this;
        if (typeof target != "function") throw new TypeError("Function.prototype.bind called on incompatible " + target);
        var args1 = slice.call(arguments, 1); // for normal call
        var bound = function() {
            if (this instanceof bound) {
                var F = function() {};
                F.prototype = target.prototype;
                var self = new F;
                var result = target.apply(self, args1.concat(slice.call(arguments)));
                if (Object(result) === result) return result;
                return self;
            } else return target.apply(that, args1.concat(slice.call(arguments)));
        };
        return bound;
    };
}
(function() {
    'use strict';
    var root = this;
    var Panels = root.Panels = {};
    var $ = root.jQuery || root.Zepto || root.ender;
    // we extend Backbone.history a bit
    Backbone.history.pause = function() {
        if (this.paused || !Backbone.History.started) return false;
        this.paused = true;
        Backbone.History.started = false;
        this.checkUrlBackup = this.checkUrl;
        this.checkUrl = function() {};
        return true;
    };
    Backbone.history.resume = function() {
        if (!this.paused) return false;
        this.checkUrl = this.checkUrlBackup;
        delete this.checkUrlBackup;
        Backbone.History.started = true;
        delete this.paused;
        return true;
    };
    Panels.App = Backbone.Router.extend({
        constructor: function(options) {
            if (!options) options = {};
            if (options.root) this.root = options.root;
            if ((location.search || '').substr(0, 4) === '?_ga' && window.history) history.replaceState(null, null, '/');
            for(var i in this.states)this.routePanel(i, this.states[i]);
            //this.routePanel('*path', 'Panels.StaticPanel');
            var initialize = this.initialize;
            this.initialize = function() {};
            Backbone.Router.prototype.constructor.apply(this, arguments);
            // constructor
            this.panels = [];
            this.popups = [];
            initialize.apply(this, arguments);
            Backbone.history.start({
                root: this.root,
                pushState: true,
                hashChange: false
            });
            this.fragment = Backbone.history.fragment;
            $(window).resize((function() {
                this.resize();
            }).bind(this));
        },
        root: '/',
        fragment: '',
        states: {},
        panels: null,
        i: 0,
        j: 0,
        topbarView: null,
        topbar: null,
        topbarHeight: 0,
        goLeftWidth: 35,
        goRightWidth: 35,
        goLeftRightDelay: 300,
        goLeftWidthOffset: 0,
        goRightWidthOffset: 0,
        backButtonPrefix: '',
        // routing functions
        go: function(fragment1, loc, replace, source, instant) {
            if (fragment1 && fragment1.substr(0, this.root.length) === this.root) fragment1 = fragment1.substr(this.root.length);
            // no matter what, if the panel exists, we're going straight to it
            var i = this.getFragmentIndex(fragment1);
            if (i >= 0) {
                if (i >= this.j && i <= this.i) this.focusPanel(i, instant, true); // already in view; maximize it
                else this.scrollIntoView(i, instant);
                this.updateURL();
                return;
            }
            if (typeof loc !== 'number') {
                loc = this.panels.indexOf(loc);
                if (loc < 0) loc = null;
                else if (!replace) loc++;
            }
            this.goLoc = loc;
            this.goLocReplace = replace;
            this.goLocSource = source;
            this.goInstant = instant;
            //this.navigate(fragment, {trigger: true});
            Backbone.history.loadUrl(fragment1);
        },
        getPanelIndex: function(panel) {
            for(var i = this.panels.length - 1; i >= 0; i--){
                if (this.panels[i] === panel) return i;
            }
            return -1;
        },
        getFragmentIndex: function(fragment1) {
            for(var i = this.panels.length - 1; i >= 0; i--){
                if (this.panels[i] && this.panels[i].fragment === fragment1) return i;
            }
            return -1;
        },
        slicePanelLeft: function() {
            while(this.j){
                var panel = this.panels.shift();
                panel.remove();
                this.j--;
            }
            this.i = this.j;
        },
        navigatePanel: function(name1, fragment1, args1) {
            if (!this.panels.length) {
                this.initializePanels(name1, fragment1, args1);
                return;
            }
            var isInternal = 'goLoc' in this;
            var loc = this.goLoc;
            var instant = this.goInstant;
            delete this.goLoc;
            delete this.goInstant;
            var i = this.getFragmentIndex(fragment1);
            if (i >= 0) {
                this.focusPanel(i, instant);
                this.updateURL(!isInternal);
                return;
            }
            if (loc === undefined) loc = this.panels.length - 1;
            var left = false;
            if (loc < 0) {
                // insert leftmost
                var $el = $('<div class="pfx-panel"></div>');
                $el.insertBefore(this.panels[0].el);
                this.panels.unshift(null);
                this.i++;
                loc = 0;
            } else {
                // insert at loc
                var $el = $('<div class="pfx-panel"></div>');
                $el.insertAfter(this.lastPanel().el);
                while(this.panels.length > loc){
                    var panel = this.panels.pop();
                    left = panel.left;
                    panel.remove();
                }
                this.panels.push(null);
            }
            this.renderPanel(loc, name1, {
                el: $el[0],
                fragment: fragment1,
                args: args1,
                source: this.goLocSource,
                sourcePanel: this.panels[loc - 1]
            });
            if (!loc) {
                var leftPanel1 = this.panels[loc];
                var rightPanel1 = this.panels[loc + 1];
                if (rightPanel1) leftPanel1.whenLoaded(function() {
                    var source = leftPanel1.$('a[href="' + this.root + rightPanel1.fragment + '"]');
                    // console.log('sources: a[href="'+this.root+rightPanel.fragment+'"] ('+source.length+')');
                    if (!source.length) source = null;
                    rightPanel1.setSource(source, leftPanel1);
                });
            }
            if (left !== false) {
                if (this.i > loc) this.i = loc;
                if (this.i == loc) this.panels[loc].moveTo([
                    left,
                    'auto',
                    0
                ], {}, true);
                if (left) this.panels[loc].targetLeft = left;
            }
            this.scrollIntoView(loc, instant);
            this.updateURL(!isInternal);
        },
        updateURL: function(noPush) {
            var fragment1 = this.panels[this.i].fragment;
            if (fragment1 === this.fragment) return;
            this.fragment = fragment1;
            if (root.ga) ga('send', 'pageview', Backbone.history.root + fragment1);
            if (noPush) return;
            // console.log('URL update: '+fragment);
            // loadUrl updates the fragment, which prevents us from doing actual fragment manipulation
            Backbone.history.fragment = '??forceupdate';
            Backbone.history.navigate(fragment1);
        },
        slicePanel: function(panel) {
            if (!this.panels.length) {
                this.initializePanels(name, fragment, args);
                return;
            }
            var loc = this.getPanelIndex(panel);
            if (loc < 0) return;
            delete this.goLoc;
            if (this.i > loc) this.i = loc;
            if (this.j > loc) this.j = loc;
            while(this.panels.length > loc + 1){
                var panel = this.panels.pop();
                panel.remove();
            }
            this.scrollIntoView(loc, true);
            this.updateURL();
        },
        setPanelSource: function() {
            var source = leftPanel.$('a[href="' + this.root + rightPanel.fragment + '"]');
            // console.log('sources: a[href="'+this.root+rightPanel.fragment+'"] ('+source.length+')');
            if (!source.length) source = null;
            rightPanel.setSource(source, leftPanel);
        },
        resize: function() {
            this.calculateLayout();
            this.commitLayout(true);
        },
        focusPanel: function(index, instant, limit1) {
            // scroll so that panel at index is rightmost
            instant = !this.calculateLayout(index, limit1) || instant;
            this.commitLayout(instant);
        },
        scrollIntoView: function(index, instant) {
            // scroll so that panel at index is in view
            if (index >= this.i) this.focusPanel(index, instant);
            else {
                var i = this.i + 1;
                do {
                    i--;
                    this.calculateLayout(i);
                }while (this.targetJ > index && i > 0);
                this.commitLayout(instant);
            }
        },
        routePanel: function(route, name1) {
            Backbone.history || (Backbone.history = new Backbone.History);
            if (!_.isRegExp(route)) route = this._routeToRegExp(route);
            Backbone.history.route(route, _.bind(function(fragment1) {
                this.midRouting = true;
                var args1 = this._extractParameters(route, fragment1);
                this.navigatePanel.call(this, name1, fragment1, args1);
                this.trigger.apply(this, [
                    'route:' + name1
                ].concat(args1));
                Backbone.history.trigger('route', this, name1, args1);
                this.midRouting = false;
            }, this));
            return this;
        },
        lastPanel: function() {
            return this.panels[this.panels.length - 1];
        },
        reloadPanels: function() {
            for(var i = 0, len = this.panels.length; i < len; i++)this.panels[i].reload();
        },
        // popups
        popups: null,
        addPopup: function(type, options) {
            if (!options) options = {};
            type = this.getPanelType(type);
            var bgElem = $('<div class="pfx-popup-bg"></div>');
            bgElem.insertAfter(this.lastPanel().el);
            options.bgElem = bgElem;
            bgElem.on('click', this.closePopup.bind(this));
            var elem = $('<div class="pfx-popup"></div>');
            elem.insertAfter(bgElem);
            options.el = elem;
            if (options.source) {
                // attach to a specific element
                var style = {
                    position: 'absolute'
                };
                var source = $(options.source);
                var sourceOffset = source.offset();
                var sourceY1 = sourceOffset.top;
                var sourceY2 = sourceY1 + source.outerHeight();
                var viewportY1 = $(window).scrollTop();
                var viewportY2 = viewportY1 + $(window).height();
                if (sourceY1 - viewportY1 > viewportY2 - sourceY2) // more room on top
                style.bottom = $(document).height() - sourceY1;
                else style.top = sourceY2;
                var sourceX1 = sourceOffset.left;
                var sourceX2 = sourceX1 + source.outerWidth();
                var viewportX1 = $(window).scrollLeft();
                var viewportX2 = viewportX1 + $(window).width();
                if (sourceX1 - viewportX1 > viewportX2 - sourceX2) // more room to the left
                style.right = $(document).width() - sourceX2;
                else style.left = sourceX1;
                elem.css(style);
            }
            options.app = this;
            this.popups.push(new type(options));
        },
        closePopup: function() {
            if (!this.popups.length) return;
            var popup = this.popups.pop();
            popup.remove();
        },
        // panel animation
        getPanelType: function(name1) {
            if (typeof name1 === 'string') // var nameSplit = name.split('.');
            // name = window;
            // for (var i=0, len=nameSplit.length; i<len; i++) {
            // 	name = name[nameSplit[i]];
            // }
            return eval(name1);
            return name1;
        },
        /**
		 * Initialize the entire app: Set up all the views.
		 */ renderPanel: function(index, panelType, options, first) {
            if (first) $(options.el).css({
                position: 'absolute',
                top: this.topbarHeight,
                left: 0,
                right: 0,
                bottom: 0,
                width: 'auto',
                height: 'auto',
                '-webkit-overflow-scrolling': 'touch',
                'overflow-scrolling': 'touch',
                overflow: 'auto'
            });
            else $(options.el).css({
                position: 'absolute',
                top: this.topbarHeight,
                left: 0,
                right: 'auto',
                bottom: 0,
                width: 'auto',
                height: 'auto',
                '-webkit-overflow-scrolling': 'touch',
                'overflow-scrolling': 'touch',
                overflow: 'auto'
            });
            panelType = this.getPanelType(panelType);
            options.app = this;
            return this.panels[index] = new panelType(options);
        },
        /**
		 * Initialize the entire app: Set up all the views.
		 */ initializePanels: function(name1, fragment1, args1) {
            // global
            $('body').css({
                overflow: 'hidden'
            });
            // topbar
            if (!this.topbarView) this.topbarView = Panels.Topbar;
            this.topbarView = this.getPanelType(this.topbarView);
            var topbarElem = $('.pfx-topbar');
            if (topbarElem.length) {
                topbarElem.css({
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0
                });
                this.topbar = new this.topbarView({
                    el: topbarElem[0],
                    app: this
                });
                this.topbarHeight = this.topbar.height;
            }
            var $panels = $('.pfx-panel');
            this.panels = new Array($panels.length);
            var first = true;
            // iterate right-to-left
            for(var i = $panels.length - 1; i >= 0; i--){
                var el = $panels[i];
                var panel = this.renderPanel(i, name1, {
                    el: el,
                    fragment: fragment1,
                    args: args1,
                    loaded: true
                }, first);
                if (i) {
                    name1 = panel.parentName;
                    fragment1 = panel.parentFragment;
                    args1 = panel.parentArgs;
                }
                first = false;
            }
            this.i = this.panels.length - 1;
            this.calculateLayout(this.i);
            this.commitLayout(true);
        },
        calculateLayout: function(loc, limit1) {
            if (loc === undefined) loc = this.i;
            this.targetI = loc;
            var panels = this.panels;
            var maxWidth = $('body').width();
            var curWidth = 0;
            var curBuffer = 0;
            var numPanels = 0;
            var hasSidebar = false;
            var left = 0;
            var layoutChanged = !!(this.i !== loc);
            this.targetWidth = maxWidth;
            var goRightWidth = this.goRightWidth || 0;
            var goLeftWidth = this.goLeftWidth || 0;
            if (loc >= this.panels.length - 1) goRightWidth = 0;
            maxWidth -= goRightWidth;
            // find out how many panels there are
            do {
                var width = panels[loc].minWidth;
                var buffer = panels[loc].maxWidth - width;
                if (numPanels && curWidth + width > maxWidth - (loc ? goLeftWidth : 0)) break;
                curWidth += width;
                curBuffer += buffer;
                numPanels++;
                loc--;
            }while (!limit1 && panels[loc]);
            if (!limit1 && numPanels <= 1 && panels[loc] && panels[loc].sidebarWidth) // no room for more than one full panel, but maybe a sidebar will fit
            {
                if (curWidth + panels[loc].sidebarWidth <= maxWidth - (loc ? goLeftWidth : 0)) {
                    var targetWidth = panels[loc].sidebarWidth + curBuffer;
                    if (panels[loc].targetWidth !== undefined && panels[loc].targetWidth !== targetWidth) layoutChanged = true;
                    panels[loc].targetWidth = targetWidth;
                    curWidth += targetWidth;
                    curBuffer = 0;
                    numPanels++;
                    loc--;
                    hasSidebar = true;
                }
            }
            this.targetJ = loc + 1;
            if (loc + 1 <= 0) goLeftWidth = 0;
            if (loc + 1 == this.targetI) {
                maxWidth += goRightWidth;
                goRightWidth = 0;
                goLeftWidth = 0;
            }
            maxWidth -= goLeftWidth;
            // calculate our buffer ratio
            var maxBuffer = maxWidth - curWidth;
            if (maxBuffer > curBuffer) {
                left = Math.floor((maxBuffer - curBuffer) / 2);
                maxBuffer = curBuffer;
            }
            var bufferRatio = curBuffer ? maxBuffer / curBuffer : 1;
            // calculate gaps
            this.targetRightGap = goRightWidth ? left + goRightWidth : 0;
            this.targetLeftGap = goLeftWidth ? left + goLeftWidth : 0;
            left += goLeftWidth;
            // populate panel layout
            // visible panels
            for(var i = loc + 1, max = this.targetI; i <= max; i++){
                var panel = panels[i];
                if (panel.targetLeft !== undefined && panel.targetLeft !== left) layoutChanged = true;
                panel.targetLeft = left;
                if (hasSidebar && i == loc + 1) ;
                else {
                    var targetWidth = Math.floor(panel.minWidth + bufferRatio * (panel.maxWidth - panel.minWidth));
                    if (panel.targetWidth !== undefined && panel.targetWidth !== targetWidth) layoutChanged = true;
                    panel.targetWidth = targetWidth;
                }
                left += panel.targetWidth;
            }
            return layoutChanged;
        },
        getDestLoc: function(panel, i) {
            if (typeof panel === 'number') {
                i = panel;
                panel = this.panels[i];
            }
            var left = panel.targetLeft;
            var width = panel.targetWidth;
            var right = 'auto';
            if (i == this.targetJ) {
                width += left - this.targetLeftGap;
                left = this.targetLeftGap;
            }
            if (i == this.targetI) {
                right = this.targetRightGap;
                width = 'auto';
            }
            return [
                left,
                width,
                right
            ];
        },
        getPanelWidth: function(panel) {
            if (panel.width === 'auto') return this.targetWidth - panel.left - panel.right;
            return panel.width;
        },
        commitLayout: function(instant) {
            var goingBack = this.targetI < this.i || this.targetI === this.i && this.targetJ < this.j;
            if (goingBack) {
                // <--
                var totalWidth = this.targetWidth - this.targetRightGap;
                for(var i = Math.max(this.j, this.targetI + 1), end = this.i; i <= end; i++){
                    //console.log('going right offscreen: '+i);
                    this.panels[i].moveTo([
                        totalWidth,
                        this.getPanelWidth(this.panels[i]),
                        'auto'
                    ], {
                        hide: true
                    }, instant);
                    totalWidth += this.getPanelWidth(this.panels[i]);
                }
                for(var i = this.targetI, end = this.j; i >= end; i--)//console.log('moving right: '+i);
                this.panels[i].moveTo(this.getDestLoc(i), {
                    leftmost: this.targetJ == i,
                    rightmost: this.targetI == i,
                    time: this.goLeftRightDelay
                }, instant);
                totalWidth = this.targetLeftGap;
                for(var i = Math.min(this.j - 1, this.targetI), end = this.targetJ; i >= end; i--){
                    //console.log('coming from left: '+i);
                    totalWidth -= this.panels[i].targetWidth;
                    this.panels[i].moveTo(this.getDestLoc(i), {
                        leftmost: this.targetJ == i,
                        rightmost: this.targetI == i,
                        startingOffset: totalWidth - this.panels[i].targetLeft,
                        time: this.goLeftRightDelay
                    }, instant);
                }
            } else {
                // -->
                var totalWidth = -this.targetLeftGap;
                for(var i = Math.min(this.i, this.targetJ - 1), end = this.j; i >= end; i--){
                    //console.log('going left offscreen: '+i);
                    totalWidth += this.getPanelWidth(this.panels[i]);
                    this.panels[i].moveTo([
                        -totalWidth,
                        this.getPanelWidth(this.panels[i]),
                        'auto'
                    ], {
                        hide: true
                    }, instant);
                }
                for(var i = this.targetJ, end = this.i; i <= end; i++)//console.log('moving left: '+i);
                this.panels[i].moveTo(this.getDestLoc(i), {
                    leftmost: this.targetJ == i,
                    rightmost: this.targetI == i,
                    time: this.goLeftRightDelay
                }, instant);
                totalWidth = this.targetWidth - this.targetRightGap;
                for(var i = Math.max(this.i + 1, this.targetJ), end = this.targetI; i <= end; i++){
                    //console.log('coming from right: '+i);
                    this.panels[i].moveTo(this.getDestLoc(i), {
                        leftmost: this.targetJ == i,
                        rightmost: this.targetI == i,
                        startingOffset: totalWidth - this.panels[i].targetLeft,
                        time: this.goLeftRightDelay
                    }, instant);
                    totalWidth += this.panels[i].targetWidth;
                }
            }
            this.i = this.targetI;
            this.j = this.targetJ;
            if (this.goLeftRightElem) this.goLeftRightElem.html('');
            else {
                this.goLeftRightElem = $('<div></div>');
                this.goLeftRightElem.insertAfter(this.lastPanel().el);
                this.goLeftRightElem.on('click', 'a', (function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    this.go($(e.currentTarget).attr('href'));
                }).bind(this));
            }
            var buffer = '';
            if (this.targetLeftGap) buffer += '<a class="pfx-go-left" style="width:' + (this.targetLeftGap + this.goLeftWidthOffset) + 'px" href="' + this.root + this.panels[this.j - 1].fragment + '"></a>';
            if (this.targetRightGap) buffer += '<a class="pfx-go-right" style="width:' + (this.targetRightGap + this.goRightWidthOffset) + 'px" href="' + this.root + this.panels[this.i + 1].fragment + '"></a>';
            if (buffer) {
                if (instant) {
                    this.goLeftRightElem.html(buffer);
                    this.goLeftRightElem.show();
                } else {
                    this.goLeftRightElem.hide();
                    this.goLeftRightElem.html(buffer);
                    setTimeout((function() {
                        this.goLeftRightElem.show();
                    }).bind(this), this.goLeftRightDelay);
                }
            }
        }
    });
    var View = Panels.View = Backbone.View;
    var Panel = Panels.Panel = View.extend({
        constructor: function(options) {
            if (!options) options = {};
            this.app = options.app;
            if (!this.events) this.events = {};
            if (!this.events['click a, button']) this.events['click a, button'] = 'handleNavigation';
            if (!this.events['submit form']) this.events['submit form'] = 'handleNavigation';
            if (options.source) this.source = $(options.source);
            if (options.sourcePanel) this.sourcePanel = options.sourcePanel;
            if (options.bgElem) this.bgElem = options.bgElem;
            this.loaded = !!options.loaded;
            this.fragment = options.fragment;
            var args1 = options.args;
            delete options.app;
            delete options.loaded;
            delete options.source;
            delete options.bgElem;
            delete options.fragment;
            delete options.args;
            var initialize = this.initialize;
            this.initialize = function() {};
            View.prototype.constructor.call(this, options);
            // constructor
            if (this.source) {
                this.source.addClass('cur');
                if (this.source[0].tagName.toUpperCase() === 'BUTTON') this.source[0].disabled = true;
            }
            initialize.apply(this, args1);
            if (!this.loaded) this.load();
            else this.whenLoadedQueueFlush();
            this.updateBackButton();
            this.updateContent();
        },
        source: null,
        minWidth: 480,
        maxWidth: 720,
        leftOffset: 0,
        widthOffset: 0,
        rightOffset: 0,
        fragment: '',
        hidden: false,
        setFragment: function(fragment1) {
            this.fragment = fragment1;
            this.app.updateURL();
        },
        moveTo: function(loc, flags, instant) {
            var left = loc[0];
            var width = loc[1];
            var right = loc[2];
            if (!flags) flags = {};
            if (flags.leftmost) this.$('.pfx-backbutton').show();
            else this.$('.pfx-backbutton').hide();
            this.leftmost = flags.leftmost;
            this.rightmost = flags.rightmost;
            this.hidden = !!flags.hide;
            var oldLeft = this.left;
            var oldWidth = this.width;
            var oldRight = this.right;
            this.left = left;
            this.width = width;
            this.right = right;
            if (left !== 'auto') left += this.leftOffset;
            if (width !== 'auto') width += this.widthOffset;
            if (right !== 'auto') right += this.rightOffset;
            if (instant) {
                this.$el.css({
                    display: flags.hide ? 'none' : 'block',
                    left: left,
                    width: width,
                    right: right
                });
                this.$('.pfx-body').css({
                    'margin-left': this.left ? 0 : 'auto',
                    'margin-right': this.right ? 0 : 'auto',
                    'max-width': this.maxWidth
                });
            } else {
                this.show();
                if (left === 'auto') this.$el.css('left', 'auto');
                if (width === 'auto') this.$el.css('width', 'auto');
                if (right === 'auto') this.$el.css('right', 'auto');
                if (flags.startingOffset !== undefined) this.$el.css({
                    left: left === 'auto' ? left : left + flags.startingOffset,
                    width: width,
                    right: right === 'auto' ? right : right - flags.startingOffset
                });
                else if (width !== 'auto' && oldWidth === 'auto') this.$el.css('width', $('body').width() - oldLeft - oldRight + this.widthOffset);
                else if (right !== 'auto' && oldRight === 'auto') this.$el.css('right', $('body').width() - oldLeft - oldWidth + this.rightOffset);
                this.$el.transition({
                    left: left,
                    width: width,
                    right: right
                }, flags.time || 300, function() {
                    if (flags.hide) $(this).css('display', 'none');
                });
                // left/right padding
                var elWidth = this.$el.width();
                var marginLeft = elWidth - this.maxWidth;
                if (marginLeft < 0 || oldLeft && !oldRight) marginLeft = 0;
                else if (!(!oldLeft && oldRight)) marginLeft = Math.floor(marginLeft / 2);
                var marginRight = elWidth - this.maxWidth;
                if (marginRight < 0 || !oldLeft && oldRight) marginRight = 0;
                else if (!(oldLeft && !oldRight)) marginRight = Math.floor(marginRight / 2);
                if (marginLeft && marginRight && this.left && this.right) marginLeft = 0, marginRight = 0;
                var $panelBody = this.$('.pfx-body');
                $panelBody.css({
                    'margin-left': this.left ? marginLeft : 'auto',
                    'margin-right': this.right ? marginRight : 'auto',
                    'max-width': this.maxWidth
                });
                if (this.left && marginLeft) $panelBody.transition({
                    'margin-left': 0
                }, flags.time || 300);
                if (this.right && marginRight) $panelBody.transition({
                    'margin-right': 0
                }, flags.time || 300);
            }
        },
        html: function(content) {
            var panelIndex = content.indexOf('<div class="pfx-panel">');
            if (panelIndex >= 0) {
                content = content.substr(panelIndex + 23);
                content = content.substr(0, content.lastIndexOf('</div>'));
            }
            this.$el.html(content);
            if (this.source && this.isPopup) this.$('.pfx-title').remove();
            else if (this.leftmost) this.$('.pfx-backbutton').show();
            else this.$('.pfx-backbutton').hide();
            this.$('.pfx-body').css({
                'margin-left': this.left ? 0 : 'auto',
                'margin-right': this.right ? 0 : 'auto',
                'max-width': this.maxWidth
            });
            this.updateBackButton();
            this.updateContent();
        },
        updateBackButton: function() {
            if (this.sourcePanel) {
                if (this.sourcePanel.shortTitle) this.$('.pfx-backbutton').html(this.app.backButtonPrefix + this.sourcePanel.shortTitle.replace(/</g, '&lt;'));
                this.$('.pfx-backbutton').attr('href', this.app.root + this.sourcePanel.fragment);
            }
        },
        updateContent: function() {},
        show: function() {
            this.hidden = false;
            this.load();
            this.$el.css('display', 'block');
        },
        hide: function() {
            this.hidden = true;
            this.$el.css('display', 'none');
        },
        load: function() {
            // placeholder loader: does nothing
            this.loaded = true;
            this.whenLoadedQueueFlush();
        },
        whenLoadedQueue: null,
        whenLoaded: function(callback) {
            if (this.loaded === true) callback.call(this);
            else {
                if (!this.whenLoadedQueue) this.whenLoadedQueue = [];
                this.whenLoadedQueue.push(callback);
            }
        },
        whenLoadedQueueFlush: function() {
            if (this.loaded !== true || !this.whenLoadedQueue) return;
            for(var i = 0; i < this.whenLoadedQueue.length; i++)this.whenLoadedQueue[i].call(this);
            this.whenLoadedQueue = null;
        },
        reload: function() {
            this.loaded = false;
            if (!this.hidden) this.load();
        },
        handleNavigation: function(e) {
            if (e.cmdKey || e.metaKey || e.ctrlKey) return;
            var target = $(e.currentTarget);
            var linkTarget = target.data('target');
            var linkAction = target.data('action');
            var linkHref = target.data('href') || target.attr('href') || target.attr('action');
            var formMethod = '';
            if (target[0].tagName.toUpperCase() === 'FORM') {
                formMethod = 'GET';
                if ((target.attr('method') || '').toUpperCase() === 'POST') formMethod = 'POST';
                target.find('button[type=submit]').attr('disabled', 'disabled').text('Loading...');
            }
            // TODO: finish
            if (linkAction) {
                e.preventDefault();
                e.stopImmediatePropagation();
                this[linkAction].call(this, e);
            } else if (linkTarget === 'replace' && formMethod) {
                e.preventDefault();
                e.stopImmediatePropagation();
                var data = target.serialize();
                this.ajax(linkHref, data, formMethod);
            } else if (linkTarget) {
                e.preventDefault();
                e.stopImmediatePropagation();
                switch(linkTarget){
                    case 'back':
                        this.app.go(linkHref, -1);
                        break;
                    case 'push':
                        this.app.go(linkHref, this, false, target);
                        break;
                    case 'replace':
                        this.app.go(linkHref, this, true);
                        break;
                }
            }
        },
        post: function(target, data) {
            return this.ajax(target, data, 'POST');
        },
        get: function(target, data) {
            return this.ajax(target, data);
        },
        ajax: function(target, data, method) {
            if (!target) target = this.app.root + this.fragment;
            return $.ajax(target + '?output=html', {
                type: method || GET,
                dataType: 'text',
                data: data
            }).done((function(response) {
                this.html(response);
            }).bind(this));
        },
        setSource: function(newSource, newSourcePanel) {
            if (this.source) {
                this.source.removeClass('cur');
                if (this.source[0].tagName.toUpperCase() === 'BUTTON') this.source[0].disabled = false;
            }
            this.source = newSource;
            this.sourcePanel = newSourcePanel;
            if (this.source) {
                this.source.addClass('cur');
                if (this.source[0].tagName.toUpperCase() === 'BUTTON') this.source[0].disabled = true;
            }
        },
        remove: function() {
            Backbone.View.prototype.remove.apply(this, arguments);
            if (this.source) {
                this.source.removeClass('cur');
                if (this.source[0].tagName.toUpperCase() === 'BUTTON') this.source[0].disabled = false;
            }
            delete this.sourcePanel;
            if (this.bgElem) this.bgElem.remove();
            this.app = null; // remove possible circular references for GC
        },
        close: function() {},
        url: ''
    });
    Panels.Popup = Panel.extend({
        isPopup: true,
        close: function() {
            this.app.closePopup();
        }
    });
    Panels.Topbar = View.extend({
        constructor: function(options) {
            // init 1
            var initialize = this.initialize;
            this.initialize = function() {};
            View.prototype.constructor.call(this, {
                el: options.el
            });
            this.app = options.app;
            // init 2
            if (!this.height) this.height = this.$el.height();
            initialize.apply(this);
        },
        app: null,
        height: 0
    });
    Panels.StaticPanel = Panel.extend({
        constructor: function() {
            Panel.prototype.constructor.apply(this, arguments);
        },
        load: function() {
            if (this.loaded) return;
            this.loaded = 'loading';
            this.$el.prepend('<p class="pfx-loading"><em>Loading...</em></p>');
            $.get(this.app.root + this.fragment + (this.fragment.indexOf('?') >= 0 ? '&' : '?') + 'output=html').done((function(content) {
                this.html(content);
                this.loaded = true;
                this.whenLoadedQueueFlush();
            }).bind(this));
        }
    });
}).call(window);
/*!
 * jQuery Transit - CSS3 transitions and transformations
 * (c) 2011-2012 Rico Sta. Cruz <rico@ricostacruz.com>
 * MIT Licensed.
 *
 * http://ricostacruz.com/jquery.transit
 * http://github.com/rstacruz/jquery.transit
 */ (function(k) {
    k.transit = {
        version: "0.9.9",
        propertyMap: {
            marginLeft: "margin",
            marginRight: "margin",
            marginBottom: "margin",
            marginTop: "margin",
            paddingLeft: "padding",
            paddingRight: "padding",
            paddingBottom: "padding",
            paddingTop: "padding"
        },
        enabled: true,
        useTransitionEnd: false
    };
    var d = document.createElement("div");
    var q = {};
    function b(v) {
        if (v in d.style) return v;
        var u = [
            "Moz",
            "Webkit",
            "O",
            "ms"
        ];
        var r = v.charAt(0).toUpperCase() + v.substr(1);
        if (v in d.style) return v;
        for(var t = 0; t < u.length; ++t){
            var s = u[t] + r;
            if (s in d.style) return s;
        }
    }
    function e() {
        d.style[q.transform] = "";
        d.style[q.transform] = "rotateY(90deg)";
        return d.style[q.transform] !== "";
    }
    var a = navigator.userAgent.toLowerCase().indexOf("chrome") > -1;
    q.transition = b("transition");
    q.transitionDelay = b("transitionDelay");
    q.transform = b("transform");
    q.transformOrigin = b("transformOrigin");
    q.transform3d = e();
    var i = {
        transition: "transitionEnd",
        MozTransition: "transitionend",
        OTransition: "oTransitionEnd",
        WebkitTransition: "webkitTransitionEnd",
        msTransition: "MSTransitionEnd"
    };
    var f = q.transitionEnd = i[q.transition] || null;
    for(var p in q)if (q.hasOwnProperty(p) && typeof k.support[p] === "undefined") k.support[p] = q[p];
    d = null;
    k.cssEase = {
        _default: "ease",
        "in": "ease-in",
        out: "ease-out",
        "in-out": "ease-in-out",
        snap: "cubic-bezier(0,1,.5,1)",
        easeOutCubic: "cubic-bezier(.215,.61,.355,1)",
        easeInOutCubic: "cubic-bezier(.645,.045,.355,1)",
        easeInCirc: "cubic-bezier(.6,.04,.98,.335)",
        easeOutCirc: "cubic-bezier(.075,.82,.165,1)",
        easeInOutCirc: "cubic-bezier(.785,.135,.15,.86)",
        easeInExpo: "cubic-bezier(.95,.05,.795,.035)",
        easeOutExpo: "cubic-bezier(.19,1,.22,1)",
        easeInOutExpo: "cubic-bezier(1,0,0,1)",
        easeInQuad: "cubic-bezier(.55,.085,.68,.53)",
        easeOutQuad: "cubic-bezier(.25,.46,.45,.94)",
        easeInOutQuad: "cubic-bezier(.455,.03,.515,.955)",
        easeInQuart: "cubic-bezier(.895,.03,.685,.22)",
        easeOutQuart: "cubic-bezier(.165,.84,.44,1)",
        easeInOutQuart: "cubic-bezier(.77,0,.175,1)",
        easeInQuint: "cubic-bezier(.755,.05,.855,.06)",
        easeOutQuint: "cubic-bezier(.23,1,.32,1)",
        easeInOutQuint: "cubic-bezier(.86,0,.07,1)",
        easeInSine: "cubic-bezier(.47,0,.745,.715)",
        easeOutSine: "cubic-bezier(.39,.575,.565,1)",
        easeInOutSine: "cubic-bezier(.445,.05,.55,.95)",
        easeInBack: "cubic-bezier(.6,-.28,.735,.045)",
        easeOutBack: "cubic-bezier(.175, .885,.32,1.275)",
        easeInOutBack: "cubic-bezier(.68,-.55,.265,1.55)"
    };
    k.cssHooks["transit:transform"] = {
        get: function(r) {
            return k(r).data("transform") || new j();
        },
        set: function(s, r) {
            var t = r;
            if (!(t instanceof j)) t = new j(t);
            if (q.transform === "WebkitTransform" && !a) s.style[q.transform] = t.toString(true);
            else s.style[q.transform] = t.toString();
            k(s).data("transform", t);
        }
    };
    k.cssHooks.transform = {
        set: k.cssHooks["transit:transform"].set
    };
    if (k.fn.jquery < "1.8") {
        k.cssHooks.transformOrigin = {
            get: function(r) {
                return r.style[q.transformOrigin];
            },
            set: function(r, s) {
                r.style[q.transformOrigin] = s;
            }
        };
        k.cssHooks.transition = {
            get: function(r) {
                return r.style[q.transition];
            },
            set: function(r, s) {
                r.style[q.transition] = s;
            }
        };
    }
    n("scale");
    n("translate");
    n("rotate");
    n("rotateX");
    n("rotateY");
    n("rotate3d");
    n("perspective");
    n("skewX");
    n("skewY");
    n("x", true);
    n("y", true);
    function j(r) {
        if (typeof r === "string") this.parse(r);
        return this;
    }
    j.prototype = {
        setFromString: function(t, s) {
            var r = typeof s === "string" ? s.split(",") : s.constructor === Array ? s : [
                s
            ];
            r.unshift(t);
            j.prototype.set.apply(this, r);
        },
        set: function(s) {
            var r = Array.prototype.slice.apply(arguments, [
                1
            ]);
            if (this.setter[s]) this.setter[s].apply(this, r);
            else this[s] = r.join(",");
        },
        get: function(r) {
            if (this.getter[r]) return this.getter[r].apply(this);
            else return this[r] || 0;
        },
        setter: {
            rotate: function(r) {
                this.rotate = o(r, "deg");
            },
            rotateX: function(r) {
                this.rotateX = o(r, "deg");
            },
            rotateY: function(r) {
                this.rotateY = o(r, "deg");
            },
            scale: function(r, s) {
                if (s === undefined) s = r;
                this.scale = r + "," + s;
            },
            skewX: function(r) {
                this.skewX = o(r, "deg");
            },
            skewY: function(r) {
                this.skewY = o(r, "deg");
            },
            perspective: function(r) {
                this.perspective = o(r, "px");
            },
            x: function(r) {
                this.set("translate", r, null);
            },
            y: function(r) {
                this.set("translate", null, r);
            },
            translate: function(r, s) {
                if (this._translateX === undefined) this._translateX = 0;
                if (this._translateY === undefined) this._translateY = 0;
                if (r !== null && r !== undefined) this._translateX = o(r, "px");
                if (s !== null && s !== undefined) this._translateY = o(s, "px");
                this.translate = this._translateX + "," + this._translateY;
            }
        },
        getter: {
            x: function() {
                return this._translateX || 0;
            },
            y: function() {
                return this._translateY || 0;
            },
            scale: function() {
                var r = (this.scale || "1,1").split(",");
                if (r[0]) r[0] = parseFloat(r[0]);
                if (r[1]) r[1] = parseFloat(r[1]);
                return r[0] === r[1] ? r[0] : r;
            },
            rotate3d: function() {
                var t = (this.rotate3d || "0,0,0,0deg").split(",");
                for(var r = 0; r <= 3; ++r)if (t[r]) t[r] = parseFloat(t[r]);
                if (t[3]) t[3] = o(t[3], "deg");
                return t;
            }
        },
        parse: function(s) {
            var r = this;
            s.replace(/([a-zA-Z0-9]+)\((.*?)\)/g, function(t, v, u) {
                r.setFromString(v, u);
            });
        },
        toString: function(t) {
            var s = [];
            for(var r in this)if (this.hasOwnProperty(r)) {
                if (!q.transform3d && (r === "rotateX" || r === "rotateY" || r === "perspective" || r === "transformOrigin")) continue;
                if (r[0] !== "_") {
                    if (t && r === "scale") s.push(r + "3d(" + this[r] + ",1)");
                    else if (t && r === "translate") s.push(r + "3d(" + this[r] + ",0)");
                    else s.push(r + "(" + this[r] + ")");
                }
            }
            return s.join(" ");
        }
    };
    function m(s, r, t) {
        if (r === true) s.queue(t);
        else if (r) s.queue(r, t);
        else t();
    }
    function h(s) {
        var r = [];
        k.each(s, function(t) {
            t = k.camelCase(t);
            t = k.transit.propertyMap[t] || k.cssProps[t] || t;
            t = c(t);
            if (k.inArray(t, r) === -1) r.push(t);
        });
        return r;
    }
    function g(s, v, x, r) {
        var t = h(s);
        if (k.cssEase[x]) x = k.cssEase[x];
        var w = "" + l(v) + " " + x;
        if (parseInt(r, 10) > 0) w += " " + l(r);
        var u = [];
        k.each(t, function(z, y) {
            u.push(y + " " + w);
        });
        return u.join(", ");
    }
    k.fn.transition = k.fn.transit = function(z, s, y, C) {
        var D = this;
        var u = 0;
        var w = true;
        if (typeof s === "function") {
            C = s;
            s = undefined;
        }
        if (typeof y === "function") {
            C = y;
            y = undefined;
        }
        if (typeof z.easing !== "undefined") {
            y = z.easing;
            delete z.easing;
        }
        if (typeof z.duration !== "undefined") {
            s = z.duration;
            delete z.duration;
        }
        if (typeof z.complete !== "undefined") {
            C = z.complete;
            delete z.complete;
        }
        if (typeof z.queue !== "undefined") {
            w = z.queue;
            delete z.queue;
        }
        if (typeof z.delay !== "undefined") {
            u = z.delay;
            delete z.delay;
        }
        if (typeof s === "undefined") s = k.fx.speeds._default;
        if (typeof y === "undefined") y = k.cssEase._default;
        s = l(s);
        var E = g(z, s, y, u);
        var B = k.transit.enabled && q.transition;
        var t = B ? parseInt(s, 10) + parseInt(u, 10) : 0;
        if (t === 0) {
            var A = function(F) {
                D.css(z);
                if (C) C.apply(D);
                if (F) F();
            };
            m(D, w, A);
            return D;
        }
        var x = {};
        var r = function(H) {
            var G = false;
            var F = function() {
                if (G) D.unbind(f, F);
                if (t > 0) D.each(function() {
                    this.style[q.transition] = x[this] || null;
                });
                if (typeof C === "function") C.apply(D);
                if (typeof H === "function") H();
            };
            if (t > 0 && f && k.transit.useTransitionEnd) {
                G = true;
                D.bind(f, F);
            } else window.setTimeout(F, t);
            D.each(function() {
                if (t > 0) this.style[q.transition] = E;
                k(this).css(z);
            });
        };
        var v = function(F) {
            this.offsetWidth;
            r(F);
        };
        m(D, w, v);
        return this;
    };
    function n(s, r) {
        if (!r) k.cssNumber[s] = true;
        k.transit.propertyMap[s] = q.transform;
        k.cssHooks[s] = {
            get: function(v) {
                var u = k(v).css("transit:transform");
                return u.get(s);
            },
            set: function(v, w) {
                var u = k(v).css("transit:transform");
                u.setFromString(s, w);
                k(v).css({
                    "transit:transform": u
                });
            }
        };
    }
    function c(r) {
        return r.replace(/([A-Z])/g, function(s) {
            return "-" + s.toLowerCase();
        });
    }
    function o(s, r) {
        if (typeof s === "string" && !s.match(/^[\-0-9\.]+$/)) return s;
        else return "" + s + r;
    }
    function l(s) {
        var r = s;
        if (k.fx.speeds[r]) r = k.fx.speeds[r];
        return o(r, "ms");
    }
    k.transit.getTransitionValue = g;
})(jQuery);
if (!jQuery.support.transition) jQuery.fn.transition = jQuery.fn.animate;

},{}]},["dNbck","LGavx"], "LGavx", "parcelRequire6a64", {})

//# sourceMappingURL=Binary-Star-Pokedex.288f3a6e.js.map
