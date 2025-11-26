import { execSync } from "child_process";
import { argv } from "process";
import config from "../data/config.json"
import { cpSync, existsSync } from "fs";

let dest = argv[2];

// Let Parcel handle creating and clearing the dist folder
execSync(`npx parcel build --dist-dir ${dest} --public-url ${config.baseurl} ./index.html`)

// Copy images after Parcel is done
cpSync("images", `./${dest}/images`, {recursive: true})

// Create 404.html for GitHub Pages SPA routing
if (existsSync(`./${dest}/index.html`)) {
  cpSync(`./${dest}/index.html`, `./${dest}/404.html`)
}
