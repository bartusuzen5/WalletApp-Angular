import { AssetModel } from "../../asset/models/asset.model"

export class DividendModel{
    _id: string;
    asset: AssetModel;
    paymentPerQuantity: number;
    quantity: number;
    yield: number;
    paidUsd: number;
    paidTry: number;
    dividendDate: Date;
    createdDateTime: Date;
}