const express = require("express");
const router = express.Router();
const User = require("../models/user");
const {v4:uuidv4} = require("uuid");
const jwt = require("jsonwebtoken");

const secretKey = "Bullseye Wallet Secret Key";
const options = {
    expiresIn: "1d"
};



router.post("/register/add", async (req, res) => {
  try{
    const model = req.body;
    const checkEmail = await User.findOne({email: model.email});
    if(checkEmail != null){
      res.status(403).json({message: "Emaile bağlı bir hesap mevcut!"});
    }else{
      const user = new User({
        _id: uuidv4(),
        name: model.name,
        surname: model.surname,
        email: model.email,
        password: model.password,
        role: "user",
        createdDateTime: new Date()
      });
      await user.save();
      res.json({message: "Kayıt başarılı!"});
    }
  } catch (error) {
    res.status(500).json({message: error.message});
  }
});


router.post("/login", async (req, res) => {
  try{
    const model = req.body;
    const checkUser = await User.findOne({email: model.email});
    if(checkUser == null || checkUser.password != model.password){
      res.status(403).json({message: "Email veya şifre hatalı!"});
    }else{
      const token = jwt.sign({id: checkUser._id, role: checkUser.role}, secretKey, options)
      const model = {message: "Giriş başarılı!", token: token, user: checkUser}
      res.json(model);
    }
  } catch (error) {
    res.status(500).json({message: error.message});
  }
});



module.exports = router;