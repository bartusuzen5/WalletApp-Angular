const express = require("express");
const router = express.Router();
const Currency = require("../models/currency");
const {v4:uuidv4} = require("uuid");
const Category = require("../models/category");

router.get("/", async(req, res) => {
    try{
        const currencies = await Currency.find().sort({name: 1});
        res.json(currencies);
    } catch (error) {
        res.status(500).json({message: error.message})
    }
});


router.post("/add", async (req, res) => {
    try{
        const model = req.body;
        const checkName = await Currency.findOne({name: model.name});
        if(checkName != null){
            res.status(403).json({message: "Aynı isimde para birimi mevcut!"});
        }else{
            const currency = new Currency({
                _id: uuidv4(),
                name: model.name,
                symbol: model.symbol,
                valueUsd: model.valueUsd,
                valueTry: model.valueTry,
                createdDateTime: new Date()
            });
            await currency.save();
            res.json({message: "Para birimi başarıyla eklendi!"});
        }
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});


router.post("/removeById", async (req, res) => {
    try {
        const id = req.body;
        await Currency.findByIdAndDelete(id);
        await Category.updateMany(
            { currencyId: id},
            { $set: {currencyId: null}}
        );
        res.json({message: "Para birimi başarıyla silindi!"});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});


router.post("/update", async (req, res) => {
    try{
        const updateCurrency = req.body;
        const checkName = await Currency.findOne({name: updateCurrency.name});
        if (checkName != null && checkName._id.toString() != updateCurrency._id){
            res.status(403).json({message: "Aynı isimde para birimi mevcut!"});
        } else {
            await Currency.findByIdAndUpdate(updateCurrency._id, updateCurrency);
            res.json({message: "Para birimi başarıyla güncellendi!"});
        }
    } catch (error) {
        res.status(500).json({message: error.message});
    }
})


module.exports = router;