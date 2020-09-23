import React from "react";
import {
    ApolloClient,
    createHttpLink,
    InMemoryCache,
    ApolloProvider as Provider

} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
    uri: 'http://localhost:4000',
});

const authLink = setContext((_, { headers }) => {
    // get the authentication token from local storage if it exists
    const token = localStorage.getItem('token');
    // return the headers to the context so httpLink can read them
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : "",
        }
    }
});

const client = new ApolloClient({
    link: authLink.concat(httpLink),
    //TODO: set option for caching to not cache the getUsers
    cache: new InMemoryCache(),
});

export default function ApolloProvider(props) {
    return <Provider client={client} {...props} />
}