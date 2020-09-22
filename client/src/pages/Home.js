import React, {useState, Fragment, useEffect} from "react";
import { Row, Button, Col, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { gql, useQuery, useLazyQuery } from "@apollo/client";

import { useAuthDispatch } from "../context/auth";


const GET_USERS = gql`
    query getusers{
        getUsers{
            username createdAt imageUrl
            latestMessage{
                uuid from to content createdAt
            }
        }
    }
`

const GET_MESSAGES = gql`
    query getUsers($from: String!){
        getMessages(from: $from){
            uuid 
            from
            to
            content 
            createdAt
        }
    }
`

export default function Login({ history }){
    const dispatch = useAuthDispatch()
    const [selectedUser, setSelectedUser] = useState(null)

    const logout = () => {
        dispatch({ type: 'LOGOUT' })
        history.push('/login')
    }

    const [getMessages, { loading: messagesLoading, data: messagesData }] = useLazyQuery(GET_MESSAGES)

    useEffect(() => {
        if(selectedUser){
            getMessages({ variables: { from: selectedUser } })
        }
    }, [selectedUser])

    const { loading, data, error } = useQuery(GET_USERS)

    if(error){
        console.log(error)
    }
    if(data){
        console.log(error)
    }

    let usersMarkup
    if (!data || loading){
        usersMarkup = <p>Loading...</p>
    } else if (data.getUsers.length === 0) {
        usersMarkup = <p>No user have joined yet</p>
    } else if (data.getUsers.length > 0) {
        usersMarkup = data.getUsers.map((user) => (
            <div className="d-flex p-3" key={user.username} onClick={() => setSelectedUser(user.username)}>
                <Image src={user.imageUrl} roundedCircle className="mr-2"
                       style={{ width: 50,height: 50, objectFit: 'cover' }}
                       />
                <div>
                    <p className="text-success m-0">{user.username}</p>
                    <p className="font-weight-light m-0">
                        {user.latestMessage ? user.latestMessage.content : 'You are now connected!'}
                    </p>
                </div>
            </div>
        ))
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
            <Col xs={4} className="p-0 bg-secondary">
                {usersMarkup}
            </Col>
            <Col xs={8} cla>
                {messagesData && messagesData.getMessages.length > 0 ? (
                  messagesData.getMessages.map(message => (
                    <p key={message.uuid}>{message.content}</p>
                  ))
                ) : (
                    <p>You are now connected!</p>
                )}
            </Col>
        </Row>
        </Fragment>
    )
}