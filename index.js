require('dotenv').config()
const express = require("express");
const app = express();
const ejs = require("ejs");
const path = require("path");
const expresslayout = require("express-ejs-layouts");
const port = process.env.port || 3000 ;
const mongoose = require("mongoose");
const session = require("express-session");;
const passport = require('passport');
 const flash = require("express-flash");
const dotenv = require('dotenv')
 const MongoDbStore = require('connect-mongo')(session)
 const Emitter =require('events')
 

 



//database connect

mongoose.set('strictQuery',true);
mongoose.connect(process.env.DB_HOST)
.then(function(){
  console.log("connected")
});
//


// season store 
 let mongoStore = new MongoDbStore({
 mongooseConnection:mongoose.connection,
 collection:'sessions'
 })


 
 const eventEmitter = new Emitter()
 app.set('eventEmitter', eventEmitter)

//sesion
app.use(session({
   secret:"password",
   resave:false,
   store:mongoStore,
   saveUninitialized:false,
   cookie:{maxAge:1000*60*60*24}
}))
//
const passportinit = require("./app/config/passport");
const user = require("./app/models/user");
passportinit(passport);
app.use(passport.initialize());
app.use(passport.session());


app.use(flash())
//
app.use(express.static('public'))
app.use(express.urlencoded({extended:false}))

app.use(express.json())

// gboble middleware 
app.use((req,res,next)=>{
     res.locals.session = req.session
     res.locals.user = req.user
     
     next()
    })


//set template 
app.use(expresslayout)
app.set('views',path.join(__dirname,'/resources/views'))
app.set('view engine','ejs');


require('./routes/web')(app)
require('./routes/api')(app)
app.use((req,res)=>{
  res.status(404).send('<h1>404, Page not found </h1>')
})


const server = app.listen(port,()=>{
    console.log(`sever started ${port}`)
})


const io = require('socket.io')(server)
io.on('connection', (socket) => {
      // Join
      socket.on('join', (orderId) => {
        socket.join(orderId)
      })
})


eventEmitter.on('orderUpdated', (data) => {
    io.to(`order_${data.id}`).emit('orderUpdated', data)
})

eventEmitter.on('orderPlaced', (data) => {
    io.to('adminRoom').emit('orderPlaced', data)
})