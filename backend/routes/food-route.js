import express from 'express';
import multer from 'multer';
import { getAllFoods, getFoodById, createFood, updateFood, deleteFood } from '../controllers/food-controller.js';

const router = express.Router();

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

router.get('/', getAllFoods);
router.get('/:id', getFoodById);
router.post('/', upload.single('image'), createFood);
router.put('/:id', upload.single('image'), updateFood);
router.delete('/:id', deleteFood);

export default router;
