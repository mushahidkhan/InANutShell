
const express = require('express')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
var steem = require('steem');
const urlencodeParser = bodyParser.urlencoded({ extended: false })

const app = express()
app.use(bodyParser.json())

app.post('/api/login', urlencodeParser, async (req, res) => {
	console.log("AAAAAAAAAA");
  var username = req.body.username;
  var password = req.body.password;


  // get posting public key
  const account = await steem.api.getAccountsAsync([ username ])
  console.log(account);
  const pubKey = account[0].posting.key_auths[0][0]

  // 
  // for a given username/password combo,
  // response contains { posting: 'private key', postingPubkey: 'pub key' }
  // 
  const { posting } = steem.auth.getPrivateKeys(username, password, ['posting'])
  //
  // See if the private key is a match to the public key
  const isValid = steem.auth.wifIsValid(posting, pubKey)
   
  if (isValid) {
    res.json({ username })
  } else {
    res.sendStatus(403)
}
  res.sendStatus(403)
})

app.listen(3001, () => console.log('Listening on port 5000.'))