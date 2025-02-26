const express = require("express");
const router = express.Router();
const Trade = require("../models/trade");
const {v4:uuidv4} = require("uuid");


router.get("/:id", async (req, res) => {
    try {
      const userId = req.params.id
      let trades = await Trade.aggregate([
        {
          $match: {
            userId: userId,
          },
        },
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


router.post("/add/:id", async (req, res) => {
    try{
        const trade = req.body;
        const userId = req.params.id
        const newTrade = new Trade({
            _id: uuidv4(),
            userId: userId,
            assetId: trade.asset._id,
            tradeType: trade.tradeType,
            price: trade.price,
            quantity: trade.quantity,
            paidUsd: trade.paidUsd,
            paidTry: trade.paidTry,
            tradeDate: new Date(trade.tradeDate),
            createdDateTime: new Date()
        });
            await newTrade.save();
            res.json({message: "İşlem başarıyla eklendi!"});

    }catch (error) {
        res.status(500).json({message: error.message});
    }
});

router.put("/update/:id", async (req, res) => {
  try{
    const tradeId = req.params.id
    const updateTrade = req.body
    delete updateTrade.asset
    await Trade.findByIdAndUpdate(tradeId, updateTrade)
    res.json({message: "İşlem başarıyla güncellendi!"})
  }catch (error){
    res.status(500).json({message: error.message})
  }
})

router.delete("/removeById/:id", async (req, res) => {
  try{
    const id = req.params.id
    const trade = await Trade.findById(id)
    if (!trade) {
      return res.status(404).json({ message: "İşlem bulunamadı" });
    }
    await trade.deleteOne();
    res.json({message: "İşlem başarıyla silindi!"})
  }catch (error){
    res.status(500).json({message: error.message})
  }
})

module.exports = router;