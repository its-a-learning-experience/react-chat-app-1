const users = [];

const addUser = ({ id, name, room}) => {
    // If room = Hello World, we actually want helloworld
    // trim() gets rid of white spaces
    name = name.trim().toLowerCase();
    room = room.trim().toLowerCase();

    // need to check if the user already exists in the room
    const existingUser = users.find((user) => user.room === room && user.name === name);
    if(existingUser) {
        return { error: 'Username is taken' };
    }

    const user = { id, name, room};
    users.push(user);

    return { user };
};

const removeUser = (id) => {
    // go through the users array and find a user with that specific id
    const index = users.findIndex((user) => user.id === id);

    // if it finds the user:
    if(index !== -1) {
        // remove the user
        // since splice returns an array, [0] is the first user in that array
        return users.splice(index, 1)[0];
    }
}

const getUser = (id) => {
    return users.find((user) => user.id === id);
}

const getUsersInRoom = (room) => {
    // returns an array with only users with user.room === room
    return users.filter(user => user.room === room);
}

module.exports = { addUser, removeUser, getUser, getUsersInRoom };