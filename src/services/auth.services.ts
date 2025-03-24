import jwt, { SignOptions } from 'jsonwebtoken'
import { injectable } from 'inversify'

// Interfaces
import { IAuthService } from '~/interfaces/IAuthService'

@injectable()
export class AuthService implements IAuthService {
  private readonly secretKey: string = process.env.JWT_SECRET as string

  public async signAccessToken(
    payload: string | object | Buffer,
    privateKey: string = this.secretKey,
    options: SignOptions = { algorithm: 'HS256', expiresIn: '30m' }
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      jwt.sign(payload, privateKey, options, (err, token) => {
        if (err) {
          reject(err)
          return
        }
        resolve(token as string)
      })
    })
  }

  public async signRefreshToken(
    payload: string | object | Buffer,
    privateKey: string = this.secretKey,
    options: SignOptions = { algorithm: 'HS256', expiresIn: '100d' }
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      jwt.sign(payload, privateKey, options, (err, token) => {
        if (err) {
          reject(err)
          return
        }
        resolve(token as string)
      })
    })
  }

  public async verifyToken(token: string, privateKey: string = this.secretKey): Promise<TokenPayload> {
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
}
