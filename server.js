const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs'); // Ensure bcryptjs is installed
//require('dotenv').config();

const app = express();
const PORT = 9876;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// In-memory users array
let users = [];

// Serve index.html
app.get('/mainpage', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// signuppage.html
app.get('/signupage', (req, res) => {
    res.sendFile(path.join(__dirname, 'signup.html'));
});

// updateprofile.html
app.get('/updateprofile', (req, res) => {
    res.sendFile(path.join(__dirname, 'profile.html'));
});

// Sign-Up
app.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;
    const userExists = users.find(user => user.email === email);

    if (userExists) {
        return res.status(400).json({ error: 'Email already exists' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = { name, email, password: hashedPassword, profile: '' };
        users.push(newUser);
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        res.status(400).json({ error: 'Error creating user' });
    }
});

// Update Profile
app.post('/update', (req, res) => {
    const { email, profile } = req.body;
    const user = users.find(user => user.email === email);

    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    try {
        user.profile = profile;
        res.status(200).json({ message: 'Profile updated successfully' });
    } catch (error) {
        res.status(400).json({ error: 'Error updating profile' });
    }
});

// Show User
app.get('/user/:email', (req, res) => {
    const email = req.params.email;
    const user = users.find(user => user.email === email);

    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user);
});

// Show All Users
app.get('/users', (req, res) => {
    res.status(200).json(users);
});

// Delete User using POST
app.post('/delete', (req, res) => {
    const { email } = req.body;
    const userIndex = users.findIndex(user => user.email === email);

    if (userIndex === -1) {
        return res.status(404).json({ error: 'User not found' });
    }

    users.splice(userIndex, 1);
    res.status(200).json({ message: 'User deleted successfully' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
