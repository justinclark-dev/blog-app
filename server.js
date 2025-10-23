// server.js

const dotenv = require('dotenv');
dotenv.config({ quiet: true });
const express = require('express');

const app = express();

const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI)

mongoose.connection.on('connected', () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`)
})

app.get('/', (req, res) => {
    res.send('Yo, it works!');
});


app.listen(3000, () => {
    console.log('Listening on port 3000');
});
