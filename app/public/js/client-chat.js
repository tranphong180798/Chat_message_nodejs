const socket = io();
document.getElementById("form-message").addEventListener("submit", (e) => {
    e.preventDefault();
    const messageText = document.getElementById("input-messages").value;
    const acknowledgement = (errors) => {
        if (errors) {
            return alert("tin nhắn không hợp lệ");
        } else {
            console.log("tin nhắn đã gửi thành công");
        }
    };
    socket.emit("send message from client to server", messageText, acknowledgement);
});
socket.on("send message from server to client", (message) => {
    console.log("messageText:", message);
    const htmlContent = document.getElementById("app-messages").innerHTML;
    //hien thi len man hinh
    const { createAt, messagesText } = message;
    const messagesElement = `
    <div id="app-messages">
        <p>User</p>
        <p>${createAt}</p>
        <p >${messagesText}</p>
    </div>`;

    let contentRender = htmlContent + messagesElement;
    document.getElementById("app-messages").innerHTML = contentRender;

    document.getElementById("input-messages").value = "";
})

// gửi vị trí
document.getElementById("btn-share-location").addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert("trinh duyệt đang dùng không hỗ trợ tìm vị trí");
    }
    navigator.geolocation.getCurrentPosition((position) => {
        console.log("position: " + position);
        const { latitude, longitude } = position.coords;
        socket.emit("share location from client to server", {
            latitude,
            longitude
        });
    });
});
socket.on("share location from server to client", (linkLocation) => {
    console.log("linkLocation : 0", linkLocation);
});

// Sử lý query string
const queryString = location.search;

const params = Qs.parse(queryString, {
    ignoreQueryPrefix: true,
});
const { room, username } = params
socket.emit("join room from client to server", { room, username });

//Xử lý user list
socket.on("send user list from server to client", (userList) => {
    console.log(userList);
})