import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import AuthInfo from './AuthInfo';
import Authorize from './Authorize';
import JoinForm from './JoinForm';
import LoginForm from './LoginForm';
import NoteForm from './NoteForm';
import NotesList from './NotesList';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/authorize">
          <Authorize />
        </Route>
        <Route path="/">
          <AuthInfo />
          <JoinForm />
          <LoginForm />
          <NoteForm />
          <NotesList />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
