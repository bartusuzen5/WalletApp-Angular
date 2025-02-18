import { UserModel } from "../../../core/components/user/models/user.model"
import { CurrencyModel } from "../../currency/models/currency.model"

export class WalletCurrencyModel{
    _id: string;
    user: UserModel;
    currency: CurrencyModel;
    quantity: number;
    createdDateTime: Date;
}