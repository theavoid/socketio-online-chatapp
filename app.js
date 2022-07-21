const express = require("express")
const app = express()
const socket = require("socket.io")
const { uniqueNamesGenerator, adjectives } = require('unique-names-generator');

app.set('view engine', 'ejs')
app.use(express.static("public"))

var server = app.listen(process.env.PORT || 1337, () => {
    console.log("Sunucu başlatıldı.")
})

const io = socket(server)

io.on("connection", (socket) => {
    socket.on('chat', data => {
        if (data.message == "" || data.message.length <= 1 ||data.message.length >= 200) return;
        var colors = ["54F0CD", "54C5F0", "5477F0", "7F54F0", "CD54F0", "F054C5", "F054B8", "546BF0", "EF4F77", "EF4FC7", "EF774F", "EFC74F", "C7EF4F", "FF2F63"]
        var choosenColor = colors[Math.floor(Math.random() * colors.length)]

        var newdata = {
            sender: data.sender,
            message: data.message,
            color: choosenColor
        }
        io.sockets.emit('chat', newdata)
    })
})

app.get('/', async (req, res) => {
    const username = uniqueNamesGenerator({ dictionaries: [adjectives], separator: ' ' });
    if (!req.query) return res.redirect("/?username="+ username)
    if (!req.query.username || req.query.username.length > 10) return res.redirect("/?username="+ username)
    res.render("index", { username: req.query.username })
})

