const rooms = []

const addRoom = (roomname) => {
    // check existing room
    const existingRoom = rooms.find((room) => room.roomname === roomname)

    if (existingRoom) {
        existingRoom.number++;
        return rooms
    }
    rooms.push({ roomname: roomname, number: 1 })
    return rooms
}

const getRooms = () => {
    return rooms
}

const recountRoom = (roomname) => {
    const findRoom = rooms.find((room) => room.roomname === roomname)
    findRoom.number--;

    if(findRoom.number == 0){
        const index = rooms.indexOf(findRoom)
        rooms.splice(index, 1)
        return rooms;
    }
    return roomss
}
module.exports = {
    addRoom,
    getRooms,
    recountRoom
}