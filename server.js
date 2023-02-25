const fs = require('fs')
const key = fs.readFileSync(
  '/Users/admin/localcert/localhost/localhost.decrypted.key'
)
const cert = fs.readFileSync('/Users/admin/localcert/localhost/localhost.crt')

const express = require('express')
const app = express()
const https = require('https')
// const server = require('http').createServer(app)
const server = https.createServer({ key, cert }, app)
const io = require('socket.io')(server)
const { v4: uuidV4 } = require('uuid')

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.redirect(`/${uuidV4()}`)
})

app.get('/:room', (req, res) => {
  res.render('room', { roomId: req.params.room })
})

io.on('connection', (socket) => {
  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId)
    socket.to(roomId).emit('user-connected', userId)
    socket.on('disconnect', () => {
      socket.to(roomId).emit('user-disconnected', userId)
    })
  })
})

server.listen(4000)
