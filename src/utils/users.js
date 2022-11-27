const users = []

// addUser, removeUser, getUser, getUsersInRoom

const addUser = ({ id, username, room }) => {
    // clean the data
    username = username.trim().toLowerCase();
    room = room.trim().toLowerCase()

    // validate the data
    if(!username || !room) {
        return {
            error: "Username and room are required!"
        }
    }

    // check for existing user
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    })

    // validate username
    if(existingUser) {
        return {
            error: "Username is in use!"
        }
    }

    // store user
    const user = { id, username, room }
    users.push(user)
    return { user }
}

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id)

    if(index != -1) {
        // returning removed user
        return users.splice(index, 1)[0]
    }
}

addUser({
    id: 22,
    username: "Maryam",
    room: "south"
})

console.log(users)
// [ { id: 22, username: 'maryam', room: 'south' } ]

 const removeduser = removeUser(22)
 console.log(removeduser)
 console.log(users)
// { id: 22, username: 'maryam', room: 'south' }
// []