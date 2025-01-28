import { CurrencyModel } from "../../currency/models/currency.model";

export class CategoryModel {
    _id: string;
    name: string;
    currency: CurrencyModel;
    createdDateTime: Date;
}