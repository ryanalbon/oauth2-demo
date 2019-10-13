function dao(db) {
  return {
    notes: () => db.collection('notes'),
    oauthClients: () => db.collection('oauth_clients'),
    users: () => db.collection('users'),
  };
}

module.exports = dao;
