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
    
    socket.join('room1')
    socket.in('room1').emit('joinInRoom', players)


    socket.on('updatePosition', (positionPlayerData) => {
        
        players[socket.id] = {
            ...positionPlayerData,
            id: socket.id
        }

        socket.to('room1').emit('receivePlayerPosition', players[socket.id])
    })

   
    socket.on('disconnect', () => {
        console.log('Usuário disconectado');
        socket.to('room1').emit('exitTheRoom', socket.id)
        delete players[socket.id]
    });

})
