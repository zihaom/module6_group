import React, { Component, PropTypes } from 'react';
import {  browserHistory } from 'react-router';

import {Form,Badge,Modal,Navbar,Nav,NavDropdown,FormControl,OverlayTrigger,InputGroup,Popover, Button,Container} from 'react-bootstrap';

var socketio = require('socket.io-client'); 

const Singleton = (function () {//from hshen
    let instance;

    function createInstance() {
        const socket = socketio.connect();
        return socket;
    }
    return {
        getInstance: function () {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        }
    };
})();


export class Login extends Component {

    constructor(props, context) {
        super(props, context);
        this.socket = Singleton.getInstance();
    }

    handleLogin(event) {
        if (event.which === 13) {
            event.preventDefault();
            const userName = event.target.value.trim();
            if (userName.length > 0) {
                console.log("hitlogin")
                this.socket.emit('login', userName);
            }  
        }
    }
    componentDidMount() {
        var p = this.props;
        this.socket.on('Login',function (data) {
            console.log(data);
            p.Login(data);
            browserHistory.push('/Chatroom/');
        });
    }
    render() {
        return (
            <Form>
                <Form.Label >Pick a username:</Form.Label>
                <Form.Control onKeyDown={this.handleLogin.bind(this)} id='textinput' placeholder="happy..." />
            </Form>
        );
    }
}


export class Chatroom extends Component {
    constructor(props, context) {
        super(props, context);
        this.socket = Singleton.getInstance();
    }

    componentWillMount() {
        var p = this.props;
        this.socket.on('newMessage',function (data) {
            console.log(data);
            p.newMessage(data);
        });
        this.socket.on('oneLogin',function (data) {
            console.log(data);
            p.oneLogin(data);
        });
        this.socket.on('oneGone',function (data) {
            console.log(data);
            p.oneGone(data);
        });
        this.socket.on('switchRoom',function (data) {
            console.log(data);
            p.switchRoom(data);
        });
        this.socket.on('changeRoom',function (data) {
            console.log(data);
            p.changeRoom(data);
        });
        this.socket.on('createRoom',function (data) {
            console.log(data);
            p.createRoom(data);
        });
        this.socket.on('err',function (data) {
            console.log(data);
            p.errMessage(data);
        });
        this.socket.on('passw',function (data) {
            console.log(data);
            p.pomptPass(data);
        });
    }

    sendMessage(newMessage) {
        if (newMessage.length !== 0) {
            this.props.sendMessage(newMessage);
            this.socket.emit('newMessage', {text:newMessage,room:this.props.roomData.name});
        }
    }
    newRoom(name,password) {
        if (name.length !== 0) {
            this.socket.emit('createRoom', {newRoom:name,password:password, prevRoom:this.props.roomData.name});
        }
    }
    handleSwitchroom(newRoom) {
        this.socket.emit('changeRoom', {newRoom:newRoom,prevRoom:this.props.roomData.name});
    }
    handleBanroom(userName) {
        this.socket.emit('banRoom', {banned:userName,prevRoom:this.props.roomData.name});
    }
    handleKickroom(userName) {
        this.socket.emit('kickRoom', {kicked:userName,prevRoom:this.props.roomData.name});
    }
    
    handlePass(event,newRoom) {
        if (event.which === 13) {
            event.preventDefault();
            var pass = document.getElementById("passinput").value;
            if (pass.length > 0) {
                console.log(newRoom);
                this.socket.emit('passw', {password:pass,newRoom:newRoom,prevRoom:this.props.roomData.name});
            }
        }
    }
    render() {
        if(this.props.needPass&& this.props.needPass!=="false"){
            console.log(this.props);
            const newRoom = this.props.needPass;
            return (
                <Modal.Dialog>
                <Modal.Header closeButton>
                    <Modal.Title>{this.props.needPass} is a private room, enter password</Modal.Title>
                </Modal.Header>
          
                <Modal.Body>
                    <p><input type="password" onKeyDown={event =>this.handlePass(event,newRoom)} id='passinput' placeholder="12345678..." /></p>
                </Modal.Body>
                </Modal.Dialog>
            )
          }
        return (
        <div><Rooms handleBanroom={this.handleBanroom.bind(this)} handleKickroom={this.handleKickroom.bind(this)} owner={this.props.roomData.owner} userName={this.props.userName} userCount={this.props.userCount} roomName={this.props.roomData.name}  handleSwitchroom={this.handleSwitchroom.bind(this)} newRoom={this.newRoom.bind(this)} members={this.props.roomData.members} roomLst={this.props.roomLst} />
        <MessageInput sendMessage={this.sendMessage.bind(this)} />

        <Container fluid={true}>
            <ul className="messages">
                {this.props.messages.map( (message, index) =>
                    <MessageItem message={message} key={index}/>
                )}
            </ul>
        </Container>
        </div>
        );
    }
}

class Rooms extends React.Component {
    handleNew(event) {
        if (event.which === 13) {
            event.preventDefault();
            var doc = document.getElementById("roominput");
            var pass = document.getElementById("roompass");
            const name = doc.value.trim();
            const passw = pass.value.trim();
            if (name.length > 0) {
                this.props.newRoom(name,passw);
                doc.value = '';
                pass.value = '';
            }
        }
    }
    handleSwitch(room) {
        console.log(room);
        var newRoom = room;
        if (newRoom!==this.props.roomName)
            this.props.handleSwitchroom(newRoom);
    }
    handleBan(member) {
        var userName = member;
        this.props.handleBanroom(userName);
    }
    handleKick(member) {
        var userName = member;
        this.props.handleKickroom(userName);
    }
    render() {
    const popover = (
        <Popover id="popover-basic">
          <Popover.Title as="h3">Room name and password</Popover.Title>
          <Popover.Content>
          <InputGroup className="mb-3">
            <FormControl id="roominput" onKeyDown={this.handleNew.bind(this)} placeholder="fancy.."/>
            <FormControl type="password" id="roompass" onKeyDown={this.handleNew.bind(this)} />
            </InputGroup>
          </Popover.Content>
        </Popover>
      );
    const name = this.props.roomName;
    return (
        <Navbar fixed="bottom" bg="light" expand="lg">
        <Navbar.Brand>React-Chatroom</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Nav className="mr-auto">
            <Nav.Link >Hi, {this.props.userName}</Nav.Link>
            <Nav.Link >in room"{name}"</Nav.Link>
            <NavDropdown drop="up" title="Rooms" id="basic-nav-dropdown">
            {
                this.props.roomLst.map( (room, index) =><NavDropdown.Item onClick={()=>this.handleSwitch(room)} key={index}>{room}</NavDropdown.Item>)
            }
            </NavDropdown>
            <NavDropdown drop="up" title="Members" id="basic-nav-dropdown">
                {this.props.userName===this.props.owner && this.props.roomName !== "welcome"?
                   this.props.members.map( (member, index) =><div key={index}><NavDropdown.Item key={index}>{member} <Badge onClick={()=>this.handleBan(member)} variant="danger">Ban</Badge><Badge onClick={()=>this.handleKick(member)} variant="datk">kick</Badge></NavDropdown.Item></div>)
                   :this.props.members.map( (member, index) =><NavDropdown.Item key={index}>{member}</NavDropdown.Item>)
                }
            </NavDropdown>
            <Form inline>   <OverlayTrigger trigger="click" placement="top" overlay={popover}>
                <Button className="mr-auto" variant="outline-dark">New room</Button>
              </OverlayTrigger> </Form>
            </Nav>
        </Navbar>
    );
  }
}

class MessageItem extends React.Component {
    render() {
        const { message } = this.props;
        switch (message.type) {
            case 'user':
                const userNameColor = '#f78b00';
                return (
                    <div>
                        <span style={{color: userNameColor}}>{message.userName + ": "}</span>
                        <span >{message.text}</span></div>
                );
            case 'err':
                const Color = '#ff0000';
                return (
                    <div>
                        <span style={{color: Color}}>{message.text}</span>
                    </div>
                );
            case 'sys':
                return (
                    <li className="system-message">
                        {message.text}
                    </li>
                );
            default:
                return;
        }
    }
}

class MessageInput extends Component {
    constructor(props, context) {
        super(props, context);
    }

    handleSubmit(event) {
        if (event.which === 13) {
            event.preventDefault();
            var doc = document.getElementById("textinput");
            const text = doc.value.trim();
            if (text.length > 0) {
                this.props.sendMessage(text);
                doc.value = '';
            }
        }
    }

    render() {
        return (
            <InputGroup >
            <InputGroup.Prepend>
              <InputGroup.Text>Say Hi to the Room</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl onKeyDown={this.handleSubmit.bind(this)} id='textinput' placeholder="Say something..." as="textarea" aria-label="With textarea" />
          </InputGroup>
        );
    }
}
