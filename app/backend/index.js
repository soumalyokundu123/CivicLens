
const express=require('express');
const app=express()
const bodyParser=require('body-parser')
const PORT=process.env.PORT || 8080
const AuthRouter=require('./Routes/AuthRouter')
const IssueRouter=require('./Routes/IssueRouter')
const cors=require('cors')
require('dotenv').config()
require('./Models/db')
app.get('/ping',(req,res)=>{
    res.send('PONG')
})

// Increase body size limits to accept base64 images from CivicLens
app.use(bodyParser.json({ limit: '15mb' }))
app.use(bodyParser.urlencoded({ limit: '15mb', extended: true }))
app.use(cors())
app.use('/auth',AuthRouter)
app.use('/issues',IssueRouter)
app.listen(PORT,()=>{
    console.log(`Server is running at port ${PORT}`)
})


