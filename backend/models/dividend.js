const mongoose = require("mongoose");

const dividendSchema = new mongoose.Schema({
    _id: String,
    assetId: {
        type: String,
        required: true,
        ref: "Asset"
    },
    paymentPerQuantity: {
        type: Number,
        required: true,
        unique: false
    },
    quantity: {
        type: Number,
        required: true,
        unique: false
    },
    yield: {
        type: Number,
        required: false,
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
    dividendDate: {
        type: Date,
        required: true,
        unique: false
    },
    createdDateTime: {
        type: Date
    }
});

const Dividend = mongoose.model("Dividend", dividendSchema);

module.exports = Dividend;