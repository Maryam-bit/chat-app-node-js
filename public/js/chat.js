
const socket = io()

// server (emit) -> client (receive) --acknowledgement --> server
// client (emit) -> server (receive) --acknowledgement --> client

document.querySelector("#message-form").addEventListener("submit", (e) => {
    e.preventDefault();

    // const message = document.querySelector("input").value
    const message = e.target.elements.message.value

    socket.emit("sendMessage", message, (error) => {
        if(error) {
            return console.log(error)
        }
        console.log("Message delivered!")
    })
})

socket.on("message", (message) => {
    console.log(message)
})

document.querySelector("#send-location").addEventListener("click", () => {
    if(!navigator.geolocation) {
        return alert("Geolocation is not supported by your browser")
    }
    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit("sendLocation", {latitude: position.coords.latitude, longitude: position.coords.longitude}, (message) => {
            console.log(message)
        })
    }) 
})