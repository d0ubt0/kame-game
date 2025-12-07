import bc from "bcrypt";

export class PasswordService {
  static async hashPassword(password: string) {
    return bc.hash(password, 10);
  }

  static async isSamePassword(password: string, hashedPassword: string) {
    return bc.compare(password, hashedPassword);
  }
}
