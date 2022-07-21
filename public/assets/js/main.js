const socket = io.connect({ secure: true })
console.log(socket.id)

const sender = document.getElementById("username").value
const message = document.getElementById("message")

message.addEventListener("keypress", function (key) {
    if (key.keyCode == 13) {
        if (localStorage.getItem("1ppPa8K92sliLlvLMvTl")) return;
        socket.emit('chat', {
            sender: sender,
            message: message.value
        })

        message.value = ""
        message.disabled = true;
        message.placeholder = "Tekrar mesaj yazabilmek için beklemelisin."
        setTimeout(() => {
            message.disabled = false;
            message.placeholder = sender + ", ne düşünüyorsun?"
        }, 3000)

    }
})

    socket.on('chat', (data) => {
        let newmessage = document.createElement('div')
        newmessage.className = "message user"
        newmessage.innerHTML = '<strong>'+ data.sender +':</strong> ' + data.message;
        newmessage.style.backgroundColor = "#" + data.color
        document.getElementById('messages').appendChild(newmessage)
    })

    socket.on("banned", (data) => {
        setTimeout(async () => {
            message.value = ""
            message.disabled = true;
            message.placeholder = "Kalıcı olarak engellendiniz."

        }, 5000)
    })

