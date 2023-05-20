const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');


const authRoutes = require('./routes/auth');

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api/auth', authRoutes);

const PORT = 5000;

mongoose
  .connect('mongodb+srv://Hosteet:Trucki%402023@cluster0.5aikql0.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log('MongoDB connection failed:', error);
  });
