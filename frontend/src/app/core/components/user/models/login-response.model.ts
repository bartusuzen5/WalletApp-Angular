import { UserModel } from "./user.model";

export class LoginResponseModel{
    message: string;
    token: string;
    user: UserModel = new UserModel()
}