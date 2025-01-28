const express = require("express");
const router = express.Router();
const Trade = require("../models/trade");
const {v4:uuidv4} = require("uuid");


  router.post("/asset", async (req, res) => {
      try {
        let {categoryId} = req.body
        console.log(categoryId)
        let matchStage = {};
        if (categoryId !== "all") {
          matchStage = { "asset.categoryId" : categoryId };
        }
        let trades = await Trade.aggregate([
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
              from: "currencies",
              localField: "asset.category.currencyId",
              foreignField: "_id",
              as: "asset.category.currency",
          },
        },
        {
          $unwind: {
              path: "$asset.category.currency",
              preserveNullAndEmptyArrays: true,
          },
        },
        {
          $match: matchStage
        },
        {
          $group: {
            _id: "$assetId",
            asset: { $first: "$asset" },
            quantityBalance: { 
              $sum: {
                $cond: [{ $eq: ["$tradeType", "buy"] }, "$quantity", { $multiply: ["$quantity", -1] }]
              }
            },
            costUsd: {
              $sum: {
                $cond: [
                  { $eq: ["$tradeType", "buy"] }, "$paidUsd", 0
                ]
              }
            },
            paidUsd: {
              $sum: {
                $cond: [
                  { $eq: ["$tradeType", "sell"] }, "$paidUsd", 0
                ]
              }
            },
            costTry: {
              $sum: {
                $cond: [
                  { $eq: ["$tradeType", "buy"] }, "$paidTry", 0
                ]
              }
            },
            paidTry: {
              $sum: {
                $cond: [
                  { $eq: ["$tradeType", "sell"] }, "$paidTry", 0
                ]
              }
            },
          }
        },
        {
          $addFields: {
            currentValueUsd: {
              $sum: {
                  $multiply: ["$asset.currentPrice", "$quantityBalance", "$asset.category.currency.valueUsd"] },
            },
            currentValueTry: {
              $sum: {
                  $multiply: ["$asset.currentPrice", "$quantityBalance", "$asset.category.currency.valueTry"] },
            },
          }
        },
        {
          $addFields: {
            marginUsd: {
              $subtract: [
                { $add: ["$currentValueUsd", "$paidUsd"]},
                "$costUsd",
              ],
            },
            marginTry: {
              $subtract: [
                { $add: ["$currentValueTry", "$paidTry"]},
                "$costTry",
              ],
            },
          }
        },
        {
          $addFields: {
            marginUsdPerc: {
              $multiply: [
                { $divide: ["$marginUsd", "$costUsd"], },
                100                
              ],              
            },
            marginTryPerc: {
              $multiply: [
                { $divide: ["$marginTry", "$costTry"], },
                100                
              ],              
            },
          }
        },
        {
          $project: {
            asset: 1,
            currentValueUsd: 1,
            currentValueTry: 1,
            marginUsd: 1,
            marginTry: 1,
            marginUsdPerc: 1,
            marginTryPerc: 1
          }
          },
          {
            $sort: { assetCurrentValueUsd: -1 },
          },
      ]);
      console.log(trades)
      res.json(trades);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });


  router.get("/category", async (req, res) => {
    try {
      let trades = await Trade.aggregate([
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
              from: "currencies",
              localField: "asset.category.currencyId",
              foreignField: "_id",
              as: "asset.category.currency",
          },
        },
        {
          $unwind: {
              path: "$asset.category.currency",
              preserveNullAndEmptyArrays: true,
          },
        },
        {
          $group: {
            _id: "$assetId",
            asset: { $first: "$asset" },
            quantityBalance: { 
              $sum: {
                $cond: [{ $eq: ["$tradeType", "buy"] }, "$quantity", { $multiply: ["$quantity", -1] }]
              }
            },
            costUsd: {
              $sum: {
                $cond: [
                  { $eq: ["$tradeType", "buy"] }, "$paidUsd", 0
                ]
              }
            },
            paidUsd: {
              $sum: {
                $cond: [
                  { $eq: ["$tradeType", "sell"] }, "$paidUsd", 0
                ]
              }
            },
            costTry: {
              $sum: {
                $cond: [
                  { $eq: ["$tradeType", "buy"] }, "$paidTry", 0
                ]
              }
            },
            paidTry: {
              $sum: {
                $cond: [
                  { $eq: ["$tradeType", "sell"] }, "$paidTry", 0
                ]
              }
            },
            
          }
        },
        {
          $addFields: {
            currentValueUsd: {
              $sum: {
                  $multiply: ["$asset.currentPrice", "$quantityBalance", "$asset.category.currency.valueUsd"] },
            },
            currentValueTry: {
              $sum: {
                  $multiply: ["$asset.currentPrice", "$quantityBalance", "$asset.category.currency.valueTry"] },
            },
          }
        },
        {
        $group: {
          _id: "$asset.categoryId",
          category: { $first: "$asset.category" },
          categoryCostUsd: { $sum: "$costUsd" },
          categoryPaidUsd: { $sum: "$paidUsd" },
          categoryCostTry: { $sum: "$costTry" },
          categoryPaidTry: { $sum: "$paidTry" },
          categoryCurrentValueUsd: { $sum: "$currentValueUsd" },
          categoryCurrentValueTry: { $sum: "$currentValueTry" },
          }
        },
        {
          $addFields: {
            marginUsd: {
              $subtract: [
                { $add: ["$categoryCurrentValueUsd", "$categoryPaidUsd"]},
                "$categoryCostUsd",
              ],
            },
            marginTry: {
              $subtract: [
                { $add: ["$categoryCurrentValueTry", "$categoryPaidTry"]},
                "$categoryCostTry",
              ],
            },
          }
        },
        {
          $addFields: {
            marginUsdPerc: {
              $multiply: [
                { $divide: ["$marginUsd", "$categoryCostUsd"], },
                100                
              ],              
            },
            marginTryPerc: {
              $multiply: [
                { $divide: ["$marginTry", "$categoryCostTry"], },
                100                
              ],              
            },
          }
        },
        {
          $project: {
            category: 1,
            categoryCurrentValueUsd: 1,
            categoryCurrentValueTry: 1,
            marginUsd: 1,
            marginTry: 1,
            marginUsdPerc: 1,
            marginTryPerc: 1
          }
          },
          {
            $sort: { categoryCurrentValueUsd: -1 },
          },
      ]);
      res.json(trades);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

module.exports = router;