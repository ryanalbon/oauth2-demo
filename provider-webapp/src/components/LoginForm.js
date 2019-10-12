import React from 'react';
import { connect } from 'react-redux';

import { loginStart } from '../actions/login';

class LoginForm extends React.Component {
  state = {
    email: '',
    password: '',
  };

  render() {
    return (
      <form onSubmit={e => this.onSubmit(e)}>
        <fieldset>
          <legend>Login</legend>
          <input
            type="email"
            placeholder="Email"
            value={this.state.email}
            onChange={e => this.setState({ email: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            value={this.state.password}
            onChange={e => this.setState({ password: e.target.value })}
          />
          <button type="submit">Login</button>
        </fieldset>
      </form>
    );
  }

  onSubmit(e) {
    e.preventDefault();
    const { email, password } = this.state;
    this.props.dispatch(loginStart({ email, password }));
  }
}

export default connect()(LoginForm);
