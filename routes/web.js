const authController = require("../app/http/controllers/authCongtroller")
const cartController = require("../app/http/controllers/customer/cartController")
const homeController =require("../app/http/controllers/homeController")
const guest =require("../app/http/middlewares/guest")
const auth =require("../app/http/middlewares/auth")


function initRoutes(app){
    
    app.get("/",homeController().index)
    app.get("/login",guest,authController().login)
    app.post("/login",authController().postlogin)
    app.get("/register",guest,authController().register)
    app.post("/register",authController().postRegister)
    app.post("/logout",authController().logout)
    app.get("/cart",cartController().index)
    app.post("/update-cart",cartController().update)
  

}

module.exports = initRoutes