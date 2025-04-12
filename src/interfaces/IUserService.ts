export interface IUserService {
  register(userData: UserRegisterBody): Promise<{ user: UserModel; accessToken: string; refreshToken: string }>
  login(credentials: UserLoginBody): Promise<{ user: UserModel; accessToken: string; refreshToken: string }>
  logout(refreshToken: string): Promise<boolean>
  emailVerify(decoded_email_verify_token: TokenPayload): Promise<{ accessToken: string; refreshToken: string }>
  resendEmailVerify(decoded_authorization: TokenPayload): Promise<boolean>
  forgotPassword(email: string): Promise<boolean>
  forgotPasswordVerify(
    decoded_forgot_password_verify_token: TokenPayload,
    forgotPasswordToken: string
  ): Promise<boolean>
}
