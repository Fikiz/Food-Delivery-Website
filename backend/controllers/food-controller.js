import foodModel from '../models/food-model.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get all foods
export const getAllFoods = async (req, res) => {
    try {
        const foods = await foodModel.find();
        res.status(200).json(foods);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single food by ID
export const getFoodById = async (req, res) => {
    try {
        const food = await foodModel.findById(req.params.id);
        if (!food) return res.status(404).json({ message: 'Food not found' });
        res.status(200).json(food);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new food
export const createFood = async (req, res) => {
    try {
        const { name, description, price, category } = req.body;
        const image = req.file ? req.file.filename : null;
        
        const newFood = new foodModel({
            name,
            description,
            price,
            image,
            category
        });

        await newFood.save();
        res.status(201).json({ success: true, data: newFood });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


// Update a food by ID
export const updateFood = async (req, res) => {
    try {
        const { name, description, price, category } = req.body;
        const image = req.file ? req.file.filename : req.body.image;

        const updatedFood = await foodModel.findByIdAndUpdate(req.params.id, {
            name,
            description,
            price,
            image,
            category
        }, { new: true });

        if (!updatedFood) return res.status(404).json({ message: 'Food not found' });
        res.status(200).json(updatedFood);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a food by ID
export const deleteFood = async (req, res) => {
    try {
        const deletedFood = await foodModel.findByIdAndDelete(req.params.id);
        if (!deletedFood) return res.status(404).json({ message: 'Food not found' });
        
        // Remove the associated image file
        if (deletedFood.image) {
            const imagePath = path.join(__dirname, '..', 'uploads', deletedFood.image);
            fs.unlink(imagePath, (err) => {
                if (err) console.error('Failed to delete image file:', err);
            });
        }

        res.status(200).json({ message: 'Food deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
