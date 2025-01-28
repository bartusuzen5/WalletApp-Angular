const mongoose = require("mongoose");

const tradeSchema = new mongoose.Schema({
    _id: String,
    assetId: {
        type: String,
        required: true,
        ref: "Asset"
    },
    tradeType: {
        type: String,
        required: true,
        unique: false
    },
    price: {
        type: Number,
        required: true,
        unique: false
    },
    quantity: {
        type: Number,
        required: true,
        unique: false
    },
    paidUsd: {
        type: Number,
        required: true,
        unique: false
    },
    paidTry: {
        type: Number,
        required: true,
        unique: false
    },
    tradeDate: {
        type: Date,
        required: true,
        unique: false
    },
    createdDateTime: {
        type: Date
    }
});

const Trade = mongoose.model("Trade", tradeSchema);

module.exports = Trade;