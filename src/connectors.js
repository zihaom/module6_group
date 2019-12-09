import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import {bindActionCreators} from 'redux';
import {Chatroom} from './componets';

//action creators
function sendMessage(message) {
    return {
        type: 'send',
        message
    }
}

function newMessage(data) {
    return {
        type: 'newMessage',
        data
    }
}

function oneLogin(data) {
    return {
        type: 'oneLogin',
        data
    }
}

function oneGone(data) {
    return {
        type: 'oneGone',
        data
    }
}

function switchRoom(data) {
    return {
        type: 'switchRoom',
        data
    }
}
function changeRoom(data) {
    return {
        type: 'changeRoom',
        data
    }
}
function createRoom(data) {
    return {
        type: 'createRoom',
        data
    }
}
function errMessage(data) {
    return {
        type: 'err',
        data
    }
}
function pomptPass(data) {
    return {
        type: 'passw',
        data
    }
}
// Map Redux state to component props
const mapStateToProps=(state,ownProps) => {
    return {
        messages: state.messages,
        roomLst: state.roomLst,
        userCount: state.userCount,
        roomData: state.roomData,
        userName: state.userName,
        needPass:state.needPass
    };
  }
  
  // Map Redux actions to component props
const mapDispatchToProps=(dispatch,ownProps) => {
    return bindActionCreators({
        newMessage: newMessage,
        sendMessage: sendMessage,
        oneLogin: oneLogin,
        oneGone: oneGone,
        switchRoom: switchRoom,
        createRoom: createRoom,
        changeRoom: changeRoom,
        errMessage: errMessage,
        pomptPass:pomptPass,
    },dispatch);
  }
  
class Chatroomcontainer extends Component {
    render() {
        return (
            <Chatroom {...this.props} />
        );
    }
}
  // Connected Component
export default connect(mapStateToProps, mapDispatchToProps)(Chatroomcontainer);

