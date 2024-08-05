import 'dotenv/config'
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import foodRouter from './routes/food-route.js'; // Ensure correct path
import path from 'path';
import { fileURLToPath } from 'url';
import userRouter from './routes/user-route.js';
import cartRouter from './routes/cart-route.js';
import orderRouter from './routes/order-route.js';

const app = express();
const PORT = 4000;

// Connect to Database
connectDB();

// Middleware
app.use(express.json());
app.use(cors());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Routes
app.use('/api/foods', foodRouter);
app.use('/images', express.static(path.join(__dirname, 'uploads')));
app.use('/api/user',userRouter);
app.use('/api/cart',cartRouter)
app.use('/api/order', orderRouter)


app.get('/', (req, res) => {
    res.send('API WORKING');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
