const express = require("express");
const router = express.Router();
const Dividend = require("../models/dividend");
const {v4:uuidv4} = require("uuid");


router.get("/:id", async (req, res) => {
    try {
      const userId = req.params.id
      let dividends = await Dividend.aggregate([
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
          $sort: { dividendDate: -1 },
        },
      ]);
      res.json(dividends);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });


router.post("/add/:id", async (req, res) => {
    try{
        const dividend = req.body;
        const userId = req.params.id
        const newDividend = new Dividend({
            _id: uuidv4(),
            userId: userId,
            assetId: dividend.asset._id,
            paymentPerQuantity: dividend.paymentPerQuantity,
            quantity: dividend.quantity,
            yield: dividend.yield / 100,
            paidUsd: dividend.paidUsd,
            paidTry: dividend.paidTry,
            dividendDate: new Date(dividend.dividendDate),
            createdDateTime: new Date()
        });
            await newDividend.save();
            res.json({message: "Temettü başarıyla eklendi!"});

    }catch (error) {
        res.status(500).json({message: error.message});
    }
});

router.put("/update/:id", async (req, res) => {
  try{
    const dividendId = req.params.id
    let updateDividend = req.body
    delete updateDividend.asset
    updateDividend.yield /= 100
    await Dividend.findByIdAndUpdate(dividendId, updateDividend)
    res.json({message: "Temettü başarıyla güncellendi!"})
  }catch (error){
    res.status(500).json({message: error.message})
  }
})

router.delete("/removeById/:id", async (req, res) => {
  try{
    const id = req.params.id
    const dividend = await Dividend.findById(id)
    if (!dividend) {
      return res.status(404).json({ message: "Temettü işlemi bulunamadı" });
    }
    await dividend.deleteOne();
    res.json({message: "Temettü başarıyla silindi!"})
  }catch (error){
    res.status(500).json({message: error.message})
  }
})

module.exports = router;