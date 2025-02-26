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
        if(checkName){
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


router.delete("/removeById/:id", async (req, res) => {
    try {
        const currencyId = req.params.id;
        const currency = await Currency.findById(currencyId);
        if (!currency) {
            return res.status(404).json({ message: "Para birimi bulunamadı" });
        }
        await Category.updateMany(
            { currencyId: currencyId},
            { $set: {currencyId: null}}
        );
        await currency.deleteOne();
        res.json({message: "Para birimi başarıyla silindi!"});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});


router.put("/update/:id", async (req, res) => {
    try{
        const currencyId = req.params.id;
        const updateCurrency = req.body;
        const checkName = await Currency.findOne({name: updateCurrency.name});
        if (checkName && checkName._id.toString() != currencyId){
            res.status(403).json({message: "Aynı isimde para birimi mevcut!"});
        } else {
            await Currency.findByIdAndUpdate(currencyId, updateCurrency);
            res.json({message: "Para birimi başarıyla güncellendi!"});
        }
    } catch (error) {
        res.status(500).json({message: error.message});
    }
})


module.exports = router;