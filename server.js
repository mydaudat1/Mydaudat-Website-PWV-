const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

io.on("connection", (socket) => {
    console.log("A user connected.");

    socket.on("new_comment", (data) => {
        io.emit("receive_comment", data);
    });

    socket.on("disconnect", () => {
        console.log("A user disconnected.");
    });
});

server.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
