const mongoose = require("mongoose");

const currencySchema = new mongoose.Schema({
    _id: String,
    name: {
        type: String,
        required: true,
        unique: true
    },
    symbol: {
        type: String,
        required: true,
        unique: false
    },
    valueUsd: {
        type: Number,
        required: true,
        unique: false
    },
    valueTry: {
        type: Number,
        required: true,
        unique: false
    },
    createdDateTime: {
        type: Date
    }
});

const Currency = mongoose.model("Currency", currencySchema);

module.exports = Currency;