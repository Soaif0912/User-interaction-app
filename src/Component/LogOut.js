
import React from 'react';
import { useContext } from "react";
import { NavLink } from "react-router-dom"
import AuthContext from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";


const LogOut =()=>{

    const navigate = useNavigate();

    const { setAuth, setIsLogin } = useContext(AuthContext);

    const logout =()=>{
        localStorage.removeItem('loginapp_login_token')
        localStorage.removeItem('loginapp_username')
        setAuth({});
        setIsLogin(false);
        navigate('/login');
    }

    return(
        <section>
            <h1>You are logged in!</h1>
            <br />
            <button onClick={logout}>Logout</button>
            <p>
            </p>
        </section>
    )
}
export default LogOut;




