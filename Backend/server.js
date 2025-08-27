require('dotenv').config()
const app = require('./src/app');


const { createServer } = require("http");
const { Server } = require("socket.io");
const generateContent = require('./src/services/ai.services');

const httpServer = createServer(app);
const io = new Server(httpServer, { 
  cors:{
    origin:"http://localhost:5173"
  }
 });

io.on("connection", (socket) => {
  console.log('Connection made');

  socket.on('disconnect',()=>{
    console.log('Server disconnected');
  })

  const chatHistory = [

  ]

 socket.on('ai-message', async(data)=>{
    console.log(data);

    chatHistory.push({
      role:"user",
      parts:[{text:data}]
    });
    
    const response = await generateContent(chatHistory);
    console.log('AI - response',response);

    chatHistory.push({
      role:"model",
      parts:[{text:response}]
    });

    socket.emit('ai-response',{response})
    
 })
  
});

httpServer.listen(3000,()=>{
    console.log('Server Started at Port 3000');
})