import { AssetModel } from "../../asset/models/asset.model";

export class WalletAssetModel{
    _id: string;
    item: AssetModel;
    currentValueTry: number;
    currentValueUsd: number;
    marginTry: number;
    marginUsd: number;
    marginTryPerc: number;
    marginUsdPerc: number;
}