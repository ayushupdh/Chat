const express = require('express')
const path  = require('path')
const http =  require('http')
const socketio = require('socket.io')
const Filter = require('bad-words')
const {generateMessage, generateLocationMessage} = require('./utils/messages')
const {addUser, removeUser, getUser, getUsersInRoom} = require('./utils/users')


const publicDir = path.join(__dirname,'../public')

const app = express()

//C reate a server because the socketio takes in server as argument
const server = http.createServer(app)
const io = socketio(server)

port = process.env.PORT || 3000

//Serve public directory
app.use(express.static(publicDir))

// let count = 0
io.on('connection',(socket)=>{
    console.log('New web socket connection');
    socket.on("joinRoom", ({username, room}, callback)=>{
        const {error, user}=  addUser({id: socket.id, username, room})
        if(error){
            return callback(error)
        }

        socket.join(user.room)
        socket.emit("message", generateMessage(user.room, 'Welcome!'))
        socket.broadcast.to(user.room).emit('message',generateMessage(user.room,`${user.username} has joined`))
        io.to(user.room).emit("roomData",{
            room:user.room,
            users: getUsersInRoom(user.room)
        })
        
        callback()


    })

     socket.on('sendMessage',(message, callback)=>{
        const user = getUser(socket.id)
        const filter = new Filter()
        if(filter.isProfane(message)){
            return callback('Profanity is not allowed')
        }
        io.to(user.room).emit("message",generateMessage(user.username, message))
        callback()
    })

    socket.on('sendLocation',(data, cb)=>{
        const user = getUser(socket.id)
        io.to(user.room).emit("locationMessage",generateLocationMessage(user.username, data))
        cb()
    })


    socket.on('disconnect',()=>{

        const user = removeUser(socket.id)
        if(user){
            console.log(user);
              io.to(user.room).emit('message',generateMessage(user.room,`${user.username} has left the room`))
              io.to(user.room).emit("roomData",{
                room:user.room,
                users: getUsersInRoom(user.room)
            })
        }
    })
})


//Start server
server.listen(port, ()=>{
    console.log('Server started on port: '+port);
})