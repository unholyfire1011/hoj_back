const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');
const Contact = require('./models/Contact');

// Initialize Express
const app = express();

// Middleware
app.use(express.json()); // Parse JSON bodies (as sent by API clients)
app.use(cors());         // Allow cross-origin requests

// Check MongoDB URI
if (!process.env.MONGO_URI) {
    console.error('MongoDB URI is not set in the environment variables');
    process.exit(1);
}

// Log the MongoDB URI for debugging
console.log('MongoDB URI:', process.env.MONGO_URI);

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection failed:', error);
        process.exit(1); // Exit process with failure
    }
};

// Call the function to connect to the database
connectDB();

// Route to handle contact form submission
app.post('/api/contact', async (req, res) => {
    const { name, email, phone, message } = req.body;

    // Log the received contact form data
    console.log("Received contact form data:", req.body);

    // Input validation (optional)
    if (!name || !email || !message) {
        return res.status(400).json({ message: 'Name, email, and message are required fields.' });
    }

    try {
        const newContact = new Contact({
            name,
            email,
            phone,
            message,
        });

        await newContact.save(); // Save the contact form data to MongoDB
        console.log("Contact message saved:", newContact); // Log saved data
        res.status(201).json({ message: 'Contact message saved successfully!' });
    } catch (error) {
        console.error('Failed to save contact message:', error);
        res.status(500).json({ message: 'Failed to save contact message', error: error.message });
    }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
