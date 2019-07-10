const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const intakesSchema = new mongoose.Schema({
    intakeName: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Intakes', intakesSchema);
