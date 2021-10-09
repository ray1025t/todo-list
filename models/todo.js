const mongoose = require('mongoose')
const Schema = mongoose.Schema
const todoSchema = new Schema({
  name: {
    type: String, //  型別為字串
    required: true // 必需的欄位
  }
})

module.exports = mongoose.model('Todo', todoSchema)