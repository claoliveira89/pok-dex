const express = require('express');
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

const csvFilePath = './assets/pokemon.csv';
const csv = require('csvtojson');
csv()
    .fromFile(csvFilePath)
    .then((jsonObj) => {
        const populateDB = async () => {
            await Pokemon.deleteMany({});
            for (let obj of jsonObj) {
                const poke = new Pokemon(obj);
                await poke.save();
            }
        }

        populateDB();
    });

app.get('/', (req, res) => {
    res.render('home');
});

app.listen(8080, () => {
    console.log('Pokédex server has started!');
});