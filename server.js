const cors = require("cors")
const fs = require('fs')
const path = require("path")
const express = require('express')
const app = express()
const https = require('https')
const server = require('http').Server(app)
// const server = https.createServer({
//   key : fs.readFileSync(path.join(__dirname,'cert','key.pem')),
//   cert : fs.readFileSync(path.join(__dirname, 'cert', 'cert.pem'))
// }, app)
const io = require('socket.io')(server)
const { v4: uuidV4 } = require('uuid')
app.use(cors())
app.set('view engine', 'ejs')

app.use(express.static('public'))

app.get('/', (req, res) => {
  res.redirect(`/${uuidV4()}`)
})

app.get('/:room', (req, res) => {
  res.render('room', { roomId: req.params.room })
})

io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
    socket.join(roomId)
    socket.to(roomId).emit('user-connected', userId)
    
      socket.on('disconnect', () => {
      socket.to(roomId).emit('user-disconnected', userId)
    })
  })
})

server.listen(4000,()=>{
  console.log("Secure server listening on port 4000");
} )
