function dao(db) {
  return {
    notes: () => db.collection('notes'),
    oauth2AuthorizationCodes: () => db.collection('oauth2_authorization_codes'),
    oauth2Clients: () => db.collection('oauth2_clients'),
    users: () => db.collection('users'),
  };
}

module.exports = dao;
