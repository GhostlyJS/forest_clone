const jsonwebtoken = require('jsonwebtoken');
const User = require('../models/user.model');

module.exports = {
    register: async (req, res) => {
        try {
            const { username, password } = req.body;
            const existingUser = await User.findOne({ username });
            if (existingUser) {
                return res.status(400).json({ message: 'Username already exists' });
            }
            const newUser = new User({ username, password });
            await newUser.save();
            return res.status(201).json({ message: 'User registered successfully' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    },
    login: async (req, res) => {
        try {
            const { username, password } = req.body;
            const user = await User.findOne({ username });
            if (!user) {
                return res.status(401).json({ message: 'Invalid username or password' });
            }
            const isMatch = await user.comparePassword(password);
            if (!isMatch) {
                return res.status(401).json({ message: 'Invalid username or password' });
            }
            const token = jsonwebtoken.sign({ id: user._id }, "forest");
            return res.status(200).json({ token });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    },
    getUser: async (req, res) => {
        try {
            const token = req.headers['authorization'].split(' ')[1];
            const decodedToken = jsonwebtoken.verify(token, "forest");
            if (!decodedToken) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
            const user = await User.findById(decodedToken.id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            return res.status(200).json({ username: user.username, profilePicture: user.profilePicture });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    },
}