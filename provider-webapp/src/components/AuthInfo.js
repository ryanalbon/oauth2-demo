import React from 'react';
import { connect } from 'react-redux';

function AuthInfo({ token: { status, data } }) {
  return (
    <section>
      <h3>Auth Information</h3>
      <div>Status: {status}</div>
      <div>Access Token: {data && data.access_token}</div>
      <div>Token Type: {data && data.token_type}</div>
    </section>
  );
}

function mapStateToProps(state) {
  return {
    token: state.token,
  };
}

export default connect(mapStateToProps)(AuthInfo);
