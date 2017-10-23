/**
 * New typescript file
 */
export class User {
  email: string;
  password: string;
  userName: string;
  gender: number;
  birthday: string;

  constructor() {
    this.email = '';
    this.password = '';
    this.userName = '';
    this.gender = 1;
    this.birthday = '';
  }
}
