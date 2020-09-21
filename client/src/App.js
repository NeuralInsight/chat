import React from 'react';
import './App.scss';
import { Container } from 'react-bootstrap';
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import ApolloProvide from "./ApolloProvide";
import { BrowserRouter, Route, Switch } from 'react-router-dom';

function App() {


  return (
      <ApolloProvide>
          <BrowserRouter>
            <Container className="pt-5">
                <Switch>
                <Route path="/register" component={Register} />
                <Route exact path="/" component={Home} />
                <Route path="/login" component={Login} />
                </Switch>
            </Container>
          </BrowserRouter>
      </ApolloProvide>
  );
}

export default App;
