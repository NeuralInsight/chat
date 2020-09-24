import React, { useEffect } from "react";
import {Col} from "react-bootstrap";
import { gql, useLazyQuery } from "@apollo/client";
import { useMessageDispatch, useMessageState } from '../../context/message';

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
    const selectedUser = users?.find( u => u.selected === true)
    const messages = selectedUser?.messages

    const [getMessages,
        { loading: messagesLoading, data: messagesData },
    ] = useLazyQuery(GET_MESSAGES)

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

    let selectedChatMarkup
     if(!messages && !messagesLoading){
         selectedChatMarkup = <p>Select a Friend</p>
     } else if(messagesLoading){
         selectedChatMarkup = <p>Loading ...</p>
     }else if(messages.length > 0){
         selectedChatMarkup = messages.map((message) => (
             <p key={message.uuid}>{message.content}</p>
         ))
     }else if(messages.length === 0){
         selectedChatMarkup = <p>You are now connected!</p>
     }

    return (
        <Col xs={8}>
            {selectedChatMarkup}
        </Col>
    )
}