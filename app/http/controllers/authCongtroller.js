const userModel = require("../../models/user")
const bcrpt = require('bcrypt')
const passport = require('passport')
const { use } = require("passport")

function authController(){
    const _getUrl = (req)=>{
      return req.user.role === 'admin' ? '/admin/orders' : '/customer/orders'
    }
    return{
        login(req,res){
            res.render("auth/login")
        },
        postlogin(req,res,next){
           passport.authenticate("local",(err,user,info)=>{
        if(err){
            req.flash('error',info.message);
            next(err)
        }
        if(!user){
            req.flash('error',info.message);
             return res.redirect("/login")
        }
        req.logIn(user,(err)=>{
            if(err){
                req.flash('error',info.message);
                next(err)
            }
            return res.redirect(_getUrl(req))
        })
       
           })(req,res,next)
        },

        register(req,res){
            res.render("auth/register")
        },
      async  postRegister(req,res){
            const {username,email,password} = req.body
             // validate request
             if(!username||!email||!password){
                req.flash('error','All fields are not filled');
                req.flash('username',username)
                req.flash('email',email)
                return res.redirect('/register')
             }
               
             //check if email exist 
             userModel.exists({email:email},(err,result)=>{
        
                if(result){
                    req.flash('error','email already taken');
                    req.flash('name',username)
                    req.flash('email',email)
                    return res.redirect('/register')
                }
             })
 /// harshed password
       const hashedPassword = await bcrpt.hash(password,15)
             //create user 
             const user = new userModel({
                username,
                email,
                password:hashedPassword
             })
             
             user.save().then((user)=>{
                return res.redirect('/')
          
             }).catch(err =>{
                req.flash('error','something went wrong ');
                return res.redirect('/register')
             })
        },
          logout(req, res,next) {
            req.logout(function(err){
             if (err) {return next(err)} 
             res.redirect('/')
           });
        }
    }

}

module.exports =authController