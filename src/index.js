const path = require("path")
const http = require("http")
const express = require("express")
const socketio = require("socket.io")
const Filter = require("bad-words")
const { generateMessage, generateLocationMessage } = require("./utils/messages")
const { addUser, removeUser, getUsersInRoom, getUser } =  require("./utils/users")

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, '../public')

// server (emit) -> client (receive) - count update
// client (emit) -> server (receive) - increment

/* 
 events
  - socket.emit => to emit to that particular connection
  - socket.broadcast.emit => to emit to everyone except the current client connection
  - io.emit => to emit to all to connections

  socket.join => to join the rooms
  io.to.emit > to emit an event to everyone for specific room
  socket.boradcast.to.emit > send event to everyone except the current client for specific room

  - connection and disconnect are default events
*/

io.on("connection", (socket) => {
    console.log("new web socket connection")

    socket.on("join", (options, callback) => {
        const { error, user } = addUser({ id: socket.id, ...options })
        if(error) {
            return callback(error)
        }
        socket.join(user.room)
        socket.emit("message", generateMessage("Admin", "Welcome!"))
        socket.broadcast.to(user.room).emit("message", generateMessage("Admin", `${user.username} has joined!`))
        callback()
    })

    socket.on("sendMessage", (message, callback) => {
        const user = getUser(socket.id)
        const filter = new Filter()
        
        if(filter.isProfane(message)) {
            return callback("profanity is not allowed!")
        }

        io.to(user.room).emit("message", generateMessage(user.username, message))
        callback()
    })

    socket.on("sendLocation", (coords, callback) => {
        const user = getUser(socket.id)
        io.to(user.room).emit("locationMessage", generateLocationMessage(user.username, `https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
        callback("Location Shared!")
    })

    socket.on("disconnect", () => {
        const user = removeUser(socket.id)
        if(user) {
            io.to(user.room).emit("message", generateMessage("Admin", `${user.username} has left!`))
        }
    })
})

app.use(express.static(publicDirectoryPath))
server.listen(port, () => {
    console.log("server is running at port ", port)
})

