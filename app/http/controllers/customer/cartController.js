function cartController(){
    return{
        index(req,res){
            res.render("cart")
            
        },
        update(req,res){
            if(!req.session.cart){
             req.session.cart ={
                item:{},
                totalQty:0,
                totalPrice:0,
             }
            }
            let cart = req.session.cart
            if(!cart.item[req.body._id]){
               cart.item[req.body._id] ={
                item:req.body,
                qty:1
               }
               cart.totalQty =cart.totalQty +1
               cart.totalPrice = cart.totalPrice + req.body.price
            }else{
                 cart.item[req.body._id].qty =  cart.item[req.body._id].qty + 1
                 cart.totalQty = cart.totalQty + 1
                 cart.totalPrice = cart.totalPrice +  req.body.price
            }
            return res.json({totalQty:req.session.cart.totalQty})
        }
    }
}
module.exports =cartController