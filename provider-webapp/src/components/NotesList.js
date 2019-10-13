import React from 'react';
import { connect } from 'react-redux';

import { getNotesStart } from '../actions/notes';

class NotesList extends React.Component {
  componentDidMount() {
    this.props.dispatch(getNotesStart());
  }

  render() {
    if (this.props.notes.status !== 'INITIALISED') {
      return 'Loading';
    }

    return (
      <div>{this.props.notes.data.map(note => <div>{note.body}</div>)}</div>
    );
  }
}

function mapStateToProps(state) {
  return {
    notes: state.notes,
  };
}

export default connect(mapStateToProps)(NotesList);
