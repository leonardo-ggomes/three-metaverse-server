const express = require('express')
const {createServer} = require('node:http')
const app = express()
const server = createServer(app)
const { Server } = require('socket.io')
const io = new Server(server, {cors:'*'})

server.listen(3000,() => console.log('server running at http://localhost:3000'))

io.on('connection', (socket) => {
    console.log(`${socket.id} se conectou no servidor`)

    socket.broadcast.emit('joinInRoom', { 
        playerName: Math.random() * 10 +"name",
        id: socket.id
    } )


    socket.on('updatePosition', (positionPlayerData) => {
        socket.broadcast.emit('receivePlayerPosition', {...positionPlayerData})
    })

    socket.on('disconnect', () => {
        console.log('Usuário disconectado');
    });

})
