const socket = io.connect({ secure: true })
console.log(socket.id)

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
        if (data.sender == "photobot") {
            Push.create(data.sender, {
                body: data.sender + ' bir fotoğraf gönderdi.',
                icon: data.url,
                timeout: 2000,
                onClick: function () {
                    window.focus();
                    this.close();
                }
            });

            let newmessage = document.createElement('div')
            newmessage.className = "message system"
            newmessage.innerHTML = '<strong> <i class="fa-solid fa-camera"></i> '+ data.sender +':</strong> ' + data.message;
           return document.getElementById('messages').appendChild(newmessage)
        }
        Push.create(data.sender, {
            body: data.message.slice(0, 50)+'...',
            timeout: 2000,
            onClick: function () {
                window.focus();
                this.close();
            }
        });

        let newmessage = document.createElement('div')
        newmessage.className = "message user"
        newmessage.innerText =  data.message;
        let authorMessage = document.createElement("div")
        authorMessage.innerText = data.sender
        authorMessage.className = "author"
        document.getElementById('messages').appendChild(authorMessage)
        newmessage.style.backgroundColor = "#" + data.color
        document.getElementById('messages').appendChild(newmessage)

        const div = document.getElementById("messages");
        const list = div.querySelectorAll(".message");
        const list1 = div.querySelectorAll(".author");

        if (list.length > 10) {
            let newmessage = document.createElement('div')
            newmessage.className = "message system"
            newmessage.innerHTML = '<strong><i class="fa-solid fa-certificate"></i> sistem:</strong> Çok sayıda mesaj olduğundan dolayı mesajlar sıfırlandı.';
            document.getElementById('messages').appendChild(newmessage)
            for (let i = 0; i < list.length; i++) {
                list[i].remove()

            }
            for (let i = 0; i < list1.length; i++) {
                list1[i].remove()

            }

        }

    })

document.getElementById("fileupload").onchange = function () {
    document.getElementById("fileform").submit();
}


