import express from 'express'
import { addToCard,removeFromCart,getCart } from "../controllers/cart-controller.js";
import authMiddelware from '../middelware/auth-middelware.js';


const cartRouter = express.Router();

cartRouter.post('/add',authMiddelware,addToCard)
cartRouter.post('/remove',authMiddelware,removeFromCart)
cartRouter.post('/get',authMiddelware,getCart)

export default cartRouter;