const express = require("express");
const router = express.Router();
const User = require("../models/user");
const {v4:uuidv4} = require("uuid");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt")

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
      const hashedPassword = await bcrypt.hash(model.password, 10)
      const user = new User({
        _id: uuidv4(),
        name: model.name,
        surname: model.surname,
        email: model.email,
        password: hashedPassword,
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


router.put("/register/updateUser/:id", async (req, res) => {
  try{
    const model = req.body;
    const id = req.params.id
    const updateUser = await User.findById(id)
    const checkEmail = await User.findOne({email: model.email});
    if(checkEmail != null && checkEmail._id != updateUser._id){
      res.status(403).json({message: "Emaile bağlı bir hesap mevcut!"});
    }else{
      model.password = updateUser.password
      model.createdDateTime = updateUser.createdDateTime
      await User.findByIdAndUpdate(id, model);
      res.json({message: "Kullanıcı başarıyla güncellenmiştir!"});
    }
  } catch (error) {
    res.status(500).json({message: error.message});
  }
});

router.put("/register/updatePassword/:id", async (req, res) => {
  try{
    const {oldPassword, newPassword} = req.body;
    const id = req.params.id
    const currentUser = await User.findById(id)
    const isPasswordMatch = await bcrypt.compare(oldPassword, currentUser.password)
    if(!isPasswordMatch){
      res.status(403).json({message: "Eski Şifre Hatalı!"});
    }else{
      const hashedPassword = await bcrypt.hash(newPassword.password, 10)
      await User.findByIdAndUpdate(id, {password: hashedPassword});
      res.json({message: "Kullanıcı başarıyla güncellenmiştir!"});
    }
  } catch (error) {
    res.status(500).json({message: error.message});
  }
});


router.post("/login", async (req, res) => {
  try{
    const model = req.body;
    const checkUser = await User.findOne({email: model.email});
    const isPasswordValid = await bcrypt.compare(model.password, checkUser.password)
    if(checkUser == null || !isPasswordValid){
      res.status(403).json({message: "Email veya şifre hatalı!"});
    }else{
      const token = jwt.sign({_id: checkUser._id, name:checkUser.name, surname: checkUser.surname, email:checkUser.email, role: checkUser.role}, secretKey, options)
      const response = {message: "Giriş başarılı!", token: token}
      res.json(response);
    }
  } catch (error) {
    res.status(500).json({message: error.message});
  }
});

module.exports = router;