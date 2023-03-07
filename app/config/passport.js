const LocalStrategy = require("passport-local").Strategy;
const userModel = require("../models/user")
const bcrpt = require('bcrypt');
const usersRouter = require("../../index");
const match = require("nodemon/lib/monitor/match");



function init(passport){
  passport.use(new LocalStrategy({usernameField:'email'},async(email,password,done)=>{
    const user = await userModel.findOne({email:email})
    if(!user){
        return done(null,false,{message:"no user with this email"})
    }
 bcrpt.compare(password,user.password).then(match=>{
  if(match){
    return done(null,user,{message:'loged in '})
  }
  return done(null,false,{message:"Wrong email or password"})
 }).catch(err =>{
    return done(null,false,{message:"something went wrong"}) 
 })
  }))
  passport.serializeUser((user,done)=>{
    done(null,user._id)
  })
  passport.deserializeUser((id,done)=>{
    userModel.findOne({_id:id},(err,user)=>{
      done(err,user)
    })
  })
}

module.exports =init