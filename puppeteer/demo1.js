const puppeteer = require('puppeteer');
const winston = require('winston');

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: {service: 'user-service'},
    transports: [
        //
        // - Write to all logs with level `info` and below to `combined.log`
        // - Write all logs error (and below) to `error.log`.
        //
        new winston.transports.Console()
    ]
});

(async () => {
    const url = 'https://www.google.com/';

    if (url) {
        logger.info('processing '  + url);
        if (await fetch(url)) {
            logger.info('success');
        } else {
            logger.info('failure');
        }
    }
})();


async function fetch(url) {
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();

    page.on('request', request => {
       console.log(request.url() + ' requested');
    });

    try {
        const response = await page.goto(url, {waitUntil: 'networkidle0'});
        const status = response.status();

        if (status !== 200) {
            logger.error(url +  ' status code = ' + status);
            result = false;
        } else  {
            result = true;
        }
    } catch (e) {
        console.log(e);
        logger.error(url +  e);

        result = false;
  	}

    await page.screenshot({path: 'screenshot.png'});
    await browser.close();

    return result;
}

