import { CurrencyModel } from "../../currency/models/currency.model";

export class WalletHistoryCurrencyModel{
    _id: string
    currency: CurrencyModel;
    valueUsd: number;
    valueTry: number;
    marginUsd: number;
    marginTry: number;
    date: Date;
    createdDateTime: Date;
}