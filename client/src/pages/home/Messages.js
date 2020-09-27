import React, {Fragment, useEffect, useState} from "react";
import {Col, Form} from "react-bootstrap";
import { gql, useLazyQuery, useMutation } from "@apollo/client";
import { useMessageDispatch, useMessageState } from '../../context/message';
import Message from "./Message";

const SEND_MESSAGE = gql`
    mutation sendMessage($to: String!, $content: String!){
        sendMessage(to: $to, content: $content){
            uuid from to content createdAt
        }
    }
`

const GET_MESSAGES = gql`
    query getMessages($from: String!){
        getMessages(from: $from){
            uuid
            from
            to
            content
            createdAt
        }
    }
`


export default function Messages(){
    const { users } = useMessageState()
    const dispatch = useMessageDispatch()
    const [content, setContent] = useState('')
    const selectedUser = users?.find( u => u.selected === true)
    const messages = selectedUser?.messages

    const [getMessages,
        { loading: messagesLoading, data: messagesData },
    ] = useLazyQuery(GET_MESSAGES)

    const [sendMessage] = useMutation(SEND_MESSAGE, {
        onError: err => console.log(err)
    })

    // if selectedUser changed this function will be effected(executed)

    useEffect(() => {
        if(selectedUser && !selectedUser.messages){
            getMessages({ variables: { from: selectedUser.username } })
        }
    }, [selectedUser])

    // if messagesData changed this function will be effected(executed)
    useEffect(() => {
        if(messagesData){
            dispatch({ type: 'SET_USER_MESSAGES', payload: {
                username: selectedUser.username,
                messages: messagesData.getMessages
            }})
        }
    }, [messagesData])

    const submitMessage = e => {
        e.preventDefault()

        if (content.trim() === '' || !selectedUser ) return
        
        //mutation for sending message
        sendMessage({ variables: { to: selectedUser.username, content } })
    }

    let selectedChatMarkup
     if(!messages && !messagesLoading){
         selectedChatMarkup = <p className="info-text" >Select a Friend</p>
     } else if(messagesLoading){
         selectedChatMarkup = <p className="info-text" >Loading ...</p>
     }else if(messages.length > 0){
         selectedChatMarkup = messages.map((message,index) => (
             <Fragment key={message.uuid}>
             <Message message={message} />
                 {index === message.length -1 && (
                     <div className="invisible">
                         <hr className="m-0" />
                     </div>
                 )}
             </Fragment>
         ))
     }else if(messages.length === 0){
         selectedChatMarkup = <p className="info-text" >You are now connected!</p>
     }

    return (
        <Col xs={8}>
            < div className = "messages-box d-flex flex-column-reverse" >
                {selectedChatMarkup}
            </div>
            <div>
            <Form onSubmit={submitMessage}>
                <Form.Group className="d-flex align-items-center">
                    <Form.Control
                        type="text"
                        className="message-input rounded-pill bg-secondary border-0"
                        placeholder="Type a Message ..."
                        value={content}
                        onChange={e => setContent(e.target.value)}
                        />
                        <i className="fas fa-paper-plane fa-2x text-primary ml-2"
                            onClick={submitMessage}
                            role="button">
                        </i>
                </Form.Group>
                </Form>
            </div>
        </Col>
    )
}