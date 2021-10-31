let userList = [{

        id: "1",
        username: "daiphong",
        room: "js"
    },
    {
        id: "2",
        username: "phongnha",
        room: "php"
    }
]

const getUserList = (room) => {
    return userList.filter((user) => user.room === room)
};

const addUser = (newUser) => {
    return userList = [...userList, newUser];
}

const removeUser = (id) => {
    return userList.filter((user) => {
        user.id !== id
    });

}
module.exports = {
    getUserList,
    addUser,
    removeUser
}