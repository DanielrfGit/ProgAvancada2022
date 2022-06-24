import React from "react";
import Product from "../components/Product";

export default function Loja() {
    const [products, setProducts] = React.useState([]);
    const [user, setUser] = React.useState({});
    const token = localStorage.getItem('token');
    const getUser = async () => {
        var myHeaders = new Headers();
        const token = localStorage.getItem('token');
        myHeaders.append('Authorization', token);
        myHeaders.append('Content-Type', 'application/json');
        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };
        const response = await fetch('http://localhost:3001/user', requestOptions);
        const data = await response.json();
        return data.user
    }
    React.useEffect(() => {
        var user = getUser();
        user.then(user => {
            setUser(user)

        })
    },[])

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

    const loadProducts = async () =>  { 
        const myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        // get local storage token and set as authorization header
        // const token = localStorage.getItem('token');
        // myheaders.append('Authorization', token);
        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
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
    


    return(
        <div>
            <h1>
                Bem vindo a Loja
            </h1>
            {user &&
                <div>
                <h2>Email: { user.tx_email && user.tx_email}</h2>
                <h2>Saldo: R${user.vl_saldo && user.vl_saldo}</h2>
                </div>
            }
            {
                products && products.map((produto) =>
                    <Product key={produto._id} item={produto} buy={buy}/>
            )}
        </div>
    );
}
