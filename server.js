const express = require('express')
const {createServer} = require('node:http')
const app = express()
const server = createServer(app)
const { Server } = require('socket.io')
const io = new Server(server, {cors:'*'})

server.listen(3000,() => console.log('server running at http://localhost:3000'))

const players = {}

io.on('connection', (socket) => {
    console.log(`${socket.id} se conectou no servidor`)

    players[socket.id] = { 
        playerName: Math.random() * 10 +"name",
    } 

    socket.broadcast.emit('joinInRoom', players)


    socket.on('updatePosition', (positionPlayerData) => {
        
        players[socket.id] = {
            ...positionPlayerData,
            id: socket.id
        }

        socket.broadcast.emit('receivePlayerPosition', players[socket.id])
    })

   
    socket.on('disconnect', () => {
        console.log('Usuário disconectado');
        socket.emit('exitTheRoom', socket.id)
        delete players[socket.id]
    });

})
