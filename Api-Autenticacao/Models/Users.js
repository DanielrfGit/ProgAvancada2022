const mongoose = require('mongoose')

const User = mongoose.model('Users', {
  no_usuario: String,
  tx_email: String,
  hs_auth: String,
  vl_saldo: Number,
  is_admin: Boolean,
})

module.exports = User