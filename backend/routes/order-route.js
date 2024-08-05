import express from 'express'
import {listOrders, placeOrder, updateStatus, userOrders, verifyOrder} from '../controllers/order-controller.js'
import authMiddleware from '../middelware/auth-middelware.js'


const orderRouter = express.Router()

orderRouter.post('/place',authMiddleware,placeOrder);
orderRouter.post('/verify',verifyOrder)
orderRouter.post('/userorders',authMiddleware,userOrders)
orderRouter.get('/list', listOrders)
orderRouter.post('/status',updateStatus)


export default orderRouter; 