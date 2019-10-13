import React from 'react';
import axios from 'axios';

function App() {
  const query = new URLSearchParams(window.location.search);

  if (query.has('code')) {
    const code = query.get('code');
    axios.post('/oauth2/callback', { code });
    return 'Done!';
  }

  return (
    <main>
      <a href="http://oauth2-provider.localhost:3000/authorize?client_id=5da32fda8023c689fc2f0dcc">Connect with http://oauth2-provider.localhost:3000!</a>
    </main>
  );
}

export default App;
