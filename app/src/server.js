const express = require("express");
var Filter = require('bad-words');
const app = express();
const port = 3000;

const path = require("path");
const http = require("http");
const socketio = require("socket.io");
const formatTime = require("date-format");
const { createMessages } = require("./utils/create-messages")
const { getUserList, addUser, removeUser } = require("./utils/users")

//caì đặt static file
const publicPathDirectory = path.join(__dirname, '../public')
app.use(express.static(publicPathDirectory));

let count = 1;
const message = "Chào mội người";
const server = http.createServer(app);
const io = socketio(server);
//lăng nghe sư kiện từ client
io.on("connection", (socket) => {

    socket.on("join room from client to server", ({ room, username }) => {
        socket.join(room);

        // gửi cho client vừa kết nối vào
        socket.emit("send message from server to client", createMessages(`Chào mừng bạn đến với Phòng ${room}`));

        // gửi cho các client còn lại
        socket.broadcast.to(room).emit("send message from server to client", createMessages(`Client ${username} vừa tham gia vào Phòng ${room}`))

        // CyberChat
        socket.on("send message from client to server", (messageText, callback) => {
            const filter = new Filter();
            if (filter.isProfane(messageText)) {
                return callback("messageText không hợp lê vì có những từ khóa tục tĩu")
            }
            io.to(room).emit("send message from server to client", createMessages(messageText));
            callback;
        });

        // Xử lý chia sẻ vị trí
        socket.on("share location from client to server", ({
            latitude,
            longitude
        }) => {
            const linkLocation = `https:www.google.com/maps?q=${ latitude },${ longitude }`;
            io.to(room).emit("share location from server to client", linkLocation);
        });

        // Xử lý userList
        const newUser = {
            id: socket.id,
            username,
            room
        }
        addUser(newUser);
        io.to(room).emit("send user list from server to client", getUserList(room));
        socket.on("disconnect", () => {
            removeUser(socket.id);
            io.to(room).emit("send user list from server to client", getUserList(room));
            console.log("client exit server");
        });
    })
})

server.listen(port, () => {
    console.log(`app run${ port }`);
});