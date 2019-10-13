import React from 'react';
import { connect } from 'react-redux';

import { createNoteStart } from '../actions/notes';

class NoteForm extends React.Component {
  state = {
    body: '',
  };

  render() {
    return (
      <form onSubmit={e => this.onSubmit(e)}>
        <fieldset>
          <legend>New Note</legend>
          <input
            type="text"
            placeholder="Note body"
            value={this.state.body}
            onChange={e => this.setState({ body: e.target.value })}
          />
          <button type="submit">Save</button>
        </fieldset>
      </form>
    );
  }

  onSubmit(e) {
    e.preventDefault();
    const { body } = this.state;
    this.props.dispatch(createNoteStart({ body }));
    this.setState({ body: '' });
  }
}

export default connect()(NoteForm);
