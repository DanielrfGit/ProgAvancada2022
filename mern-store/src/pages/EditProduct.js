import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";


export default function EditProduct() {
  let navigate = useNavigate();
  const routeChange = () => {
    navigate("/Admin");
  };

 const item = useLocation().state.item;
 console.log(item)
 

  const [formCadastro, setFormCadastro] = React.useState(
    {
        name:  item.no_produto,
        descr: item.ds_produto,
        quantidade: item.qt_estoque,
        valor: item.vl_valor,
    }
)

function handleChange(event) {
  console.log(event)
  const {name, value} = event.target
  setFormCadastro(prevFormCadastro => {
      return {
          ...prevFormCadastro,
          [name]: value
      }
  })
}

function alteraProduto() {
    const token = localStorage.getItem('token');
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append('Authorization', token);  

    var jsonProduto = JSON.stringify({
    "name": formCadastro.name,
    "descr": formCadastro.descr,
    "quantidade" : formCadastro.quantidade,
    "valor" : formCadastro.valor,
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: jsonProduto,
        redirect: 'follow'
    };
    fetch("http://127.0.0.1:3030/produtos/altera", requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error))

    navigate("/Admin")
}

  return (

    <div>
      <div>
      <label htmlFor="editarProduto">Alterar produto</label>
      <form id = "editar" onSubmit={alteraProduto}>
      <input
          type="text"
          placeholder=""//dados originais do produto
          onChange={handleChange}
          name="name"
          value={formCadastro.name}
          disabled
      />
      <input
          type="text"
          placeholder=""//dados originais do produto
          onChange={handleChange}
          name="descr"
          value={formCadastro.descr}
      />
      <input
          type="text"
          placeholder=""//dados originais do produto
          onChange={handleChange}
          name="quantidade"
          value={formCadastro.quantidade}
      />
      <input
          type="text"
          placeholder=""//dados originais do produto
          onChange={handleChange}
          name="valor"
          value={formCadastro.valor}
      />
      <br />
      <br />
      <button>Submit</button>
  </form>
  </div>
  <button onClick={routeChange}>
    Voltar
  </button>
</div>
  );
}