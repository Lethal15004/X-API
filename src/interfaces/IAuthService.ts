import { JwtPayload, SignOptions } from 'jsonwebtoken'

export interface IAuthService {
  signAccessToken(payload: string | object | Buffer, privateKey?: string, options?: SignOptions): Promise<string>
  signRefreshToken(payload: string | object | Buffer, privateKey?: string, options?: SignOptions): Promise<string>
  verifyToken(token: string, privateKet?: string): Promise<JwtPayload>
}
