const express = require("express");
const router = express.Router();
const Dividend = require("../models/dividend");
const {v4:uuidv4} = require("uuid");


router.get("/", async (req, res) => {
    try {
      let dividends = await Dividend.aggregate([
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
          $sort: { dividendDate: -1 },
        },
      ]);
      res.json(dividends);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });


router.post("/add", async (req, res) => {
    try{
        const model = req.body;
        const dividend = new Dividend({
            _id: uuidv4(),
            assetId: model.asset._id,
            paymentPerQuantity: model.paymentPerQuantity,
            quantity: model.quantity,
            yield: model.yield / 100,
            paidUsd: model.paidUsd,
            paidTry: model.paidTry,
            dividendDate: new Date(model.dividendDate),
            createdDateTime: new Date()
        });
            await dividend.save();
            res.json({message: "Temettü başarıyla eklendi!"});

    }catch (error) {
        res.status(500).json({message: error.message});
    }
});

router.post("/update", async (req, res) => {
  try{
    const updateDividend = req.body
    delete updateDividend.asset
    updateDividend.yield /= 100
    await Dividend.findByIdAndUpdate(updateDividend._id, updateDividend)
    res.json({message: "Temettü başarıyla güncellendi!"})
  }catch (error){
    res.status(500).json({message: error.message})
  }
})

router.post("/removeById", async (req, res) => {
  try{
    const removeDividend = req.body
    await Dividend.findByIdAndDelete(removeDividend._id)
    res.json({message: "Temettü başarıyla silindi!"})
  }catch (error){
    res.status(500).json({message: error.message})
  }
})

module.exports = router;