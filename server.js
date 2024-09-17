const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/bankingApp', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Account model
const AccountSchema = new mongoose.Schema({
  accountNumber: { type: String, required: true, unique: true },
  accountHolderName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  balance: { type: Number, required: true, default: 1000 }
});

const Account = mongoose.model('Account', AccountSchema);

// Routes
app.post('/createAccount', async (req, res) => {
  try {
    const { accountNumber, accountHolderName, email } = req.body;
    const newAccount = new Account({ accountNumber, accountHolderName, email });
    await newAccount.save();
    res.status(201).json(newAccount);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/depositMoney/:accountNumber', async (req, res) => {
  try {
    const { amount } = req.body;
    const { accountNumber } = req.params;
    const account = await Account.findOne({ accountNumber });
    if (!account) return res.status(404).json({ error: 'Account not found' });

    account.balance += amount;
    await account.save();
    res.json({ balance: account.balance });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/withdrawMoney/:accountNumber', async (req, res) => {
  try {
    const { amount } = req.body;
    const { accountNumber } = req.params;
    const account = await Account.findOne({ accountNumber });
    if (!account) return res.status(404).json({ error: 'Account not found' });
    if (account.balance < amount) return res.status(400).json({ error: 'Insufficient balance' });

    account.balance -= amount;
    await account.save();
    res.json({ balance: account.balance });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/checkBalance/:accountNumber', async (req, res) => {
  try {
    const { accountNumber } = req.params;
    const account = await Account.findOne({ accountNumber });
    if (!account) return res.status(404).json({ error: 'Account not found' });

    res.json({ balance: account.balance });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/deleteAccount/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const account = await Account.findByIdAndDelete(id);
    if (!account) return res.status(404).json({ error: 'Account not found' });

    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Route to get all accounts
app.get('/getAllAccounts', async (req, res) => {
  try {
    const accounts = await Account.find();
    res.json(accounts);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
