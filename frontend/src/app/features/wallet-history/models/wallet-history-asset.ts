import { AssetModel } from "../../asset/models/asset.model";

export class WalletHistoryAssetModel{
    _id: string
    asset: AssetModel;
    valueUsd: number;
    valueTry: number;
    marginUsd: number;
    marginTry: number;
    date: Date;
    createdDateTime: Date;
}