const express = require('express')
const cors = require('cors')
const app = express()
const fetch = require('node-fetch');
const srt2vtt = require('srt-to-vtt')
const ass2vtt = require('ass-to-vtt')

app.use(cors())

app.get('/', function (req, res) {
    res.end(['Convert and set the correct vtt mime type for srt and ass (and vtt)',
             '\t/srt/:hash',
             '\t/ass/:hash',
             '\t/vtt/:hash',
             'where `:hash` is `encodeURIComponent(url)`'].join('\n'))
})

app.get('/srt/:hash', function (req, res) {
    res.setHeader('Content-Type', 'text/vtt')
    const url = decodeURIComponent(req.params.hash)
    fetch(url)
        .then(res2 => {
            res2.body.pipe(srt2vtt()).pipe(res)
        })
        .catch(e => {
            res.end('WEBTT FILE\n')
        })
})

app.get('/ass/:hash', function (req, res) {
    res.setHeader('Content-Type', 'text/vtt')
    const url = decodeURIComponent(req.params.hash)
    fetch(url)
        .then(res2 => {
            res2.body.pipe(ass2vtt()).pipe(res)
        })
        .catch(e => {
            res.end('WEBTT FILE\n')
        })
})

app.get('/vtt/:hash', function (req, res) {
    res.setHeader('Content-Type', 'text/vtt')
    const url = decodeURIComponent(req.params.hash)
    fetch(url)
        .then(res2 => {
            res2.body.pipe.pipe(res)
        })
        .catch(e => {
            res.end('WEBTT FILE\n')
        })
})

app.listen(process.env.PORT || 8000, function () {
    console.log(`Server listening on port ${process.env.PORT || 8000}!`)
})