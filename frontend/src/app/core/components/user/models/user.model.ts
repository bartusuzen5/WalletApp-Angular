export class UserModel{
  _id: string;
  name: string;
  surname: string;
  email: string;
  password: string;
  role: string
  createdDateTime: string;

  constructor(data?: Partial<UserModel>) {
    this._id = data?._id || '';
    this.name = data?.name || '';
    this.surname = data?.surname || '';
    this.email = data?.email || '';
    this.password = data?.password || '';
    this.role = data?.role || '';
    this.createdDateTime = data?.createdDateTime || '';
  }
}