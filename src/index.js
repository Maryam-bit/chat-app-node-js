const path = require("path")
const http = require("http")
const express = require("express")
const socketio = require("socket.io")
const Filter = require("bad-words")
const { generateMessage, generateLocationMessage } = require("./utils/messages")

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

  - connection and disconnect are default events
*/

io.on("connection", (socket) => {
    console.log("new web socket connection")

    socket.emit("message", generateMessage("Welcome!"))
    socket.broadcast.emit("message", generateMessage("A new user has joined"))

    socket.on("sendMessage", (message, callback) => {
        const filter = new Filter()
        
        if(filter.isProfane(message)) {
            return callback("profanity is not allowed!")
        }

        io.emit("message", generateMessage(message))
        callback()
    })

    socket.on("sendLocation", (coords, callback) => {
        io.emit("locationMessage", generateLocationMessage(`https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
        callback("Location Shared!")
    })

    socket.on("disconnect", () => {
        io.emit("message", generateMessage("A user has left!"))
    })
})

app.use(express.static(publicDirectoryPath))
server.listen(port, () => {
    console.log("server is running at port ", port)
})

