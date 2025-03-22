export interface IUserService {
  register(userData: UserRegisterBody): Promise<{ user: UserModel; accessToken: string; refreshToken: string }>
  login(credentials: UserLoginBody): Promise<{ user: UserModel; accessToken: string; refreshToken: string }>
  checkEmailExist(email: string): Promise<UserModel | null>
  checkPassword(password: string, userExist: UserModel): Promise<boolean>
}
