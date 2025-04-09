import { SignOptions } from 'jsonwebtoken'
import { TokenType } from '~/constants/enums'

export interface IAuthService {
  signAccessToken(payload: string | object | Buffer, privateKey?: string, options?: SignOptions): Promise<string>
  signRefreshToken(payload: string | object | Buffer, privateKey?: string, options?: SignOptions): Promise<string>
  signEmailVerifyToken(payload: string | object | Buffer, privateKey?: string, options?: SignOptions): Promise<string>
  verifyToken(token: string, type: TokenType): Promise<TokenPayload>
}
