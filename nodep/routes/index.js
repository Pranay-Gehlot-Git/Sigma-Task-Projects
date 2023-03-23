require('dotenv').config();
const { default: axios } = require('axios');
const { response } = require('express');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

/* GET home page. */

mongoose.connect('mongodb+srv://pranay-gehlotlf:pranaygehlot@cluster0.grtlhyj.mongodb.net/?retryWrites=true&w=majority');

const expenseSchema = new mongoose.Schema({
  comment: { type: String, default: null },
  amount: Number,
  date: { type: Date, default: Date.now() },
});

let Expense = mongoose.model('Expense', expenseSchema);


//Get API
router.get('/', async function (req, res) {
  const expenses = await Expense.find();
  const TotalAmount = expenses.reduce((acc, cur) => acc + cur.amount, 0);
  res.render('index', { expenses: expenses, TotalAmount: TotalAmount });
});


router.get('/loantenure', async function (req, res) {
  let error = null;
  let floanAmount, loanAmount, femi, emi, emiFrequency, interestRate, loanTenure, interestPayable, totalAmount,currency;
  res.render('tenure', { femi, floanAmount, currency, error, loanAmount, emi, emiFrequency, interestRate, loanTenure, interestPayable, totalAmount });
});

function currencyFormat(value, amount)
{
 
if(value=="USD"){
 const formatter = new Intl.NumberFormat('en-US', {
    // style: 'currency',
    currency: 'USD'
  
    // These options are needed to round to whole numbers if that's what you want.
    //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
    //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
  });
  return formatter.format(amount);
}
if(value=="INR"){
  const formatter = new Intl.NumberFormat('en-IN', {
    // style: 'currency',
    maximumSignificantDigits: 3
  
    // These options are needed to round to whole numbers if that's what you want.
    //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
    //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
  });
   return formatter.format(amount);
}
}


//loan tenure API
router.post('/loantenure', async function (req, res) {
  let {loanAmount, emi, emiFrequency, interestRate, currency } = req.body;
  let loanTenure, interestPayable, totalAmount, floanAmount, femi;
  try {
    let response = await axios.get(`${process.env.DAlias}/loantenure?loanAmount=${loanAmount}&emi=${emi}&emiFrequency=${emiFrequency}&interestRate=${interestRate}`);
    
    let error = response.data.error;
    loanAmount = response.data.data.loanAmount;
    floanAmount = currencyFormat(currency,response.data.data.loanAmount);
    emi = response.data.data.emi;
    femi=currencyFormat(currency,response.data.data.emi);
    interestRate = response.data.data.interestRate;
    emiFrequency = response.data.data.emiFrequency;
    loanTenure = currencyFormat(currency,response.data.data.loanTenure);
    interestPayable = currencyFormat(currency,response.data.data.interestPayable);
    totalAmount = currencyFormat(currency,response.data.data.totalAmount);

    res.render("tenure", { femi, floanAmount, currency, error, loanAmount, emi, emiFrequency, interestRate, loanTenure, interestPayable, totalAmount });
  } catch (err) {
    
    console.log(err.response);
    let error = err.response.data.error || err.message;
    res.render('tenure', { floanAmount, currency, error, loanAmount, emi, emiFrequency, interestRate, loanTenure, interestPayable, totalAmount });
  }
});



//Add API for add money
router.post('/addMoney', async function (req, res) {
  const { comment, amount } = req.body;

  const expense = new Expense({
    comment,
    amount,
    date: new Date(),
  })

  await expense.save();
  res.redirect('/');
});

router.get('/history', async function (req, res) {

  const expenses = await Expense.find().sort({ date: -1 });
  console.log(expenses);
  res.render('index', { expenses });

})

router.post('/delete', async function (req, res) {

  await Expense.deleteMany();

  res.redirect('/');

})

module.exports = router;