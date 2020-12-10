const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PokemonSchema = new Schema({
    pokedex_number: String,
    name: String,
    attack: String,
    classfication: String,
    defense: String,
    height_m: String,
    hp: String,
    speed: String,
    type1: String,
    type2: String,
    weight_kg: String,
    generation: String,
    is_legendary: String,
    abilities: String
});

module.exports = mongoose.model('Pokemon', PokemonSchema);