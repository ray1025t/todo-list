const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('wecome my page')
})

app.listen(port , () => {
  console.log(`Express running on http:localhost:${port}`)
})