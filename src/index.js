const path = require("path")
const http = require("http")
const express = require("express")
const socketio = require("socket.io")

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, '../public')

// server (emit) -> client (receive) - count update
// client (emit) -> server (receive) - increment

io.on("connection", (socket) => {
    console.log("new web socket connection")

    socket.emit("message", "Welcome!")

    socket.on("sendMessage", (message) => {
        io.emit("message", message)
    })
})

app.use(express.static(publicDirectoryPath))
server.listen(port, () => {
    console.log("server is running at port ", port)
})