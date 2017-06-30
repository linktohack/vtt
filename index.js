const express = require('express')
const cors = require('cors')
const app = express()
const fetch = require('node-fetch');
const srt2vtt = require('srt-to-vtt')
const ass2vtt = require('ass-to-vtt')

const abab = require('abab');
const https = require('https');
const agent = new https.Agent({
    rejectUnauthorized: false
});

app.use(cors())

app.get('/', function (req, res) {
    res.end(['Convert and set the correct vtt mime type for srt and ass (and vtt)',
             '\t/srt?hash=:hash',
             '\t/ass?hash=:hash',
             '\t/vtt?hash=:hash',
             'where `:hash` is `btoa(url)`',
             'https://github.com/linktohack/vtt'].join('\n'))
})

app.get('/srt', function (req, res) {
    res.setHeader('Content-Type', 'text/vtt')
    const url = abab.atob(req.query.hash)
    if (typeof url !== 'string') {
        res.end(`WEBTT FILE\n\n1\n0 --> 10\nError: invalid url}`)
        return
    }
    console.log('url', url)
    fetch(url, { agent })
        .then(res2 => {
            res2.body.pipe(srt2vtt()).pipe(res)
        })
        .catch(e => {
            res.end(`WEBTT FILE\n\n1\n0 --> 10\nError: ${e && e.message || 'unknown'}`)
        })
})

app.get('/ass', function (req, res) {
    res.setHeader('Content-Type', 'text/vtt')
    const url = abab.atob(req.query.hash)
    if (typeof url !== 'string') {
        res.end(`WEBTT FILE\n\n1\n0 --> 10\nError: invalid url}`)
        return
    }
    fetch(url, { agent })
        .then(res2 => {
            res2.body.pipe(ass2vtt()).pipe(res)
        })
        .catch(e => {
            res.end(`WEBTT FILE\n\n1\n0 --> 10\nError: ${e && e.message || 'unknown'}`)
        })
})

app.get('/vtt', function (req, res) {
    res.setHeader('Content-Type', 'text/vtt')
    const url = abab.atob(req.query.hash)
    if (typeof url !== 'string') {
        res.end(`WEBTT FILE\n\n1\n0 --> 10\nError: invalid url}`)
        return
    }
    fetch(url, { agent })
        .then(res2 => {
            res2.body.pipe.pipe(res)
        })
        .catch(e => {
            res.end(`WEBTT FILE\n\n1\n0 --> 10\nError: ${e && e.message || 'unknown'}`)
        })
})

app.listen(process.env.PORT || 8000, function () {
    console.log(`Server listening on port ${process.env.PORT || 8000}!`)
})