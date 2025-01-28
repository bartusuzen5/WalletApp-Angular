import { CategoryModel } from "../../category/models/category.model";

export class AssetModel {
    _id: string;
    name: string;
    code: string;
    currentPrice: number;
    athPrice: number;
    volume: number;
    category: CategoryModel;
    currencySymbol: string;
    createdDateTime: Date;
}