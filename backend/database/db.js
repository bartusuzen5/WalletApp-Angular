const mongoose = require("mongoose");

const uri = "mongodb+srv://bartusuzen:qfix2025*@eticaretdb.16ngz.mongodb.net/?retryWrites=true&w=majority&appName=walletApp"

const connection = () =>{
    mongoose.connect(uri,{
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log("MongoDb baglantisi basarili"))
    .catch((err) => console.log("Baglanti Hatasi! Hata: " + err.message));
}

module.exports = connection;