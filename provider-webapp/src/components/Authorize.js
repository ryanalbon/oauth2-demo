import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';

class Authorize extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      client: undefined,
    };
  }

  async componentDidMount() {
    const query = new URLSearchParams(window.location.search);
    const clientID = query.get('client_id');
    const response = await axios.get(`/oauth2/clients/${clientID}`);
    this.setState({ client: { ...response.data } });
  }

  render() {
    if (!this.state.client) {
      return 'Loading';
    }

    return (
      <form onSubmit={e => this.onSubmit(e)}>
        <fieldset>
          <legend>Authorize</legend>
          <div><input type="text" value={this.state.client.id} readOnly /></div>
          {this.state.client.scope.map(scope => <div key={scope}>{scope}</div>)}
          <button type="submit">Authorize</button>
        </fieldset>
      </form>
    );
  }

  async onSubmit(e) {
    e.preventDefault();
    const authorization = `Bearer ${this.props.token.data.access_token}`;
    const headers = { authorization };
    const payload = { clientID: this.state.client.id };
    const response = await axios.post('/oauth2/authorize', payload, { headers });

    window.location = `${response.data.redirectURL}?code=${response.data.code}`;
  }
}

function mapStateToProps(state) {
  return {
    token: state.token,
  };
}

export default connect(mapStateToProps)(Authorize);
