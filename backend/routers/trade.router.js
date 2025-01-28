const express = require("express");
const router = express.Router();
const Trade = require("../models/trade");
const {v4:uuidv4} = require("uuid");


router.get("/", async (req, res) => {
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
          $addFields: {
            currencySymbol: "$asset.category.currency.symbol",
          },
        },
        {
          $sort: { tradeDate: -1 },
        },
      ]);
      res.json(trades);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });


router.post("/add", async (req, res) => {
    try{
        const model = req.body;
        const trade = new Trade({
            _id: uuidv4(),
            assetId: model.asset._id,
            tradeType: model.tradeType,
            price: model.price,
            quantity: model.quantity,
            paidUsd: model.paidUsd,
            paidTry: model.paidTry,
            tradeDate: new Date(model.tradeDate),
            createdDateTime: new Date()
        });
            await trade.save();
            res.json({message: "İşlem başarıyla eklendi!"});

    }catch (error) {
        res.status(500).json({message: error.message});
    }
});

router.post("/update", async (req, res) => {
  try{
    const updateTrade = req.body
    delete updateTrade.asset
    await Trade.findByIdAndUpdate(updateTrade._id, updateTrade)
    res.json({message: "İşlem başarıyla güncellendi!"})
  }catch (error){
    res.status(500).json({message: error.message})
  }
})

router.post("/removeById", async (req, res) => {
  try{
    const removeTrade = req.body
    await Trade.findByIdAndDelete(removeTrade._id)
    res.json({message: "İşlem başarıyla silindi!"})
  }catch (error){
    res.status(500).json({message: error.message})
  }
})

module.exports = router;