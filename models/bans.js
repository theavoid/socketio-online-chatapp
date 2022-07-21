const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MongoSchema = new Schema({
        user: String,
        ip: String
    },
    { timestamps: true })

const schema = mongoose.model('bans', MongoSchema)
module.exports = schema;
