
if (!process.argv[2]) {
    console.log('Usage: node index.js <id>');
    process.exit(1);
}
const q = process.argv[2].split(',')
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
(async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    for (const e of q) {
        await page.goto('https://apps.evozi.com/apk-downloader/?id=' + e);
        await page.click('.btn-info');
        const url = await page.evaluate(async () => {
            var r = null;
            const start = Date.now();
            while (r == null) {
                if (Date.now() - start > 200000) {
                    return null;
                }
                if (document.getElementsByClassName('text-danger')[0]) { // failed
                    return false;
                }
                for (const e of Array.from(document.getElementsByTagName('a'))) {
                    if (e.href.startsWith('https://storage.evozi.com/apk')) {
                        r = e.href;
                        break;
                    }
                }
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            return r;
        });
        await page.close();
        if (url == null) {
            console.log('timeout');
            continue;
        }
        if (url == false) {
            console.log('cannot find apk');
            continue;
        }
        console.log(url);
        const r = await fetch(url);
        const buffer = Buffer.from(await r.arrayBuffer());
        await fs.promises.writeFile(path.basename(url.split('https://')[1]), buffer);
    }
    await browser.close();
})();