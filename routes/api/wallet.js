const express = require('express')
const router = express.Router()

// Wallet Model
const Wallet = require('../../models/Wallet')

//@rout  POST api/Create
//desc   Create an Wallet
//access Public
router.post('/save', (req, res) => {
  const newWallet = new Wallet({
    wallet: req.body.wallet,
    owners: req.body.owners,
  })
  console.log(newWallet)

  newWallet.save().then((item) => res.json(item))
})

//@rout  POST api/items
//desc   findSafeListByAccount
//access Public
router.post('/findSafeListByAccount', (req, res) => {

  Wallet.find({ owners: { $elemMatch: {$eq: "" + req.body.account} } }, function (err, data) {
    if (err) return res.status(400).json(err)
    return res.json(data)
  })
})

module.exports = router