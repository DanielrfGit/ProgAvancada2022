import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

export default function Register() {
    let navigate = useNavigate();
    
    const [formData, setFormData] = React.useState(
        {
            username:"",
            email: "", 
            password: "",
            isAdmin:false
        }
    )
    
    function handleChange(event) {
        console.log(event)
        const {name, value, type, checked} = event.target
        setFormData(prevFormData => {
            return {
                ...prevFormData,
                [name]: type === "checkbox" ? checked : value
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
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var jsonUser = JSON.stringify({
            "name": formData.username,
            "email": formData.email,
            "password": formData.password,
            "isAdmin" : formData.isAdmin
        });

        var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: jsonUser,
        redirect: 'follow'
        };

        fetch("http://127.0.0.1:3001/users/register", requestOptions)
        .then(response => response.text())
        .then(result => setResult(JSON.parse(result)))
        .catch(error => console.log('error', error));
        navigate("/")
        
        }
    

    return (
        <form onSubmit={handleSubmit}>
            <br/>
            <input
                type="text"
                placeholder="Username"
                onChange={handleChange}
                name="username"
                value={formData.username}
                required
            />
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
                onChange={handleChange}
                name="password"
                value={formData.password}
                minLength="6"
                required
            />
            <br />
           
            <button>Submit</button>
        </form>
    )
}

{/* <label htmlFor="isAdmin">Are you an admin?</label>
<br />
<input 
    type="checkbox" 
    id="isAdmin" 
    checked={formData.isAdmin}
    onChange={handleChange}
    name="isAdmin"
/> */}