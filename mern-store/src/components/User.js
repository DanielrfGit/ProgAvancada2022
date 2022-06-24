import React from "react";

export default function User(props) {
    const [formData, setFormData] = React.useState({
        is_admin : props.user.is_admin,
        vl_saldo : "",
        tx_email : props.user.tx_email
    });
    function handleChange(event) {
        const {name, value, type, checked} = event.target
        setFormData(prevFormData => {
            return {
                ...prevFormData,
                [name]: type === "checkbox" ? checked : value
            }
        })
    }

    return (
        <div className="user">
            <p className="user--name">{props.user.no_usuario}</p>
            <p className="user--email">{props.user.tx_email}</p>
            <p className="user--saldo">{props.user.vl_saldo}</p>
            <div className="button">
                <form>
                    <label htmlFor = "make--admin"><h3>Make admin</h3></label>
                    <input 
                        id="make--admin"
                        onChange={handleChange}
                        type="checkbox"
                        checked={formData.is_admin}
                        name="is_admin"

                    />
                    <input
                        className="altera--saldo"
                        onChange={handleChange}
                        type="number"
                        name="vl_saldo"
                        value={formData.vl_saldo}
                        placeholder={props.user.vl_saldo}
                    />
                    <button onClick={event => props.handleUserChange(event, formData)}>Submit changes to user</button>
                </form>
            </div>
        
        </div>
    )
}