export interface IUserService {
  register(userData: UserRegisterBody): Promise<{ user: UserModel; accessToken: string; refreshToken: string }>
  login(credentials: UserLoginBody): Promise<{ user: UserModel; accessToken: string; refreshToken: string }>
  logout(refreshToken: string): Promise<boolean>
  emailVerify(decoded_email_verify_token: TokenPayload): Promise<{ accessToken: string; refreshToken: string }>
}
