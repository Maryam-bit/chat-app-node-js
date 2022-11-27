const socket = io()

const dropdown = document.querySelector("#dropdown")
const dropdownTemplate = document.querySelector("#dropdown-template").innerHTML

socket.on("currentRooms", (rooms) => {
    console.log("rooms", rooms)
    const html = Mustache.render(dropdownTemplate, {
        rooms
    })
    dropdown.innerHTML = html
})