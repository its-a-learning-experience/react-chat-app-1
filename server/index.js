const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const router = require('./router');
const { addUser, removeUser, getUser, getUsersInRoom }= require('./users');

const PORT = process.env.port || 5000;

const app = express();
const server = http.createServer(app);
const io = socketio(server);

io.on('connection', (socket) => {
    socket.on('join', ({name, room}, callback) => {
        const { error, user } = addUser({ id: socket.id, name, room });

        if (error) {
            // Client side will have access to this callback function with object {error: '...'}
            return callback( error );
        }

        // user joins the room
        socket.join(user.room);

        // sends message to the person joining the room
        socket.emit('message', { user: 'admin', text: `${user.name}, welcome to the room ${user.room}` });

        // sends the messages to all users in that room
        socket.broadcast.to(user.room).emit('message', {user: 'admin', text: `${user.name}, has joined!`});

        io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });

        callback();
    });

    socket.on('sendMessage', (message, callback) => {
        // socket.id is unique to each connection, hence to each user
        const user = getUser(socket.id);

        io.to(user.room).emit('message', { user: user.name, text: message });
        io.to(user.room).emit('roomData', { room: user.room, text: getUsersInRoom(user.room) });

        callback();
    });

    socket.on('disconnect', () => {
        const user = removeUser(socket.id);
        if(user) {
            io.to(user.room).emit('message', { user: 'admin', text: `${user.name} has left.` });
        }
    });
});

app.use(router);

server.listen(PORT , () => console.log(`Server has started on port ${PORT}`));