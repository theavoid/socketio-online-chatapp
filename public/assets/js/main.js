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
        newmessage.innerText = '<strong>'+ data.sender +':</strong> ' + data.message;
        newmessage.style.backgroundColor = "#" + data.color
        document.getElementById('messages').appendChild(newmessage)

        const div = document.getElementById("messages");
        const list = div.querySelectorAll(".user");

        if (list.length > 10) {
            let newmessage = document.createElement('div')
            newmessage.className = "message system"
            newmessage.innerHTML = '<strong><i class="fa-solid fa-certificate"></i> sistem:</strong> Çok sayıda mesaj olduğundan dolayı mesajlar sıfırlandı.';
            document.getElementById('messages').appendChild(newmessage)
            for (let i = 0; i < list.length; i++) {
                list[i].remove()

            }
        }
    })

    socket.on("banned", (data) => {
        setTimeout(async () => {
            message.value = ""
            message.disabled = true;
            message.placeholder = "Kalıcı olarak engellendiniz."

        }, 5000)
    })

