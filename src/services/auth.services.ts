import jwt, { SignOptions } from 'jsonwebtoken'
import { injectable } from 'inversify'

// Constants
import { TokenType } from '~/constants/enums'

// Interfaces
import { IAuthService } from '~/interfaces/IAuthService'

@injectable()
export class AuthService implements IAuthService {
  private readonly JWT_SECRET_ACCESS_TOKEN: string = process.env.JWT_SECRET_ACCESS_TOKEN as string
  private readonly JWT_SECRET_REFRESH_TOKEN: string = process.env.JWT_SECRET_REFRESH_TOKEN as string
  private readonly JWT_SECRET_VERIFY_EMAIL: string = process.env.JWT_SECRET_VERIFY_EMAIL as string

  public signAccessToken(payload: string | object | Buffer): Promise<string> {
    return this.signToken(payload, this.JWT_SECRET_ACCESS_TOKEN, {
      algorithm: 'HS256',
      expiresIn: '30m'
    })
  }

  public signRefreshToken(payload: string | object | Buffer): Promise<string> {
    return this.signToken(payload, this.JWT_SECRET_REFRESH_TOKEN, {
      algorithm: 'HS256',
      expiresIn: '100d'
    })
  }
  public signEmailVerifyToken(payload: string | object | Buffer): Promise<string> {
    return this.signToken(payload, this.JWT_SECRET_VERIFY_EMAIL, {
      algorithm: 'HS256',
      expiresIn: '7d'
    })
  }

  public async verifyToken(token: string, type: TokenType): Promise<TokenPayload> {
    let privateKey: string
    switch (type) {
      case TokenType.AccessToken:
        privateKey = this.JWT_SECRET_ACCESS_TOKEN
        break
      case TokenType.RefreshToken:
        privateKey = this.JWT_SECRET_REFRESH_TOKEN
        break
      case TokenType.EmailVerifyToken:
        privateKey = this.JWT_SECRET_VERIFY_EMAIL
        break
      default:
        throw new Error('Invalid token type')
    }
    return new Promise((resolve, reject) => {
      jwt.verify(token, privateKey, (err, decoded) => {
        if (err) {
          reject(err)
          return
        }
        resolve(decoded as TokenPayload)
      })
    })
  }

  private async signToken(payload: string | object | Buffer, secret: string, options: SignOptions): Promise<string> {
    return new Promise((resolve, reject) => {
      jwt.sign(payload, secret, options, (err, token) => {
        if (err) {
          reject(err)
          return
        }
        resolve(token as string)
      })
    })
  }
}
