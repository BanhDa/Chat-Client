/**
 * New typescript file
 */
export class User {
  userId: string;
  email: string;
  password: string;
  userName: string;
  gender: number;
  birthday: string;
  avatar: string;

  constructor() {
    this.userId = '';
    this.email = '';
    this.password = '';
    this.userName = '';
    this.gender = 0;
    this.birthday = '';
    this.avatar = '';
  }
}
