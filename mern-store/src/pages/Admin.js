    import React from "react"
    import Product from "../components/Product"
    import { useNavigate } from 'react-router-dom';
    import User from "../components/User"
    
    export default function Admin () {
        
        function makeAdmin (event, user) {
            const token = localStorage.getItem('token');
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append('Authorization', token);
            var raw = JSON.stringify({
            "email": user.tx_email, 
            "is_admin" : user.is_admin
            });
    
            var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
            };
            fetch("http://127.0.0.1:3001/users/makeadmin", requestOptions)
            .then(response => response.text())
            .then(result => console.log(result))
            .catch(error => console.log('error', error))
        }
        
        function buy (event, item) {
            const token = localStorage.getItem('token');
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append('Authorization', token);
            var raw = JSON.stringify({
            "name": item.no_produto,
            });
    
            var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
            };
            fetch("http://127.0.0.1:3030/produtos/compra", requestOptions)
            .then(response => response.text())
            .then(result => console.log(result))
            .catch(error => console.log('error', error))
            window.location.reload()
        }
        
        function cadastroProduto () {
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            const token = localStorage.getItem('token');
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
            fetch("http://127.0.0.1:3030/produtos/cadastro", requestOptions)
            .then(response => response.text())
            .then(result => console.log(result))
            .catch(error => console.log('error', error))
        }

        function atualizaSaldo(event, user) {
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            const token = localStorage.getItem('token');
            myHeaders.append('Authorization', token);
            var jsonSaldo = JSON.stringify({
            "email": user.tx_email,
            "saldo": user.vl_saldo
            });

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: jsonSaldo,
                redirect: 'follow'
            };
            fetch("http://127.0.0.1:3001/users/atualizasaldo", requestOptions)
            .then(response => response.text())
            .then(result => console.log(result))
            .catch(error => console.log('error', error))
            
        }



        let navigate = useNavigate();

        function alteraProduto (event, item) {
            navigate(
                '/editar',
                {
                  state: {
                    item
                  }
                }
              )
        }
      
        // const [formSaldo, setFormSaldo] = React.useState(
        //     {
        //         email:"",
        //         saldo:""
        //     }
        // )

        const [formCadastro, setFormCadastro] = React.useState(
            {
                name: "", 
                descr: "",
                quantidade : "",
                valor: ""
            }
        )
        // function handleChangeSaldo(event) {
        //     console.log(event)
        //     const {name, value} = event.target
        //     setFormSaldo(prevFormSaldo => {
        //         return {
        //             ...prevFormSaldo,
        //             [name]: value
        //         }
        //     })
        // }
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


    const [data, setData] = React.useState([]);

    React.useEffect(function() {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

    
        var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
        };

        fetch("http://127.0.0.1:3030/produtos/", requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error))
        console.log(data)
    }, [])

    const [products, setProducts] = React.useState([])
  
    const loadUsers = async () =>  { 
        const myheaders = new Headers();
        myheaders.append('Content-Type', 'application/json');
        const token = localStorage.getItem('token');
        myheaders.append('Authorization', token);
        var requestOptions = {
            method: 'GET',
            headers: myheaders,
            redirect: 'follow'
            };
        const response = await fetch("http://127.0.0.1:3001/users/", requestOptions)
        let data = await response.json();
        //console.log(data)
        return data.users
    }
    const [users, setUsers] = React.useState([]);
    React.useEffect( function(){
        var carregaUsers = loadUsers();
        carregaUsers.then(function(users){
            console.log(users)
            setUsers(users);
        })
    }, []);
    const loadProducts = async () =>  { 
        const myheaders = new Headers();
        myheaders.append('Content-Type', 'application/json');
        // get local storage token and set as authorization header
        // const token = localStorage.getItem('token');
        // myheaders.append('Authorization', token);
        var requestOptions = {
            method: 'GET',
            headers: myheaders,
            redirect: 'follow'
            };
        const response = await fetch("http://127.0.0.1:3030/produtos/", requestOptions)
        let data = await response.json();
        //console.log(data)
        return data
    }
    React.useEffect( function(){
        var carregaprodutos = loadProducts();
        carregaprodutos.then(function(data){
            // console.log(data.produtos)
            setProducts(data.produtos);
        })
    }, []);

   
    const [display, setDisplay] = React.useState(false)

    function handleDisplay () {
        setDisplay(oldDisplay => !oldDisplay
        )
        console.log(display)
    }

    function handleUserChange (event, user) {
        event.preventDefault();
        makeAdmin(event, user);
        atualizaSaldo(event, user);
        window.location.reload();

    }


        return (
 
            <div>
                {!users && navigate('/') && console.log("Voce nao tem permissao")  } 
                <h1> 
                    Página de admin
                </h1>
            <div className="registraproduto">
                <button onClick={handleDisplay}>Toggle Users/Produtos</button>
                <br />
                <br />
            </div>   
            <hr></hr>
            <div id='produto' style={{display: display ? "none" : "block"}}>
            <label htmlFor="cadastroProduto">Registrar novo produto</label>    
            <div className="registraproduto">
            
                <form id = "cadastroProduto" onSubmit={cadastroProduto}>
                <input
                    type="text"
                    placeholder="no_produto"
                    onChange={handleChange}
                    name="name"
                    value={formCadastro.name}
                />
                <input
                    type="text"
                    placeholder="ds_produto"
                    onChange={handleChange}
                    name="descr"
                    value={formCadastro.descr}
                />
                <input
                    type="text"
                    placeholder="qt_estoque"
                    onChange={handleChange}
                    name="quantidade"
                    value={formCadastro.quantidade}
                />
                <input
                    type="text"
                    placeholder="vl_valor"
                    onChange={handleChange}
                    name="valor"
                    value={formCadastro.valor}
                />
                <br />
                <br />
                <div className="butao">
                <button>Cadastra Novo Produto</button>
                </div>
                </form>
                
            </div>
            <hr></hr>
            
                {
                    products && products.map((produto) =>
                        <Product key={produto.no_produto} item={produto} buy={buy} isAdmin={true} alteraProduto={alteraProduto}/>
                )}
            
            </div>
            <div style={{display: display ? "block" : "none"}}>
                {
                    users && users.map((user) =>
                        <User key={user._id} user={user} handleUserChange={handleUserChange} />
                )}
                
            </div>
        </div>
        )
    }
