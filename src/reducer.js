import update from 'react-addons-update'; 

const initialState = {
    messages: [{type: 'sys',
                text: 'Welcome to our chatting room!'}],
    userCount:0,
    roomLst:[],
    roomData:{owner:"",members:[]},
    userName:"",
    needPass:"false",
    Login:false
};

export default function reducer(state = initialState, action) {
    var i = 0;
    console.log(action);
    switch (action.type) {
        case 'newMessage':
            const data = action.data;
            if (data.room === state.roomData.name){
                return {...state,
                    messages: [...state.messages, {
                        type: 'user',
                        text: data.text,
                        userName: data.userName
                    }]
                };
            }
            return state;

        case 'Login':
            if(state.Login === true){
                return state;
            }
            else{
                state.Login = true;
                return {...state,
                    roomData:action.data.roomData,
                    roomLst:action.data.roomLst,
                    userName:action.data.userName,
                };
            }

        case 'oneLogin':
            if (action.data.room === state.roomData.name){
                return {...state,
                    messages: [...state.messages, {
                        type: 'sys',
                        text: `${action.data.userName} joined room!`
                    }],
                    userCount:action.data.userCount,
                };            
            }            
            return state;

        case 'oneGone':
            for ( i = 0; i < state.roomData.members.length; i++) {
                if (action.data.userName === state.roomData.members[i]){
                    var newroomData = update(state.roomData,{members:{$set: state.roomData.members.splice(i, 1)}});
                    return {...state,
                        userCount:action.data.userCount,
                        roomData:newroomData,
                        messages: [...state.messages, {
                            type: 'sys',
                            text: `${action.data.userName} left the room!`
                        }]
                    }
                }               
            }
            return {...state,
                userCount:action.data.userCount,
            };

        case 'passw':      
            return {...state,
                needPass:action.data.roomName,
            };

        case 'switchRoom':      
            return {...state,
                roomData:action.data.roomData,
                needPass:"false",
            };

        case 'changeRoom':
            if (action.data.prevRoom === state.roomData.name){
                for ( i = 0; i < state.roomData.members.length; i++) {
                    if (action.data.userName === state.roomData.members[i]){
                        newroomData = update(state.roomData,{members:{$set: state.roomData.members.splice(i, 1)}});
                        return {...state,
                            roomData:newroomData,
                            messages: [...state.messages, {
                                type: 'sys',
                                text: `${action.data.userName} left the room!`
                            }]
                        };
                    }               
                }
            }
            if (action.data.newRoom === state.roomData.name){
                newroomData = update(state.roomData,{members:{$push:[action.data.userName]}});
                return {...state,
                    roomData:newroomData,
                    messages: [...state.messages, {
                        type: 'sys',
                        text: `${action.data.userName} joined the room!`
                    }]
                };
            }
            return state;

        case 'createRoom':
            if (action.data.prevRoom === state.roomData.name){
                for ( i = 0; i < state.roomData.members.length; i++) {
                    if (action.data.userName === state.roomData.members[i]){
                        newroomData = update(state.roomData,{members:{$set: state.roomData.members.splice(i, 1)}});
                        return {...state,
                            roomData:newroomData,
                            roomLst:action.data.roomLst,
                            messages: [...state.messages, {
                                type: 'sys',
                                text: `${action.data.userName} left and went for his/her new room! Check it out`
                            }]
                        };
                    }               
                }
            }
            return {...state,
                roomLst:action.data.roomLst
            };

        case 'err':
            var errMessage = ['You are not logged in!','Username already selected, pick another one!','Room name already selected, pick another one!',"you are not welcomed in the previous room","Password not correct"];

            return {...state,
                needPass:"false",

                messages: [...state.messages, {
                        type: 'err',
                        text: errMessage[action.data.errNum],
                }]
            };

        case 'send':
            return state;

        default:
            return state;
    }
}
