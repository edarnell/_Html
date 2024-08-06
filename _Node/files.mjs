const debug = console.log.bind(console), error = console.error.bind(console)
import fs from 'fs'
import { f, fz, save, zip, ts_s } from './zip.mjs'
import log4js from "log4js"
// aims to be a single source of truth for all data
const d = {
    config: f('config.json', true).data,
    manifest: f('../public/manifest.json', true).data,
    mail: fs.readFileSync('../html/mail.html').toString()
}
log4js.configure(d.config.log4js)
const log = d.log = log4js.getLogger()

function load(reload) {
    if (d.fns && !reset) return d
    reload ? log.info({ reload: version }) : log.info({ load: version })
    d.fns = {}
    return d
}

export { load, saveF, version, d, log, rmV }
