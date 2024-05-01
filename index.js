const express = require('express')
const cors = require('cors')
const http = require('http')
const port = 3001
const {Server, Socket} = require('socket.io')
const app = express()
app.use(cors({
    origin:"*"
}))
app.use(express.json())
const server = http.createServer(app)
const io = new Server(server,{
    cors:{
        origin:'*'        
    },
   
})
// io.on('create_room',(socket)=>{
//     const createId = socket.requestId
    
    
//     socket.on()
    
// })
const userId = new Set()

io.on('connection',async (socket)=>{
    // console.log(socket)
    userId.add(socket.id)
    socket.on('connect_with_user', async (data)=>{        
        const anotherUserId = data.reqId
        if(userId.has(anotherUserId)){
            socket.to(anotherUserId).emit('opponent_id',{opponent:socket.id,color:"w"})
            socket.emit('opponent_id',{opponent:anotherUserId,color:"b"})
            userId.delete(socket.id)
            userId.delete(anotherUserId)
        }else{
            socket.emit('opponent_id',{opponent:"Invalid"})
        }
        
    })
    // {message:message,opponent:id}
    socket.on('send_message',async(data)=>{
        console.log(data)
        const message = data.message
        const opponentId = data.opponent
        // console.log(opponentId + " "+socket.id)
        socket.to(opponentId).emit('receive_message',{message:message,id:socket.id})
        // console.log(response)
    })
    socket.on('share_game_details',async (data)=>{
        const opponentId = data.opponent
        // console.log(data)
        socket.to(opponentId).emit('receive_game_details',data.currFen)
    })
    
    
})
server.listen(port,(req,res)=>{
    console.log("App is Listening to port : 3001")
})
