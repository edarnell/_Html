import puppeteer from 'puppeteer'
import {
    url, setPage, setDebug, scp, rm, waitForFile, waitSel, sleep,
    uc1, tt, hover, token, unsub, logout, login, debug, name
} from './utils.mjs'

let browser, page
beforeAll(async () => {
    browser = await puppeteer.launch({ headless: "new" })
    page = await browser.newPage()
    setPage(page)
    setDebug(false)
    await page.evaluateOnNewDocument(() => {
        // make anti-spam and background image predictable
        Math.random = () => 0.5
        window._test = true
    })
})
afterAll(async () => {
    await jest.restoreAllMocks()
    await browser.close()
})

describe('LoggedOut', () => {
    //beforeEach(async () => await page.goto('about:blank'))
    afterEach(async () => setDebug(false, true))
    test('Home', async () => {
        await page.goto(url)
        const head = await page.$eval('head', el => el.outerHTML)
        const body = await page.$eval('body', el => el.outerHTML)
        const css = await page.$$eval('style', styles => styles.map(s => s.textContent).join('\n'))
        
        await scp('head.html', head)
        await scp('head.css', css)
        await scp('body.html', `<link rel="stylesheet" href="head.css">${body}`)
    })
})
export {page, browser}
