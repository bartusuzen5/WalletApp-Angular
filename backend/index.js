const express = require("express");
const app = express();
const cors = require("cors");
const connection = require("./database/db");


app.use(express.json());
app.use(cors());

const currencyRouter = require("./routers/currency.router");
const categoryRouter = require("./routers/category.router");
const assetRouter = require("./routers/asset.router");
const tradeRouter = require("./routers/trade.router");
const dividendRouter = require("./routers/dividend.router");
const walletRouter = require("./routers/wallet.router");
const userRouter = require("./routers/user.router");

app.use("/api/currency", currencyRouter);
app.use("/api/category", categoryRouter);
app.use("/api/asset", assetRouter);
app.use("/api/trade", tradeRouter);
app.use("/api/dividend", dividendRouter);
app.use("/api/wallet", walletRouter);
app.use("/api/user", userRouter);

connection();

const port = process.env.PORT || 5000;
app.listen(port,()=> console.log("Uygulama http://localhost:4200 portunda ayağa kalkti!"));