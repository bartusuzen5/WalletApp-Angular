import { AssetModel } from "../../asset/models/asset.model"

export class TradeModel{
    _id: string
    user: string
    asset: AssetModel
    tradeType: boolean
    price: number
    quantity: number
    paidUsd: number
    paidTry: number
    tradeDate: Date
    currencySymbol: string;
    createdDateTime: Date
}