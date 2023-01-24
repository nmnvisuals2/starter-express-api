const { S3 } = require("aws-sdk");
const { puppeteer, args, defaultViewport, executablePath } = require("chrome-aws-lambda");

const s3 = new S3();
const express = require('express')


var bodyParser = require('body-parser')
const router = express.Router()
const session = require('express-session');
const app = express()
const port = 3005
var path = require('path');
const cors = require('cors');

async function printPDF() {
    const date = new Date().toISOString();


    const filename = `pdf-${date}`

    const pdfPath = `/tmp/${filename}.pdf`
    const browser = await puppeteer.launch({
        args,
        defaultViewport,
        executablePath: await executablePath,
        headless: true, //
        ignoreHTTPSErrors: true,
    });


    const page = await browser.newPage();
    console.log("Opening new page...");
    await page.goto('http://invoez.com/printables/0?short=אוהבים%20אתכם&long=משלוח מיוחד ומתוק היישר מתוניס לכם נשאר רק להכין כוס תה מתוק ולהינות!&signature=אוהבים%20אתכם', { waitUntil: 'networkidle0' });

    await page.pdf({ path: pdfPath, preferCSSPageSize: false, printBackground: true, scale: 1, width: "100mm", height: '150mm' });


    /*  const params = {
         Key: pdfPath,
         Body: fs.createReadStream(pdfPath),
         Bucket: "cyclic-shy-red-piglet-tutu-ap-south-1",
         ContentType: "application/pdf",
     };
     await s3
         .upload(params, async(err, res) => {
             if (err) {
                 console.log(err);
                 throw new Error(err);
             }
             console.log("done");
             console.log(res);
             return cb(null, res);
         })
         .promise();

     result = await page.title(); */
    return { "date": "done" };

}


app.all('/', (req, res) => {
    console.log("Just got a request!")
    res.send('Yo!');

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

app.listen(process.env.PORT || '3005', () => {
    console.log('Server is listening on' + port);
})