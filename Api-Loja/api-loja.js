const express = require('express')
const app = express()
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const cors = require('cors')
const { body, validationResult } = require('express-validator');

app.use(express.json());
app.use(cors({origin: '*'}))

const Produtos = require("./Models/Produtos");
const Users = require("./Models/Users");

const port = 3030
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



app.get('/', async (req, res) => {
    res.send('Aqui e a API da Loja')
})

app.get('/produtos/', async (req, res) => {
    var produtos = await Produtos.find({});
    res.status(200).json({ produtos });
})

app.post('/produtos/cadastro', checkToken, checkAdmin, body('name').isLength({min: 2}), body('descr').isLength({min: 2}), body('quantidade').isInt({ min:0, max: 100000}), body('valor').isInt({ min:0, max: 100000}),  async (req, res) =>{

const errors = validationResult(req);
    console.log(errors)
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array()
        });
    }
 

    const { name, descr, quantidade, valor } = req.body;
  
    // check if product exists
    var produto = await Produtos.findOne({ no_produto: name });
    if (produto) {
        console.log("aqui2")
      return res.status(400).json({ msg: "Produto ja existe" });
    }
    
    produto = {
        no_produto: name,
        ds_produto: descr,
        qt_estoque: quantidade,
        vl_valor: valor,
    };

    // save produto
    Produtos.create(produto);
    res.status(201).json({ produto });
})

app.post('/produtos/altera', checkToken, checkAdmin, body('name').isLength({min: 2}), body('descr').isLength({min: 2}), body('quantidade').isInt({ min:0, max: 100000}), body('valor').isInt({ min:0, max: 100000}), async (req, res) => {
  const errors = validationResult(req);
  console.log(errors)
  if (!errors.isEmpty()) {
      return res.status(400).json({
          success: false,
          errors: errors.array()
      });
  }

    const { name, descr, quantidade, valor } = req.body;
    // verify if exist
    var product = await Produtos.findOne({ no_produto: name });
    
    if ( !product || product==""){
      return res.status(400).json({ msg: "Produto nao localizado" });
    }
      
    const productNew = await Produtos.updateOne({_id: product._id}, {$set: {ds_produto:descr, qt_estoque:quantidade, vl_valor:valor}});
  
    var productResult = await Produtos.findOne({ no_produto: name });

    console.log(productResult)
    res.status(200).json({ productResult });
  })

app.post('/produtos/compra', checkToken, body('name').isLength({min: 2}), async (req, res) => {

  const errors = validationResult(req);
  console.log(errors)
  if (!errors.isEmpty()) {
      return res.status(400).json({
          success: false,
          errors: errors.array()
      });
  }
  const authHeader = req.headers["authorization"];
  const token = authHeader;
  const decodedjwt = jwt.decode(token)
  var user = await Users.findOne({ tx_email: decodedjwt.tx_email });
  console.log(user)
  const { name } = req.body;
  // verify if exist
  var product = await Produtos.findOne({ no_produto: name });
  
  if ( !product || product==""){
    return res.status(400).json({ msg: "Produto nao localizado" });
  }

  if ( product.qt_estoque <= 0 ){
    return res.status(400).json({ msg: "Produto fora de estoque" });
  }

  if ( product.vl_valor > user.vl_saldo ){
    return res.status(400).json({ msg: "Saldo insuficiente" });
  }
  var novoSaldo = user.vl_saldo - product.vl_valor
  var novoEstoque = product.qt_estoque - 1
  
  const resultSaldo = await Users.updateOne({_id: user._id}, {$set: {vl_saldo:novoSaldo}});
  const resultEstoque = await Produtos.updateOne({_id: product._id}, {$set: {qt_estoque:novoEstoque}});

  user = await Users.findOne({ tx_email: decodedjwt.tx_email });
  console.log(resultSaldo)

  res.status(200).json({ user });
})
// mongodb://root:example@db:27017/
mongoose.connect('mongodb://127.0.0.1:27017/') .then(() => {
  console.log("Conectou ao banco!");
  app.listen(port, () => {
    console.log(`API de Autenticacao na porta: ${port}`)
  })    
})
.catch((err) => console.log(err));