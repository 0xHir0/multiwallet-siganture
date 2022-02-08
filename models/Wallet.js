const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WalletSchema = new Schema({
   wallet : String,
   owners : [String]
});

module.exports = Wallet = mongoose.model('wallet', WalletSchema);