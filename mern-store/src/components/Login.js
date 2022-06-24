// var myHeaders = new Headers();
// myHeaders.append("Content-Type", "application/json");

// var raw = JSON.stringify({
//   "email": "test6@mail.com",
//   "password": "123654"
// });

// var requestOptions = {
//   method: 'POST',
//   headers: myHeaders,
//   body: raw,
//   redirect: 'follow'
// };

// fetch("http://127.0.0.1:3000/users/login", requestOptions)
//   .then(response => response.text())
//   .then(result => console.log(result))
//   .catch(error => console.log('error', error));
import React from 'react';
//import IconButton from "@material-ui/core/IconButton";
//import Visibility from "@material-ui/icons/Visibility";
//import InputAdornment from "@material-ui/core/InputAdornment";
//import VisibilityOff from "@material-ui/icons/VisibilityOff";
//import Input from "@material-ui/core/Input";
 import { useNavigate } from 'react-router-dom';
import { useJwt } from "react-jwt";

export default function Login() {

    const [formData, setFormData] = React.useState(
        {
            email: "", 
            password: ""
        }
    )

    let navigate = useNavigate();
    
    function handleChange(event) {
        console.log(event)
        const {name, value} = event.target
        setFormData(prevFormData => {
            return {
                ...prevFormData,
                [name]: value
            }
        })
    }

    const [result, setResult] = React.useState({})

    const makeLogin = async () =>  { 
        const myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        // get local storage token and set as authorization header
        // const token = localStorage.getItem('token');
        // myheaders.append('Authorization', token);
        var raw = JSON.stringify({
            "email": formData.email,
            "password": formData.password
            });
        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            redirect: 'follow',
            body: raw,
            };
        const response = await fetch("http://127.0.0.1:3001/users/login", requestOptions)
        let login_data = await response.json();
        //console.log(data)
        return login_data
    }

    function handleSubmit(event) {
        event.preventDefault()
        var login = makeLogin()
        // var myHeaders = new Headers();
        // myHeaders.append("Content-Type", "application/json");

        // var raw = JSON.stringify({
        // "email": formData.email,
        // "password": formData.password
        // });

        // var requestOptions = {
        // method: 'POST',
        // headers: myHeaders,
        // body: raw,
        // redirect: 'follow'
        // };
    
        // fetch("http://127.0.0.1:3001/users/login", requestOptions)
        //     .then(response => response.text())
        //     .then(result => setResult(JSON.parse(result)))
        //     .catch(error => console.log('error', error));
        login.then(result  => {
        if (result.user){
            if (result.token) {
                localStorage.clear();
                localStorage.setItem("token", result.token)
                console.log("Usuario Autenticado Setando Token no Local Storage")
                console.log("Token: " + result.token)
            }
            if (result.user.is_admin == true) {
                console.log("Is admin")
                navigate("/admin")
            }
            if (result.user.is_admin == false) {
                console.log("Is not admin")
                navigate("/loja")
            }
        }
        else {
            console.log("error")
        }})
    }

    function handleRedirect() {
        navigate("/registration")
    }

    


    return (
        <div>
            <div className="image--container">
                <img src="https://portal.ufrj.br/static/img/portal-aluno/minerva-perfil.png" alt="logo" />
            </div>
            


            <div className="div">
                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="Email"
                        onChange={handleChange}
                        name="email"
                        value={formData.email}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        minLength="6"
                        required
                    />  
                
                    <br />
                    <br />
                    <button>Login</button>
                    <br />
                    <button onClick={handleRedirect}>Cadastro</button>
                    </form>
                </div>
          
        </div>
    )
}

