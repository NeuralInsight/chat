import React from 'react';
import './App.scss';
import { Container } from 'react-bootstrap';
import Register from "./pages/Register";
import ApolloProvide from "./ApolloProvide";

function App() {


  return (
      <ApolloProvide>
      <Container className="pt-5">
        <Register />
      </Container>
      </ApolloProvide>
  );
}

export default App;
