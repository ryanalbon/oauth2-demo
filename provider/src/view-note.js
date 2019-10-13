function viewNote({ _id, userID, ...rest }) {
  return {
    id: String(_id),
    ...rest,
  };
}

module.exports = viewNote;
