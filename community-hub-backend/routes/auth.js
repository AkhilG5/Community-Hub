const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

router.post('/register', async (req,res)=>{
    const {name,email,password}=req.body;

    try{
        const existingUser = await User.findOne({email});
        if (existingUser) return res.status(400).json({msg:'user already exists'});

        const hashedPassword = await bcrypt.hash(password,10);

        const newUser = new User({name,email,password: hashedPassword});
        await newUser.save();
        const token = jwt.sign({id: newUser._id},process.env.JWT_SECRET,{expiresIn:'1h'});

        res.json({token,user:{id:newUser.id, name:newUser.name, email:newUser.email}});

    }catch(error){
        console.error(error);
        res.status(500).json({msg:'server error'});
    }
});




router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'User does not exist' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error' });
    }
});

module.exports = router;