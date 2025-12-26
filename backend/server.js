require("dotenv").config()
const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const main = require("./src/service/ai.service")
const port = process.env.PORT || 4000 

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ["https://ai-chatbot-12w1.vercel.app"]
  }
});

const chatHistory = [
    
]

io.on("connection", (socket) => {
    console.log("Connected");

    socket.on("disconnect", (reason) => {
        console.log("Disconnect");
    });

    socket.on("ai-message", async (data) => {
        chatHistory.push({
            role: "user",
            parts: [{ text: data }]
        })
        const ai = await main(chatHistory)
        chatHistory.push({
            role: "model",
            parts: [{ text: ai }]
        })

        console.log(ai);
        
        socket.emit("ai-message-response", ai)
    })

});

httpServer.listen(port, () => {
    console.log("Server is Listening at Port 3000");
});