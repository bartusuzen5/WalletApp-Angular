const express = require("express");
const router = express.Router();
const WalletCurrency = require("../models/wallet-currency");
const {v4:uuidv4} = require("uuid");


router.get("/:id", async(req, res) => {
    try{
    userId = req.params.id
    let walletCurrencies = await WalletCurrency.aggregate([
        {
            $match: {
              userId: userId,
            },
        },
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
        $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user"
        }
        },
        {
        $unwind: {
            path: "$user",
            preserveNullAndEmptyArrays: true
        }  
        },
        {
        $project: {
            currencyId: 0,
            userId: 0
        }
        }
    ])
    .sort({name: 1});
    res.json(walletCurrencies);
    } catch (error) {
    res.status(500).json({message: error.message});
    }
});


router.post("/add", async (req, res) => {
    try{
        const model = req.body;
        const existingWalletCurrency = await WalletCurrency.findOne({
            userId: model.user._id,
            currencyId: model.currency._id
        });
        if (existingWalletCurrency){
            return res.status(400).json({ message: "Bu kullanıcı için bu varlık zaten mevcut." });
        } else {
            const walletCurrencyNew = new WalletCurrency({
                _id: uuidv4(),
                userId: model.user._id,
                currencyId: model.currency._id,
                quantity: model.quantity,
                createdDateTime: new Date()
            });
            await walletCurrencyNew.save();
            res.json({message: "Döviz/Nakit başarıyla eklendi!"});
        }
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});


router.put("/update/:id", async (req, res) => {
    try{
        const model = req.body;
        const id = req.params.id;
        const walletCurrencyUpdate = await WalletCurrency.findById(id);
        if(walletCurrencyUpdate){
            await WalletCurrency.findByIdAndUpdate(id, model)
            res.json({message: "Döviz/Nakit başarıyla güncellendi!"});
        }
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

module.exports = router;