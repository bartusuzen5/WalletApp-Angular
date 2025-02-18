const mongoose = require("mongoose");

const walletCurrencySchema = new mongoose.Schema({
    _id: String,
    userId: {
        type: String,
        required: true,
        ref: "User"
    },
    currencyId: {
        type: String,
        required: true,
        ref: "Currency"
    },
    quantity: {
        type: Number,
        required: true
    },
    createdDateTime: {
        type: Date
    }
});

const WalletCurrency = mongoose.model("WalletCurrency", walletCurrencySchema);

module.exports = WalletCurrency;