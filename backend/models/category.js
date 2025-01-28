const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    _id: String,
    name: {
        type: String,
        required: true,
        unique: true
    },
    currencyId: {
        type: String,
        required: true,
        ref: "Currency"
    },
    createdDateTime: {
        type: Date
    }
});

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;