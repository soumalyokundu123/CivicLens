
const express=require('express');
const app=express()
const bodyParser=require('body-parser')
const PORT=process.env.PORT || 8080
const AuthRouter=require('./Routes/AuthRouter')
const cors=require('cors')
require('dotenv').config()
require('./Models/db')
app.get('/ping',(req,res)=>{
    res.send('PONG')
})

app.use(bodyParser.json())
app.use(cors())
app.use('/auth',AuthRouter)
app.listen(PORT,()=>{
    console.log(`Server is running at port ${PORT}`)
})


