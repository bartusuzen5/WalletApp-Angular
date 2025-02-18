const mongoose = require("mongoose");

const walletHistoryAssetSchema = new mongoose.Schema({
    _id: String,
    userId: {
        type: String,
        required: true,
        ref: "User"
    },
    assetId: {
        type: String,
        required: false,
        ref: "Asset"
    },
    valueUsd: {
        type: Number,
        required: true
    },
    valueTry: {
        type: Number,
        required: true
    },
    marginUsd: {
        type: Number,
        required: true
    },
    marginTry: {
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

const WalletHistoryAsset = mongoose.model("WalletHistoryAsset", walletHistoryAssetSchema);

module.exports = WalletHistoryAsset;