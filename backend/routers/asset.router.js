const express = require("express");
const router = express.Router();
const {v4:uuidv4} = require("uuid");
const Asset = require("../models/asset");
const Trade = require("../models/trade");


router.get("/", async (req, res) => {
    try {
      let assets = await Asset.aggregate([
        {
          $lookup: {
            from: "categories",
            localField: "categoryId",
            foreignField: "_id",
            as: "category",
          },
        },
        {
          $unwind: {
            path: "$category",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "currencies",
            localField: "category.currencyId",
            foreignField: "_id",
            as: "category.currency",
          },
        },
        {
          $unwind: {
            path: "$category.currency",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $addFields: {
            symbol: "$category.currency.symbol",
            fieldType: {
              $cond: {
                if: { $in: ["$key", ["quantity", "volume"]] },
                then: "number",
                else: "currency"
              },
            },
          },
        },
        {
          $sort: { name: 1 },
        },
      ]);
      res.json(assets);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  
  router.post("/getByCategory", async (req, res) => {
    try {
      const {categoryId} = req.body
      let assets = await Asset.aggregate([
        {
          $match: {
            categoryId: categoryId,
          },
        },
        {
          $lookup: {
            from: "categories",
            localField: "categoryId",
            foreignField: "_id",
            as: "category",
          },
        },
        {
          $unwind: {
            path: "$category",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "currencies",
            localField: "category.currencyId",
            foreignField: "_id",
            as: "category.currency",
          },
        },
        {
          $unwind: {
            path: "$category.currency",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $addFields: {
            currencySymbol: "$category.currency.symbol",
          },
        },
        {
          $sort: { name: 1 },
        },
      ]);
      res.json(assets);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  
  router.post("/add", async (req, res) => {
    try{
      const model = req.body;
      const checkName = await Asset.findOne({name: model.name});
      const checkCode = await Asset.findOne({code: model.code});
      if (checkName){
        res.status(403).json({message: "Aynı isimde varlık mevcut!"});
      } else if (checkCode){
        res.status(403).json({message: "Aynı koda sahip varlık mevcut!"});
      } else {
        const asset = new Asset({
          _id: uuidv4(),
          name: model.name,
          code: model.code,
          currentPrice: model.currentPrice,
          athPrice: model.athPrice,
          volume: model.volume,
          categoryId: model.category._id,
          createdDateTime: new Date()
        });
        await asset.save();
        res.json({message: "Varlık başarıyla eklendi!"})
      }
    } catch (error) {
      res.status(500).json({message: error.message});
    }
  });


  router.put("/update/:id", async (req, res) => {
    try{
      const assetId = req.params.id
      let updateAsset = req.body;
      delete updateAsset.category;
      delete updateAsset.currency;
      const checkName = await Asset.findOne({name: updateAsset.name});
      const checkCode = await Asset.findOne({code: updateAsset.code});
      if (checkName && checkName._id.toString() != assetId){
        res.status(403).json({message: "Aynı isimde varlık mevcut!"});
      } else if (checkCode && checkCode._id.toString() != assetId){
        res.status(403).json({message: "Aynı koda sahip varlık mevcut!"});
      } else {
        await Asset.findByIdAndUpdate(assetId, updateAsset);
        res.json({message: "Varlık başarıyla güncellendi!"})
      }
    } catch (error) {
      res.status(500).json({message: error.message});
    }
  });


  router.delete("/removeById/:id", async(req, res) => {
    try{
      const id = req.params.id;
      const asset = Asset.findById(id)
      if (!asset) {
        return res.status(404).json({ message: "Varlık bulunamadı" });
      }
      await Trade.deleteMany({ assetId: id });
      await asset.deleteOne();
      res.json({message: "Varlık başarıyla silindi!"});
    }catch (error) {
      res.status(500).json({message: error.message});
    }
  })

module.exports = router;