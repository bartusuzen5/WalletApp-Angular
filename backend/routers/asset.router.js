const express = require("express");
const router = express.Router();
const Category = require("../models/category");
const {v4:uuidv4} = require("uuid");
const Currency = require("../models/currency");
const Asset = require("../models/asset");
const { model } = require("mongoose");
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
      let {categoryId} = req.body
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
      let model = req.body;
      let checkName = await Asset.findOne({name: model.name});
      let checkCode = await Asset.findOne({code: model.code});
      if (checkName != null){
        res.status(403).json({message: "Aynı isimde varlık mevcut!"});
      } else if (checkCode != null){
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


  router.post("/update", async (req, res) => {
    try{
      let updateAsset = req.body;
      delete updateAsset.category;
      delete updateAsset.currency;
      let checkName = await Asset.findOne({name: updateAsset.name});
      let checkCode = await Asset.findOne({code: updateAsset.code});
      if (checkName != null && checkName._id.toString() != updateAsset._id){
        res.status(403).json({message: "Aynı isimde varlık mevcut!"});
      } else if (checkCode != null && checkCode._id.toString() != updateAsset._id){
        res.status(403).json({message: "Aynı koda sahip varlık mevcut!"});
      } else {
        await Asset.findByIdAndUpdate(updateAsset._id, updateAsset);
        res.json({message: "Varlık başarıyla güncellendi!"})
      }
    } catch (error) {
      res.status(500).json({message: error.message});
    }
  });


  router.post("/removeById", async(req, res) => {
    try{
      const id = req.body;
      await Asset.findByIdAndDelete(id);
      await Trade.deleteMany({ assetId: id });
      res.json({message: "Varlık başarıyla silindi!"});
    }catch (error) {
      res.status(500).json({message: error.message});
    }
  })

module.exports = router;