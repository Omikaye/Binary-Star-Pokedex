import { execSync } from "child_process";
import { argv } from "process";
import config from "../data/config.json"
import { cpSync, mkdirSync, rmSync } from "fs";

let dest = argv[2];

rmSync(`./${dest}`, {recursive: true, force: true})
mkdirSync(`./${dest}`)

for (let folder of ["images"]) {
  cpSync(`${folder}`, `./${dest}/`, {recursive: true})
}

execSync(`npx parcel build --public-url ${config.baseurl} ./index.html`)
cpSync(`./${dest}/index.html`, `./${dest}/404.html`)
