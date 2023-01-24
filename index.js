const puppeteer = require('puppeteer')
const chromium = require('chrome-aws-lambda')
const express = require('express')


var bodyParser = require('body-parser')
const router = express.Router()
const session = require('express-session');
const app = express()
const port = 3005
var path = require('path');
const cors = require('cors');

async function printPDF() {
    const options = process.env.AWS_REGION ? {
        args: chrome.args,
        executablePath: await chrome.executablePath,
        headless: chrome.headless
    } : {
        args: [],
        headless: false,
        executablePath: process.platform === 'win32' ?
            'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe' : process.platform === 'linux' ?
            '/usr/bin/google-chrome' : '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
    };
    const browser = await puppeteer.launch(options);
    const page = await browser.newPage();
    await page.goto('http://invoez.com/printables/0?short=אוהבים%20אתכם&long=משלוח מיוחד ומתוק היישר מתוניס לכם נשאר רק להכין כוס תה מתוק ולהינות!&signature=אוהבים%20אתכם', { waitUntil: 'networkidle0' });

    await page.pdf({ path: `${__dirname}/public/${Date.now()}.pdf`, preferCSSPageSize: false, printBackground: true, scale: 1, width: "100mm", height: '150mm' });
    await browser.close();

}


app.all('/', (req, res) => {
    console.log("Just got a request!")
    res.send('Yo!')
})



app.use(cors({

}));


app.use('/public', express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
app.post('/printables', async function(req, res) {

    res.send(await printPDF());



});
app.get('/',
    (req, res) => {
        res.send({
            main: __dirname
        })
    }
)
app.listen(process.env.PORT || '3005', () => {
    console.log('Server is listening on' + port);
})