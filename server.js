// server.js

const dotenv = require('dotenv');
dotenv.config();
const express = require('express');

const app = express();


app.get('/', (req, res) => {
    res.send('Yo, it works!');
});


app.listen(3000, () => {
    console.log('Listening on port 3000');
});
