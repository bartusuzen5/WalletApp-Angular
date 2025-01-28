const express = require("express");
const router = express.Router();
const Category = require("../models/category");
const {v4:uuidv4} = require("uuid");
const Currency = require("../models/currency");
const { model } = require("mongoose");
const Asset = require("../models/asset");


router.get("/", async(req, res) => {
  try{
    let categories = await Category.aggregate([
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
        $project: {
          currencyId: 0
        }
      }
    ])
    .sort({name: 1});
    res.json(categories);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
});


router.post("/getById", async(req, res) => {
  try{
    let {categoryId} = req.body;
    let category = await Category.findOne({ _id: categoryId })
      .populate({
        path: "currencyId",
        model: "Currency",
      })
    let formattedCategory = {
      ...category.toObject(),
      currency: category.currencyId,
    };
    delete formattedCategory.currencyId;
    res.json(category);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
});


router.post("/add", async (req, res) => {
  try{
    let model = req.body;
    let checkName = await Category.findOne({name: model.name});
    if (checkName != null){
      res.status(403).json({message: "Aynı isimde kategori mevcut!"});
    }else {
      const category = new Category({
        _id: uuidv4(),
        name: model.name,
        currencyId: model.currency._id,
        createdDateTime: new Date()
      });
      await category.save();
      res.json({message: "Kategori başarıyla eklendi!"})
    }
  } catch (error) {
    res.status(500).json({message: error.message});
  }
});


router.post("/update", async (req, res) => {
  try{
    let updateCategory = req.body;
    let checkName = await Category.findOne({name: updateCategory.name});
    if (checkName != null && checkName._id.toString() != updateCategory._id){
      res.status(403).json({message: "Aynı isimde kategori mevcut!"});
    }else {
      updateCategory.currencyId = updateCategory.currency._id;
      delete updateCategory.currency;
      await Category.findByIdAndUpdate(updateCategory._id, updateCategory);
      res.json({message: "Kategori başarıyla güncellendi!"});
    }
  } catch (error){
    res.status(500).json({message: error.message});
  }
})


router.post("/removeById", async(req, res) => {
  try{
    const id = req.body;
    await Category.findByIdAndDelete(id);
    // await Category.updateMany(
    //     { categoryId: id},
    //     { $set: {categoryId: null}}
    // );
    await Asset.deleteMany({ categoryId: id });
    res.json({message: "Kategori başarıyla silindi!"});
  }catch (error) {
    res.status(500).json({message: error.message});
  }
})

module.exports = router;
