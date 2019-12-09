import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import {bindActionCreators} from 'redux';
import {Login} from './componets';

function youLogin(data) {
  return {
      type: 'Login',
      data
  }
}
const mapStateToProps=(state,ownProps) => {
  return {
    Login: state.Login,
  };
}

const mapDispatchToProps=(dispatch,ownProps) => {
  return bindActionCreators({
    Login: youLogin,
  },dispatch);
}
class Logincontainer extends Component {
  render() {
      return (
          <Login {...this.props} />
      );
  }
}
// Connected Component
export default connect(mapStateToProps, mapDispatchToProps)(Logincontainer);