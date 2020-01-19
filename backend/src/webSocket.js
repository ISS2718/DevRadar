const socketio = require('socket.io')
const parseStringAsArray = require('./utils/parseStirngAsArray')
const calculateDistance = require('./utils/calculateDistance')

let io
const connections = []

exports.setupWebsocket = (server) => {

    io = socketio(server);

    io.on('connection', socket => {
      
        const  { latitude, longitude, techs } = socket.handshake.query

        connections.push({
            id: socket.id,
            coordinates: {
                latitude: Number(latitude),
                longitude: Number(longitude)
            },
            techs: parseStringAsArray(techs)
        })
    })
}

exports.findConnections = (coordinates, techs) => {

    return connections.filter(connection => {
        return calculateDistance(coordinates, connection.coordinates) < 10
            && connection.techs.some(item => techs.includes(item))
    })
}

exports.sendMenssage = (to, menssage, data) => {
    
    to.forEach(connection => {
        io.to(connection.id).emit(menssage, data)
    })
}