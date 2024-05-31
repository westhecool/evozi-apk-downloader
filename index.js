const q = 'com.twitter.android';
const puppeteer = require('puppeteer');
(async () => {
    const browser = await puppeteer.launch({headless:true});
    const page = await browser.newPage();
    await page.goto('https://apps.evozi.com/apk-downloader/?id=' + q);
    await page.click('.btn-info');
    console.log(await page.evaluate(async () => {
        var r = null;
        while (r == null) {
            for (const e of Array.from(document.getElementsByTagName('a'))) {
                if (e.href.startsWith('https://storage.evozi.com/apk')) {
                    r = e.href;
                    break;
                } 
            }
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        return r;
    }));
    await browser.close();
})();