import jwt from "jsonwebtoken";

interface UserTokenService {
  username: string;
  role: string;
}

export const ACCESS_TOKEN_SECRET = "UltraSecret";

export class TokenService {
  static generateAccessToken(user: UserTokenService) {
    return jwt.sign({ ...user }, ACCESS_TOKEN_SECRET);
  }

  static verifyAccessToken(token: string) {
    try {
      const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
      return decoded;
    } catch (error) {
      return null;
    }
  }
}
