Usage:
    To use this repo, run two seperate terminals for the server with "node server.js" and for the site with "npm start".
The site will be hosted on http://ec2-18-221-135-84.us-east-2.compute.amazonaws.com:3456/

    Just pick a random name and enter the chat room, duplicate names are not allowed. Every submit can be done by key enter
The bottom nav bar will show your username, roome name, and two drop downs for the rooms currently created and members
in the current room, and a button for creating new rooms. Room names do not allow duplicates, as well. When you click
the create room button, the left textbox is for roomname, and the right one is for password if not empty.
In rooms other than welcome, which have owner Z and everyone is welcomed, you can ban or kick members out of the room
as the owner. That will result in sending the member back to the welcome room and the only difference is that the
banned user can not enter back.

Known bugs:
    I did not use sessions, so do not refresh the page, or there will be several users with the same name. 
    also, you can ban yourself and kick yourself if you are the owner.

The creative portion is react and redux and react bootstrap, and a little bit of express and react router. In general,
the idea that everything is a html object is awsome. 

citation
    https://github.com/ruanyf/jstraining is where I started learning express and react.
    https://github.com/hshenCode/ChattingRoom has been a great reference.