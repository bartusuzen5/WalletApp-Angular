import { CategoryModel } from "../../category/models/category.model";

export class WalletCategoryModel{
    _id: string;
    item: CategoryModel;
    currentValueTry: number;
    currentValueUsd: number;
    marginTry: number;
    marginUsd: number;
    marginTryPerc: number;
    marginUsdPerc: number;
}