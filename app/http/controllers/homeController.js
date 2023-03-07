const { json } = require("express")
const Menu = require("../../models/menu")

function homeController(){
    return{
        async index(req,res){
            const pizzas = await Menu.find()
                    
                return res.render("index",{pizzas:pizzas})
            }

        //     Menu.find().then(function(pizzas){
        //         return res.render("index",{pizzas:pizzas})
        //     })
        }
    }

module.exports =homeController