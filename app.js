const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const Pokemon = require('./models/pokemon');

mongoose.connect('mongodb://localhost:27017/pokedex', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind("connection error:"));
db.once("open", () => {
    console.log("Database Connected.");
});

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
    res.render('home');
});

app.listen(8080, () => {
    console.log('Pokédex server has started!');
});