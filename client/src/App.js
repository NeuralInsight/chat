import React from 'react';
import './App.scss';
import { Container } from 'react-bootstrap';
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import ApolloProvide from "./ApolloProvider";
import { BrowserRouter, Switch } from 'react-router-dom';
import { AuthProvider } from "./context/auth";
import DynamicRoute from "./util/DynamicRoute";

function App() {


  return (
      <ApolloProvide>
          <AuthProvider>
          <BrowserRouter>
            <Container className="pt-5">
                <Switch>
                    <DynamicRoute exact path="/" component={Home} authenticated/>
                    <DynamicRoute path="/register" component={Register} guest/>
                    <DynamicRoute path="/login" component={Login} guest/>
                </Switch>
            </Container>
          </BrowserRouter>
          </AuthProvider>
      </ApolloProvide>
  );
}

export default App;
