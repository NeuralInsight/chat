import React, { Fragment } from "react";
import { Row, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';


import { useAuthDispatch } from "../../context/auth";

import Users from "./Users";
import Messages from "./Messages";


export default function Login({ history }){
    const dispatch = useAuthDispatch()


    const logout = () => {
        dispatch({ type: 'LOGOUT' })
        //history.push('/login') ===> this become a bug for logout user and login with new account
        //instead of using above method using the below method
        //with below method the page refresh and problem fixed
        window.location.href = '/login'
    }



    return(
        <Fragment>
        <Row className="bg-white justify-content-around">
            <Link to="/login">
                <Button variant="link">Login</Button>
            </Link>
            <Link to="/register">
                <Button variant="link">Register</Button>
            </Link>
            <Button variant="link" onClick={logout} >Logout</Button>
        </Row>
        <Row className="bg-white">
            <Users />
            <Messages />
        </Row>
        </Fragment>
    )
}