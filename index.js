require('dotenv').config();
const bodyParser = require("body-parser");
const express = require('express');
const cors = require('cors');
const app = express();
const dns = require("dns")
// Basic Configuration
const port = process.env.PORT || 3000;
app.use(bodyParser.urlencoded({extended: false}))
app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
});

let urlMem = [];

(function () {
    setTimeout(() => {
        urlMem = []
    }, 1000000)
})()

app.post('/api/shorturl', (req, res) => {
    const url = req.body.url
    dns.lookup(`${url}`, (err, address) => {
        if (err) {
            return res.json({error: 'invalid url'})
        }
        urlMem.push(url)
        return res.json({
            original_url: url,
            short_url: urlMem.length
        })
    })

})

app.get('/api/shorturl/:id', (req, res) => {
    const id = req.params.id
    const url = urlMem[id - 1]
    if (!url) return res.end()
    return res.redirect(url)
})

app.listen(port, function () {
    console.log(`Listening on port ${port}`);
});
