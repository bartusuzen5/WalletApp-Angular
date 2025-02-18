const mongoose = require("mongoose");

const walletHistoryCurrencySchema = new mongoose.Schema({
    _id: String,
    userId: {
        type: String,
        required: true,
        ref: "User"
    },
    currencyId: {
        type: String,
        required: false,
        ref: "Currency"
    },
    valueUsd: {
        type: Number,
        required: true
    },
    valueTry: {
        type: Number,
        required: true
    },
    date: {
        type: Date
    },
    createdDateTime: {
        type: Date
    }
});

const WalletHistoryCurrency = mongoose.model("WalletHistoryCurrency", walletHistoryCurrencySchema);

module.exports = WalletHistoryCurrency;