import { Response, Request } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { inject, injectable } from 'inversify'

// Constants
import USERS_MESSAGES from '~/constants/messages'
import HTTP_STATUS from '~/constants/httpStatus'
import { TYPES_SERVICE } from '~/constants/types'

// Interfaces
import { IUserService } from '~/interfaces/IUserService'

@injectable()
export class UserController {
  constructor(@inject(TYPES_SERVICE.UserService) private readonly UserService: IUserService) {}

  public register = async (req: Request<ParamsDictionary, any, UserRegisterBody>, res: Response) => {
    const userExist = await this.UserService.register(req.body)
    if (userExist) {
      res.status(HTTP_STATUS.CREATED).json({
        message: USERS_MESSAGES.REGISTER_SUCCESS,
        id: userExist.user.id,
        accessToken: userExist.accessToken,
        refreshToken: userExist.refreshToken
      })
    } else {
      res.status(HTTP_STATUS.BAD_REQUEST).json({ message: USERS_MESSAGES.REGISTER_FAILED })
    }
  }

  public login = async (req: Request<ParamsDictionary, any, UserLoginBody>, res: Response) => {
    const userExist = await this.UserService.login(req.body)
    if (userExist) {
      res.status(HTTP_STATUS.OK).json({
        message: USERS_MESSAGES.LOGIN_SUCCESS,
        id: userExist.user.id,
        accessToken: userExist.accessToken,
        refreshToken: userExist.refreshToken
      })
    } else {
      res.status(HTTP_STATUS.BAD_REQUEST).json({ message: USERS_MESSAGES.LOGIN_FAILED })
    }
  }

  public logout = async (req: Request<ParamsDictionary, any, UserLogoutBody>, res: Response) => {
    const { refreshToken } = req.body
    const result = await this.UserService.logout(refreshToken)
    if (result) {
      res.status(HTTP_STATUS.OK).json({
        message: USERS_MESSAGES.LOGOUT_SUCCESS
      })
    } else {
      res.status(HTTP_STATUS.BAD_REQUEST).json({ message: USERS_MESSAGES.LOGOUT_FAILED })
    }
  }

  public emailVerify = async (req: Request<ParamsDictionary, any, UserVerifyEmailBody>, res: Response) => {
    const result = await this.UserService.emailVerify(req.decoded_email_verify_token as TokenPayload)
    if (result) {
      res.status(HTTP_STATUS.OK).json({
        message: USERS_MESSAGES.VERIFIED_EMAIL_SUCCESS,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken
      })
    } else {
      res.status(HTTP_STATUS.BAD_REQUEST).json({ message: USERS_MESSAGES.VERIFIED_EMAIL_FAILED })
    }
  }

  public resendEmailVerify = async (req: Request, res: Response) => {
    const result = await this.UserService.resendEmailVerify(req.decoded_authorization as TokenPayload)
    if (result) {
      res.status(HTTP_STATUS.OK).json({
        message: USERS_MESSAGES.RESEND_VERIFY_EMAIL_SUCCESS
      })
    } else {
      res.status(HTTP_STATUS.BAD_REQUEST).json({ message: USERS_MESSAGES.RESEND_VERIFY_EMAIL_FAILED })
    }
  }

  public forgotPassword = async (req: Request<ParamsDictionary, any, UserForgotPasswordBody>, res: Response) => {
    const { email } = req.body
    const result = await this.UserService.forgotPassword(email as string)
    if (result) {
      res.status(HTTP_STATUS.OK).json({
        message: USERS_MESSAGES.CHECK_EMAIL_TO_RESET_PASSWORD
      })
    } else {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: USERS_MESSAGES.EMAIL_TO_RESET_PASSWORD_FAILED
      })
    }
  }
}
