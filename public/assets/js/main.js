const socket = io.connect({ secure: true })

const sender = document.getElementById("username").value
const message = document.getElementById("message")

message.addEventListener("keypress", function (key) {
    if (key.keyCode == 13) {
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

