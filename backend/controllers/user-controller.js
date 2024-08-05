import userModel from "../models/user-model.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import validator from 'validator';

// login user

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET);
  };
  
  const loginUser = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await userModel.findOne({ email });
  
      if (!user) {
        return res.status(404).json({ success: false, message: 'User doesn`t exist' });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
  
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }
  
      const token = createToken(user._id);
  
      res.status(200).json({ success: true, token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  };
  

  
// register user
const registerUser = async (req, res) => {
  const { name, password, email } = req.body;

  // Check if all required fields are provided
  if (!name || !password || !email) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  try {
    // Check if user already exists
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Validate email format
    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: 'Please enter a valid email' });
    }

    // Check if password is strong
    if (password.length < 8) {
      return res.status(400).json({ success: false, message: 'Please enter a strong password' });
    }

    // Hash user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      name: name,
      email: email,
      password: hashedPassword,
    });

    const user = await newUser.save();
    const token = createToken(user._id);
    res.status(201).json({ success: true, token });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export { registerUser, loginUser };
