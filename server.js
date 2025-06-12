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

let onlineUsers = 0;
let comments = []; // Array to store comments

io.on("connection", (socket) => {
    console.log("A user connected.");
    onlineUsers++;
    io.emit('userCount', onlineUsers);

    socket.on("new_comment", (data) => {
        io.emit("receive_comment", data);
    });

    socket.on('newMessage', (data) => {
        io.emit('newMessage', data); // Broadcast the message to all clients
    });

    socket.on('typing', (data) => {
        socket.broadcast.emit('typing', data); // Broadcast typing indicator to others
    });

    socket.on('userOnline', () => {
        // This event is just a notification from the client that they are online.
        // The server already increments onlineUsers on connection.
    });

    socket.on('newComment', (data) => {
        comments.push(data); // Store the new comment
        io.emit('commentAdded', data); // Broadcast the new comment to all clients
    });

    socket.on('getComments', () => {
        socket.emit('commentAdded', comments); // Send all stored comments to the requesting client
    });
    socket.on("disconnect", () => {
        console.log("A user disconnected.");
        onlineUsers--;
        io.emit('userCount', onlineUsers);
    });
});

server.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
