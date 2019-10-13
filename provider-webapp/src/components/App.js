import React from 'react';

import AuthInfo from './AuthInfo';
import JoinForm from './JoinForm';
import LoginForm from './LoginForm';
import NoteForm from './NoteForm';
import NotesList from './NotesList';

function App() {
  return (
    <main>
      <AuthInfo />
      <JoinForm />
      <LoginForm />
      <NoteForm />
      <NotesList />
    </main>
  );
}

export default App;
