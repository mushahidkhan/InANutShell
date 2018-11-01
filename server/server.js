
const express = require('express')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const fs = require('fs')
const steem = require('steem');
const path = require('path');

const urlencodeParser = bodyParser.urlencoded({ extended: false })

const app = express()
app.use(bodyParser.json())

var secret = require("./private.json")['secret'];
var currentDate = Date.now();
var secretWithDate = currentDate + secret;
const hmac = crypto.createHash('sha256').update(secretWithDate).digest('hex');

function verifyToken(req, res, next) {
  const bearerHeader = req.headers['authorization']
  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(' ')
    req.token = bearer[1]
    next()
  } else {
    res.sendStatus(403)
  }
}
app.listen(3001, () => console.log('Listening on port 3001.'))
app.post('/api/login', urlencodeParser, async (req, res) => {
  const username = "mushikhan"
  const password = "TqfVEPYHXgvETNTSc2NzGFVi8HSUMVD7"
  console.log(username)
  console.log(password)
    const account = await steem.api.getAccountsAsync([ username ])
  const pubKey = account[0].posting.key_auths[0][0]
  const { posting } = steem.auth.getPrivateKeys(username, password, ['posting'])
  const isValid = steem.auth.wifIsValid(posting, pubKey)
  if (isValid) {
    jwt.sign({ username }, hmac, (err, token) => {
      if (err) {
        throw err 
        }
      res.json({ token })
    })

  } else {
    res.sendStatus(403)
  }
})

app.post('/api/posts', verifyToken, (req, res) => {
  jwt.verify(req.token, hmac, (err, auth) => {
    if (err) res.sendStatus(403, { err })

    res.json({ auth })
  })
})

