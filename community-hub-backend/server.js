const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const pointRoutes = require('./routes/points');
const feedRoutes = require('./routes/feed');
const userRoutes = require('./routes/users');
const adminRoutes = require('./routes/admin');

app.use('/api/admin', adminRoutes);


const dotenv = require('dotenv');
const cors = require('cors')

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/points',pointRoutes);
app.use('/api/feed',feedRoutes)

mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(()=> console.log('MongoDB Connected'))
    .catch((err)=> console.log('MongoDB connection error',err));

app.get('/',(req , res)=>{
    res.send('Community Hub API running!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
    
});


