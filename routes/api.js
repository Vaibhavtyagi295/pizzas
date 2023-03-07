const OrderController =require('../app/http/controllers/customer/orderController')
const adminOrderController =require('../app/http/controllers/admin/adminOrderController')
const statusController =require('../app/http/controllers/admin/statusController')
const auth =require("../app/http/middlewares/auth")
const admin = require('../app/http/middlewares/admin')
function iniitRouter(app){
    app.post("/orders",auth,OrderController().store) 
    //customer route
    app.get('/customer/orders',auth,OrderController().index) 
    app.get('/customer/orders/:id',auth,OrderController().show) 
    app.get('/admin/orders',admin,adminOrderController().index) 
    app.post('/admin/order/status',admin,statusController().update) 
}

module.exports= iniitRouter


