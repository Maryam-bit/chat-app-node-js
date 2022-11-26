const socket = io()

socket.on("countUpdated", (count) => {
    console.log("THe count has been updated ", count)
})

document.querySelector("#increment").addEventListener("click", () => {
    console.log("Button clicked")
    socket.emit("increment")
})