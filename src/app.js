const express = require('express')

const app = express()

app.use('',(req,res) => {
    res.send("Hello from the server")
})

app.listen(7777,() => {
    console.log('server is listening at port 7777')
})