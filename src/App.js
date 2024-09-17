import React, { useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';

const App = () => {
  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <div className="logo">Projectbank</div>
          <div className="nav-links">
            <Link to="/">Home</Link>
            <Link to="/transactions">Transactions</Link>
            <Link to="/manage">Manage Accounts</Link>
          </div>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/manage" element={<ManageAccounts />} />
        </Routes>
      </div>
    </Router>
  );
};

const Home = () => {
  return (
    <div className="home">
      <div className="banner">
        <h1>Be part of something bigger</h1>
        <p>Always with you</p>
        
      </div>
      <div className="content">
        <section className="about">
          <h2>About Us</h2>
          <p>Projectbank is committed to providing exceptional banking services to our customers. With a wide range of financial products and personalized customer support, we ensure your financial needs are met with utmost care and efficiency.</p>
        </section>
        <section className="services">
          <h2>Our Services</h2>
          <ul>
            <li>Personal Banking</li>
            <li>Business Banking</li>
            <li>Loans and Mortgages</li>
            <li>Investment Services</li>
            <li>Online and Mobile Banking</li>
          </ul>
        </section>
        <section className="cta">
          <h2>Join Us Today!</h2>
          <p>Experience the best in banking with Projectbank. Open an account today and start enjoying our premium services.</p>
          <button>Get Started</button>
        </section>
      </div>
    </div>
  );
};


const Transactions = () => {
  const [accountNumber, setAccountNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [balance, setBalance] = useState(null);
  const [message, setMessage] = useState('');

  const handleDeposit = async () => {
    try {
      const response = await axios.post(`http://localhost:3001/depositMoney/${accountNumber}`, { amount: parseFloat(amount) });
      setBalance(response.data.balance);
      setMessage('');
    } catch (error) {
      setMessage(error.response.data.error);
    }
  };

  const handleWithdraw = async () => {
    try {
      const response = await axios.post(`http://localhost:3001/withdrawMoney/${accountNumber}`, { amount: parseFloat(amount) });
      setBalance(response.data.balance);
      setMessage('');
    } catch (error) {
      setMessage(error.response.data.error);
    }
  };

  const handleCheckBalance = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/checkBalance/${accountNumber}`);
      setBalance(response.data.balance);
      setMessage('');
    } catch (error) {
      setMessage(error.response.data.error);
    }
  };

  return (
    <div className="transactions">
      <h1>Transactions</h1>
      <input type="text" placeholder="Account Number" value={accountNumber} onChange={e => setAccountNumber(e.target.value)} />
      <input type="number" placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} />
      <div className="buttons">
        <button onClick={handleDeposit}>Deposit Money</button>
        <button onClick={handleWithdraw}>Withdraw Money</button>
        <button onClick={handleCheckBalance}>Check Balance</button>
      </div>
      {balance !== null && <p>Current Balance: Rs {balance}</p>}
      {message && <p style={{ color: 'red' }}>{message}</p>}
    </div>
  );
};

const ManageAccounts = () => {
  const [accountNumber, setAccountNumber] = useState('');
  const [accountHolderName, setAccountHolderName] = useState('');
  const [email, setEmail] = useState('');
  const [accountId, setAccountId] = useState('');
  const [accounts, setAccounts] = useState([]);
  const [message, setMessage] = useState('');

  const handleCreateAccount = async () => {
    try {
      await axios.post('http://localhost:3001/createAccount', { accountNumber, accountHolderName, email });
      setMessage('Account created successfully!');
      setAccountNumber('');
      setAccountHolderName('');
      setEmail('');
    } catch (error) {
      setMessage(error.response.data.error);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await axios.delete(`http://localhost:3001/deleteAccount/${accountId}`);
      setMessage('Account deleted successfully!');
      setAccountId('');
    } catch (error) {
      setMessage(error.response.data.error);
    }
  };

  const fetchAccounts = async () => {
    try {
      const response = await axios.get('http://localhost:3001/getAllAccounts');
      setAccounts(response.data);
    } catch (error) {
      setMessage(error.response.data.error);
    }
  };

  return (
    <div className="manage-accounts">
      <h1>Manage Accounts</h1>
      <div className="create-account">
        <h2>Create Account</h2>
        <input type="text" placeholder="Account Number" value={accountNumber} onChange={e => setAccountNumber(e.target.value)} />
        <input type="text" placeholder="Account Holder Name" value={accountHolderName} onChange={e => setAccountHolderName(e.target.value)} />
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <button onClick={handleCreateAccount}>Create Account</button>
      </div>
      <div className="delete-account">
        <h2>Delete Account</h2>
        <input type="text" placeholder="Account ID" value={accountId} onChange={e => setAccountId(e.target.value)} />
        <button onClick={handleDeleteAccount}>Delete Account</button>
      </div>
      <div className="all-accounts">
        <h2>All Accounts</h2>
        <button onClick={fetchAccounts}>Fetch Accounts</button>
        <ul>
          {accounts.map(account => (
            <li key={account._id}>{account.accountNumber} - Rs {account.balance}</li>
          ))}
        </ul>
      </div>
      {message && <p style={{ color: 'red' }}>{message}</p>}
    </div>
  );
};

export default App;
