require('dotenv').config();
const bodyParser = require("body-parser");
const express = require('express');
const dns = require("dns")
const cors = require('cors');
const app = express();
// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors({optionsSuccessStatus: 200}));
app.use(bodyParser.urlencoded({extended: false}))

app.use('/public', express.static(`/public`));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/views/index.html');
});

let urlMem = [];

(function () {
    setTimeout(() => {
        urlMem = []
    }, 1000000)
})()

// dns????

app.post('/api/shorturl', (req, res) => {
    const url = req.body.url
    if (!url.match(/^(https?:\/\/)[^\s.]+(\.[^\s.]+)+\/[^\s]*/)) {
        return res.json({ error: "invalid url" });
    }
        urlMem.push(url)
        return res.json({
            original_url: url,
            short_url: urlMem.length
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
