const mongoose = require('mongoose');
const User = require('../model/UserModel');

const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const user = await User.create({ name, email, password });
        if (!user) return res.status(500).json({ msg: 'Accrount creation failed' });

        res.status(201).json({ user });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
}

module.exports = { registerUser };