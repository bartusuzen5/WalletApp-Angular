const express = require("express");
const router = express.Router();
const WalletHistoryAsset = require("../models/wallet-history-asset");
const {v4:uuidv4} = require("uuid");
const WalletHistoryCurrency = require("../models/wallet-history-currency");
const Trade = require("../models/trade");
const WalletCurrency = require("../models/wallet-currency");


router.get("/", async(req, res) => {
  try{
      let walletHistoryAsset = await WalletHistoryAsset.aggregate([
        {
          $lookup: {
            from: "assets",
            localField: "assetId",
            foreignField: "_id",
            as: "asset",
          },
        },
        {
          $unwind: {
            path: "$asset",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "categories",
            localField: "asset.categoryId",
            foreignField: "_id",
            as: "asset.category",
          },
        },
        {
          $unwind: {
            path: "$asset.category",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user"
          }
        },
        {
          $unwind: {
            path: "$user",
            preserveNullAndEmptyArrays: true
          }  
        },
        {
          $project: {
            assetId: 0,
            userId: 0,
            user: 0
          }
        }
      ])
      .sort({date: 1});

      let walletHistoryCurrency = await WalletHistoryCurrency.aggregate([
        {
          $lookup: {
            from: "currency",
            localField: "currencyId",
            foreignField: "_id",
            as: "currency",
          },
        },
        {
          $unwind: {
            path: "$currency",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user"
          }
        },
        {
          $unwind: {
            path: "$user",
            preserveNullAndEmptyArrays: true
          }  
        },
        {
          $project: {
            assetId: 0,
            userId: 0,
            user: 0
          }
        }
      ])
      .sort({date: 1});

      res.json({walletHistoryAsset, walletHistoryCurrency});
    } catch (error) {
      res.status(500).json({message: error.message});
    }
});


router.post("/add", async (req, res) => {
  try {
    let { formattedDate, user } = req.body;
    const dateObj = new Date(formattedDate);
    let trades = await Trade.aggregate([
      {
        $lookup: {
          from: "assets",
          localField: "assetId",
          foreignField: "_id",
          as: "asset",
        },
      },
      { $unwind: { path: "$asset", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "categories",
          localField: "asset.categoryId",
          foreignField: "_id",
          as: "asset.category",
        },
      },
      { $unwind: { path: "$asset.category", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "currencies",
          localField: "asset.category.currencyId",
          foreignField: "_id",
          as: "asset.category.currency",
        },
      },
      { $unwind: { path: "$asset.category.currency", preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: "$assetId",
          asset: { $first: "$asset" },
          quantityBalance: {
            $sum: {
              $cond: [{ $eq: ["$tradeType", "buy"] }, "$quantity", { $multiply: ["$quantity", -1] }],
            },
          },
          costUsd: { $sum: { $cond: [{ $eq: ["$tradeType", "buy"] }, "$paidUsd", 0] } },
          paidUsd: { $sum: { $cond: [{ $eq: ["$tradeType", "sell"] }, "$paidUsd", 0] } },
          costTry: { $sum: { $cond: [{ $eq: ["$tradeType", "buy"] }, "$paidTry", 0] } },
          paidTry: { $sum: { $cond: [{ $eq: ["$tradeType", "sell"] }, "$paidTry", 0] } },
        },
      },
      {
        $addFields: {
          currentValueUsd: {
            $multiply: ["$asset.currentPrice", "$quantityBalance", "$asset.category.currency.valueUsd"],
          },
          currentValueTry: {
            $multiply: ["$asset.currentPrice", "$quantityBalance", "$asset.category.currency.valueTry"],
          },
        },
      },
      {
        $addFields: {
          marginUsd: { $subtract: [{ $add: ["$currentValueUsd", "$paidUsd"] }, "$costUsd"] },
          marginTry: { $subtract: [{ $add: ["$currentValueTry", "$paidTry"] }, "$costTry"] },
        },
      },
      {
        $project: {
          item: "$asset",
          currentValueUsd: 1,
          currentValueTry: 1,
          marginUsd: 1,
          marginTry: 1,
        },
      },
      { $sort: { currentValueUsd: -1 } },
    ]);
    
     const historyRecordsAsset = trades.map((trade) => ({
      _id: uuidv4(),
      userId: user._id,
      assetId: trade.item._id,
      valueUsd: trade.currentValueUsd,
      valueTry: trade.currentValueTry,
      marginUsd: trade.marginUsd,
      marginTry: trade.marginTry,
      date: dateObj,
      createdDateTime: new Date(),
    }));

    let walletCurrencies = await WalletCurrency.aggregate([
        {
        $lookup: {
            from: "currencies",
            localField: "currencyId",
            foreignField: "_id",
            as: "currency"
        }
        },
        {
        $unwind: {
            path: "$currency",
            preserveNullAndEmptyArrays: true
        }  
        },
        {
          $addFields: {
            currentValueUsd: {
              $multiply: ["$quantity", "$currency.valueUsd"] },

            currentValueTry: {
              $multiply: ["$quantity", "$currency.valueTry"] },
          }
        },
        {
        $project: {
            currencyId: 0,
            userId: 0
        }
        }
    ])
    .sort({name: 1});

    const historyRecordsCurrency = walletCurrencies.map((walletCurrency) => ({
      _id: uuidv4(),
      userId: user._id,
      currencyId: walletCurrency.currency._id,
      valueUsd: walletCurrency.currentValueUsd,
      valueTry: walletCurrency.currentValueTry,
      date: dateObj,
      createdDateTime: new Date(),
    }));

    checkWalletHistoryAsset = await WalletHistoryAsset.findOne({date: dateObj})
    checkWalletHistoryCurrency = await WalletHistoryCurrency.findOne({date: dateObj})

    if (checkWalletHistoryAsset || checkWalletHistoryCurrency){
      return res.status(400).json({ message: "İlgili ay için girişler zaten yapılmıştır!" });
    }

    await WalletHistoryAsset.insertMany(historyRecordsAsset);
    await WalletHistoryCurrency.insertMany(historyRecordsCurrency)

    res.json({message: "Bu ay için kayıtlar başarıyla eklendi!"});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;