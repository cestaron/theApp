const mongoose = require('mongoose');

// User Schema
const UserSchema = mongoose.Schema({
  username:{
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password:{
    type: String,
    required: true
  },
  binanceWallet:{
    type: String,
    required: false
  },
  binanceUserId:{
    type: String,
    required: false
  },
  okexWallet:{
    type: String,
    required: false
  },
  okexUserId:{
    type: String,
    required: false
  },
  ftxWallet:{
    type: String,
    required: false
  },
  ftxUserId:{
    type: String,
    required: false
  },
  huobiWallet:{
    type: String,
    required: false
  },
  huobiUserId:{
    type: String,
    required: false
  },
  gateWallet:{
    type: String,
    required: false
  },
  gateUserId:{
    type: String,
    required: false
  },
  kucoinWallet:{
    type: String,
    required: false
  },
  kucoinUserId:{
    type: String,
    required: false
  },
});

const User = module.exports = mongoose.model('User', UserSchema);
