import { CurrencyModel } from "../../currency/models/currency.model";

export class WalletCurrencyModel{
    _id: string;
    item: CurrencyModel;
    currentValueTry: number;
    currentValueUsd: number;
}