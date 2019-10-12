function dao(db) {
  return {
    users: () => db.collection('users'),
  };
}

module.exports = dao;
