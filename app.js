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

app.use('/public', express.static('public'));
app.use(express.urlencoded({ extended: true }));

const csvFilePath = './public/assets/data/pokemon.csv';
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

app.get('/pokemon', async (req, res) => {
    let search = req.query.pokemon;
    search = search.charAt(0).toUpperCase() + search.slice(1);
    const data = await Pokemon.find({ $or: [{ 'name': search }, { 'pokedex_number': search }] })
        .catch(err => {
            console.log(err);
        });
    let pokemon = data[0];
    if (pokemon === undefined) {
        res.render('notFound');
    }
    res.render('pokemon', { pokemon });
});

app.listen(8080, () => {
    console.log('Pokédex server has started!');
});