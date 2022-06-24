const express = require('express')
const app = express()
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require('cors')
const { body, validationResult } = require('express-validator');

app.use(express.json());
app.use(cors({origin: '*'}))

const Users = require("./Models/Users");
const port = 3001
const JWTsecret = "teste123";


function checkToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader;
  if (!token || token=="") {
      return res.status(401).json({ msg: "Voce precia de um token!" });
  }
  try {
      jwt.verify(token, JWTsecret);
      next();
  } catch (err) {
      res.status(400).json({ msg: "O Token e invalido!" });
  }
}

// TODO CHECK IN BD
function checkAdmin(req, res, next) {
  const token = req.headers["authorization"];
  const decodedjwt = jwt.decode(token)
  try {
    jwt.verify(token, JWTsecret);
  } catch (err) {
      res.status(400).json({ msg: "O Token e invalido!" });
  }
  if (decodedjwt.is_admin != true) {
      return res.status(403).json({ msg: "Voce precia ser administrador para acessar!" });
  }
  next();
}



app.get('/', (req, res) => {
  res.send('Aqui e a API de autenticacao')
})
// Route to list all users
app.get("/users/", checkToken, checkAdmin, async (req, res) => {
  var users = await Users.find({},"-hs_auth");
  res.status(200).json({ users });
});

app.post("/users/makeadmin", checkToken, checkAdmin, body('email').isEmail(), body('is_admin').isBoolean(), async (req, res) => {
  const errors = validationResult(req);
  console.log(errors)
  if (!errors.isEmpty()) {
      return res.status(400).json({
          success: false,
          errors: errors.array()
      });
  }

  const { email , is_admin } = req.body;
  var user = await Users.findOne({ tx_email: email });
  
  if ( !user || user==""){
    return res.status(400).json({ msg: "Usuario nao existe" });
  }

  const result = await Users.updateOne({_id: user._id}, {$set: {is_admin:is_admin}});
  user = await Users.findOne({ tx_email: email });
  
  user.hs_auth = ""
  res.status(200).json({ user });
});

app.post("/users/atualizasaldo", checkToken, checkAdmin, body('email').isEmail(), body('saldo').isInt({ min:0, max: 100000}), async (req, res) => {
  // await checkAdmin(req, res)
  
  const errors = validationResult(req);
  console.log(errors)
  if (!errors.isEmpty()) {
      return res.status(400).json({
          success: false,
          errors: errors.array()
      });
  }


  const { email , saldo } = req.body;
  // verify if exist
  var user = await Users.findOne({ tx_email: email });
  
  if ( !user || user==""){
    return res.status(400).json({ msg: "Usuario nao existe" });
  }

  const result = await Users.updateOne({_id: user._id}, {$set: {vl_saldo:saldo}});
  user = await Users.findOne({ tx_email: email });
  
  user.hs_auth = ""
  res.status(200).json({ user });
});

// Route to create user
app.post("/users/register", body('email').isEmail(), body('password').isLength({min: 6}), body('name').isLength({min: 4}), async (req, res) => {
  const errors = validationResult(req);
  console.log(errors)
  if (!errors.isEmpty()) {
      return res.status(400).json({
          success: false,
          errors: errors.array()
      });
  }

  const { name, email, password } = req.body;

  // check if user exists
  var user = await Users.findOne({ tx_email: email });
  // if user exists, return error 
  // use a random message to prevent user enumeration
  if (user) {
    return res.status(400).json({ msg: "Erro ao criar usuario" });
  }
  
  // HASH Before save
  const salt = await bcrypt.genSalt(12);
  const hs_auth = await bcrypt.hash(password, salt);
  user = {
    no_usuario: name,
    tx_email: email,
    hs_auth: hs_auth,
    vl_saldo: 10,
    is_admin: false
  };
  // save user
  Users.create(user);
  user.hs_auth = ""
  res.status(201).json({ user });
});

// Route to login user
app.post("/users/login", body('email').isEmail(), body('password').isLength({min: 6}), async (req, res) => {
  const errors = validationResult(req);
  console.log(errors)
  if (!errors.isEmpty()) {
      return res.status(400).json({
          success: false,
          errors: errors.array()
      });
  }
  
  const { email, password } = req.body;

  const salt = await bcrypt.genSalt(12);
  const hs_auth = await bcrypt.hash(password, salt);
  var user = await Users.findOne({ tx_email: email });
  if (!user ){
    return res.status(400).json({ msg: "Usuario nao encontrado ou senha invalida" });
  }
  if ( !await bcrypt.compare(password, user.hs_auth)){
    return res.status(400).json({ msg: "Usuario nao encontrado ou senha invalida" });
  }
  // JWT
  const token = jwt.sign({tx_email: user.tx_email,is_admin: user.is_admin}, JWTsecret);

  user.hs_auth = ""
  res.status(200).json({ user, token });
});

app.get("/user/", checkToken, async (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader;
  const decodedjwt = jwt.decode(token)
  const user = await Users.findOne({ tx_email: decodedjwt.tx_email});
  user.hs_auth = ""
  res.status(200).json({ user });
});

// mongodb://root:example@db:27017/
mongoose.connect('mongodb://127.0.0.1:27017/') .then(() => {
  console.log("Conectou ao banco!");
  app.listen(port, () => {
    console.log(`API de Autenticacao na porta: ${port}`)
  })    
})
.catch((err) => console.log(err));