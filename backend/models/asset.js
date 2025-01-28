const mongoose = require("mongoose");

const assetSchema = new mongoose.Schema({
    _id: String,
    name: {
        type: String,
        required: true,
        unique: true
    },
    code: {
        type: String,
        required: true,
        unique: true
    },
    currentPrice: {
        type: Number,
        required: false,
        unique: false
    },
    athPrice: {
        type: Number,
        required: false,
        unique: false
    },
    volume: {
        type: Number,
        required: false,
        unique: false
    },
    categoryId: {
        type: String,
        required: true,
        ref: "Category"
    },
    createdDateTime: {
        type: Date
    }
});

const Asset = mongoose.model("Asset", assetSchema);

module.exports = Asset;