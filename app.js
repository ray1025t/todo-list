const express = require('express')
const app = express()
const port = 3000
const exphbs = require('express-handlebars')
const Todo = require('./models/todo') // 載入 Todo model
const bodyParser = require('body-parser')

app.engine('hbs', exphbs ({ defaultLayout: 'main' , extname: '.hbs'}))

app.set('view engine', 'hbs')

// 使用body-parser
app.use(bodyParser.urlencoded({ extended: true }))

const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/todo-list', { useNewUrlParser: true, useUnifiedTopology: true })

// 取得連線狀態
const db = mongoose.connection

// 連線異常
db.on('error', () => {
  console.log('mongodb error!')
})

// 連線成功
db.once('open', ()=> {
  console.log('mongodb connected')
})

// 設定todos路由
app.get('/todos/new', (req, res) => {
 return res.render('new')
})

// 新增一筆資料 路由設定
app.post('/todos', (req, res) => {
  const name = req.body.name // 從req.body拿出name
  return Todo.create({ name })   //  存入資料庫

  // 另一種新增資料 存入資料庫方法
  // const todo = new Todo({ new })
  // 存入資料庫
  // return todo.save() 
 
  .then(() => res.redirect('/'))
  .catch(error => console.error(error))
})

// Detail 路由設定
app.get('/todos/:id', (req, res) => {
  const id = req.params.id
  return Todo.findById(id)
  .lean()
  .then(todo => res.render('detail', { todo }))
  .catch(error => console.error(error))
})

// edit 路由設定
app.get('/todos/:id/edit', (req, res) => {
  const id = req.params.id
  return Todo.findById(id)
    .lean()
    .then(todo => res.render('edit', { todo }))
    .catch(error => console.error(error))
})

app.post('/todos/:id/edit', (req, res) => {
  const id = req.params.id
  const name = req.body.name
  return Todo.findById(id)
    .then(todo => {
      todo.name = name
      return todo.save()
    })
    .then(() => res.redirect(`/todos/${id}`))
    .catch(error => console.error(error))
})

app.get('/', (req, res) => {
  Todo.find() // 取出 Todo model 裡的所有資料
    .lean() // 把 Mongoose 的 Model 物件轉換成乾淨的 JavaScript 資料陣列
    .then(todos => res.render('index', { todos })) // 將資料傳給 index 樣板
    .catch(error => console.error(error)) // 錯誤處理
})

app.listen(port , () => {
  console.log(`Express running on http:localhost:${port}`)
})