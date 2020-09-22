import React from "react";
import {
    ApolloClient,
    InMemoryCache,
    ApolloProvider as Provider,
    createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { Row, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { gql, useQuery } from "@apollo/client";

import { useAuthDispatch } from "../context/auth";

const httpLink = createHttpLink({
    uri: 'http://localhost:4000',
})

const authLink = setContext((_, { headers }) => {
    //get authentication token from localstorage if it exists
    const token = localStorage.getItem('token')
    //return the headers to the context so httplink can read them
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : '',
        },
    }
})

const GET_USERS = gql`
    query getusers{
        getUsers{
            username email createdAt
        }
    }
`

export default function Login({ history }){
    const dispatch = useAuthDispatch()

    const logout = () => {
        dispatch({ type: 'LOGOUT' })
        history.push('/login')
    }

    const { loading, data, error } = useQuery(GET_USERS)

    if(error){
        console.log(error)
    }
    if(data){
        console.log(error)
    }

    return(
        <Row className="bg-white justify-content-around">
            <Link to="/login">
                <Button variant="link">Login</Button>
            </Link>
            <Link to="/register">
                <Button variant="link">Register</Button>
            </Link>
            <Button variant="link" onClick={logout} >Logout</Button>
        </Row>
    )
}