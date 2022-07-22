const express = require("express")
const app = express()
const socket = require("socket.io")
const { uniqueNamesGenerator, adjectives } = require('unique-names-generator');
const axios = require("axios")
const mongoose = require("mongoose")
const upload = require("express-fileupload")

app.set('view engine', 'ejs')
app.use(express.static("public"))
app.use(upload())
var server = app.listen(process.env.PORT || 1337, () => {
    mongoose.connect(process.env.MONGO || "")
    console.log("Sunucu başlatıldı.")
})

const io = socket(server)

io.on("connection", async (socket) => {

    socket.on('chat', async data => {
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
    if (req.query.key && req.query.key == "file_uploaded") {
        if (!req.query.source) return res.redirect("/")
        if (!req.query.username) {
           return res.redirect("/?key=file_uploaded&source="+ req.query.source+"&username=" + username)
        }
       return res.render("index", { username: req.query.username, source: req.query.source, fileuploaded: true })
    }
    if (!req.query.username || req.query.username.length > 10) return res.redirect("/?username="+ username)
    res.render("index", { username: req.query.username, source: '', fileuploaded: false })
})

app.post("/api/upload", (req, res) => {
    if (req.files) {
        var file = req.files.file
        var filename = file.name
        console.log(req.files.file.mimetype)
        if (req.files.file.mimetype == "image/jpeg" || req.files.file.mimetype == "image/png" ) {
        file.mv('./public/uploads/' + file.md5 , function (err) {
            if (err) {
                res.send(err)
            } else {
                var name = '/uploads/' + file.md5
                var newdata = {
                    sender: 'photobot',
                    message: `<img class="chat_image" onclick="window.open('/uploads/'+file.md5)" onerror="javascript:void(0)" height="250" style="margin-top: 20px; border-radius: 6px" src=${name}>`,
                    color: "#989c9f",
                    url: '/uploads/' + file.md5
                }
                io.sockets.emit('chat', newdata)
                res.redirect("/?key=file_uploaded&source=" + file.md5)
            }
        })
        } else {
            console.log(req.files.file.mimetype)
            res.json({
                success: false, message: "Invalid mimetype. "
            })
        }
    }
})

