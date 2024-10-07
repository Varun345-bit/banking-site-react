// models/Account.js
const mongoose = require('mongoose');

const AccountSchema = new mongoose.Schema({
  accountNumber: { type: String, required: true, unique: true },
  accountHolderName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  balance: { type: Number, required: true, default: 1000 },
});

module.exports = mongoose.model('Account', AccountSchema);
