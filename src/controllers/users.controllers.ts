import { Response, Request } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { inject, injectable } from 'inversify'

// Configs
import { isProduction } from '~/config/config'

// Constants
import { USERS_MESSAGES } from '~/constants/messages'
import HTTP_STATUS from '~/constants/http-status'
import { TYPES_SERVICE } from '~/constants/types'

// Interfaces
import { IUserService } from '~/interfaces/IUserService'

@injectable()
export class UserController {
  constructor(@inject(TYPES_SERVICE.UserService) private readonly UserService: IUserService) {}
  public pageRegisterGoogle = async (req: Request, res: Response) => {
    res.render('pages/oauth-google', {
      title: 'Sign in with Google - Twitter API'
    })
  }
  public getMe = async (req: Request, res: Response) => {
    const user = await this.UserService.getMe(req.decoded_authorization?.userId as string)
    if (user) {
      res.status(HTTP_STATUS.OK).json({
        message: USERS_MESSAGES.GET_ME_SUCCESS,
        user: user
      })
    } else {
      res.status(HTTP_STATUS.UNAUTHORIZED).json({
        message: USERS_MESSAGES.GET_ME_FAILED
      })
    }
  }

  public getProfile = async (req: Request<UserGetProfileParams>, res: Response) => {
    const { username } = req.params
    const user = await this.UserService.getProfile(username)
    if (user) {
      res.status(HTTP_STATUS.OK).json({
        message: USERS_MESSAGES.GET_PROFILE_SUCCESS,
        user: user
      })
    } else {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: USERS_MESSAGES.GET_PROFILE_FAILED
      })
    }
  }

  public updateMe = async (req: Request<ParamsDictionary, any, UserUpdateBody>, res: Response) => {
    const user = await this.UserService.updateMe(req.decoded_authorization?.userId as string, req.body)
    if (user) {
      res.status(HTTP_STATUS.OK).json({
        message: USERS_MESSAGES.UPDATE_SUCCESS,
        user: user
      })
    } else {
      res.status(HTTP_STATUS.BAD_REQUEST).json({ message: USERS_MESSAGES.UPDATE_FAILED })
    }
  }

  public register = async (req: Request<ParamsDictionary, any, UserRegisterBody>, res: Response) => {
    const userExist = await this.UserService.register(req.body)
    if (userExist) {
      res.status(HTTP_STATUS.CREATED).json({
        message: USERS_MESSAGES.REGISTER_SUCCESS,
        accessToken: userExist.accessToken,
        refreshToken: userExist.refreshToken,
        emailVerifyToken: userExist.user.emailVerifiedToken
      })
    } else {
      res.status(HTTP_STATUS.BAD_REQUEST).json({ message: USERS_MESSAGES.REGISTER_FAILED })
    }
  }

  public redirectToGoogle = async (req: Request, res: Response) => {
    const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth'

    const redirectUri =
      (isProduction ? process.env.GOOGLE_REDIRECT_URI_PRODUCTION : process.env.GOOGLE_REDIRECT_URI) || ''
    const options: Record<string, string> = {
      redirect_uri: redirectUri,
      client_id: process.env.GOOGLE_CLIENT_ID || '',
      access_type: 'offline',
      response_type: 'code',
      prompt: 'consent',
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email'
      ].join(' ')
    }

    const url = `${rootUrl}?${new URLSearchParams(options).toString()}`

    return res.redirect(url)
  }

  public oauth = async (req: Request, res: Response) => {
    const { code, state } = req.query

    if (!code) {
      res.status(400).json({ message: 'Authorization code is required' })
    }

    try {
      const result = await this.UserService.oauth(code as string)
      const referer = req.headers.referer || ''
      const isSwaggerRedirect =
        referer.includes('oauth2-redirect.html') || req.query.state?.toString().includes('swagger')
      if (isSwaggerRedirect) {
        const html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Authentication Successful</title>
        </head>
        <body>
          <script>
            // This script will run in the oauth2-redirect.html context
            window.onload = function() {
              // Create URL with fragment containing the token
              const redirectUrl = window.location.origin + '/api-docs/oauth2-redirect.html'
                  + '#access_token=${result.accessToken}'
                  + '&token_type=Bearer'
                  + '&state=${req.query.state || ''}'
                  + '&expires_in=3600'
                  + '&scope=email%20profile';
              
              // Redirect to the Swagger UI oauth2-redirect handler
              window.location.href = redirectUrl;
            }
          </script>
          <p>Authenticating...</p>
        </body>
        </html>
      `

        res.setHeader('Content-Type', 'text/html')
        res.send(html)
      } else {
        const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Authentication Successful</title>
          <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 30px; }
            .token-box { background: #f5f5f5; padding: 15px; margin: 20px auto; border-radius: 5px; word-break: break-all; text-align: left; }
            .copy-btn { background: #4285f4; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; }
          </style>
        </head>
        <body>
          <h2>Authentication Successful! 🎉</h2>
          <p>Your access token:</p>
          <div class="token-box" id="token">${result.accessToken}</div>
          
          <button class="copy-btn" onclick="copyToken()">Copy Token</button>
          <p>Please copy this token and paste it into the bearerAuth field in Swagger UI.</p>
          
          <script>
            function copyToken() {
              const tokenText = document.getElementById('token').innerText;
              navigator.clipboard.writeText(tokenText)
                .then(() => alert('Token copied to clipboard!'))
                .catch(err => console.error('Error copying token:', err));
            }
          </script>
        </body>
        </html>
      `

        res.setHeader('Content-Type', 'text/html')
        res.setHeader('Cache-Control', 'no-store')
        res.send(html)
      }
    } catch (error) {
      console.error('OAuth error details:', error)
      res.status(401).json({
        message: 'Authentication failed',
        error: error instanceof Error ? error.message : String(error)
      })
    }
  }

  public login = async (req: Request<ParamsDictionary, any, UserLoginBody>, res: Response) => {
    const userExist = await this.UserService.login(req.body)
    if (userExist) {
      res.status(HTTP_STATUS.OK).json({
        message: USERS_MESSAGES.LOGIN_SUCCESS,
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
        message: USERS_MESSAGES.VERIFIED_EMAIL_SUCCESS
      })
    } else {
      res.status(HTTP_STATUS.BAD_REQUEST).json({ message: USERS_MESSAGES.VERIFIED_EMAIL_FAILED })
    }
  }

  public resendEmailVerify = async (req: Request, res: Response) => {
    const emailVerifyToken = await this.UserService.resendEmailVerify(req.decoded_authorization as TokenPayload)
    if (emailVerifyToken) {
      res.status(HTTP_STATUS.OK).json({
        message: USERS_MESSAGES.RESEND_VERIFY_EMAIL_SUCCESS,
        emailVerifyToken: emailVerifyToken
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

  public verifyForgotPassword = async (
    req: Request<ParamsDictionary, any, UserVerifyForgotPasswordBody>,
    res: Response
  ) => {
    const result = await this.UserService.forgotPasswordVerify(
      req.decoded_forgot_password_verify_token as TokenPayload,
      req.body.forgotPasswordToken
    )
    if (result) {
      res.status(HTTP_STATUS.OK).json({
        message: USERS_MESSAGES.VERIFIED_FORGOT_PASSWORD_SUCCESS
      })
    } else {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: USERS_MESSAGES.VERIFIED_FORGOT_PASSWORD_FAILED
      })
    }
  }

  public resetPassword = async (req: Request<ParamsDictionary, any, UserResetPasswordBody>, res: Response) => {
    const result = await this.UserService.resetPassword(
      req.decoded_forgot_password_verify_token as TokenPayload,
      req.body.forgotPasswordToken as string,
      req.body.password as string
    )
    if (result) {
      res.status(HTTP_STATUS.OK).json({
        message: USERS_MESSAGES.RESET_PASSWORD_SUCCESS
      })
    } else {
      res.status(HTTP_STATUS.UNAUTHORIZED).json({
        message: USERS_MESSAGES.RESET_PASSWORD_FAILED
      })
    }
  }

  public follow = async (req: Request<UserFollowParams>, res: Response) => {
    const result = await this.UserService.follow(
      req.params.followedUserId as string,
      req.decoded_authorization as TokenPayload
    )
    if (result) {
      res.status(HTTP_STATUS.OK).json({
        message: USERS_MESSAGES.FOLLOW_SUCCESS
      })
    } else {
      res.status(HTTP_STATUS.UNAUTHORIZED).json({
        message: USERS_MESSAGES.FOLLOW_FAILED
      })
    }
  }

  public unfollow = async (req: Request<UserUnfollowParams>, res: Response) => {
    const result = await this.UserService.unfollow(
      req.params.unfollowedUserId as string,
      req.decoded_authorization as TokenPayload
    )
    if (result) {
      res.status(HTTP_STATUS.OK).json({
        message: USERS_MESSAGES.UNFOLLOW_SUCCESS
      })
    } else {
      res.status(HTTP_STATUS.UNAUTHORIZED).json({
        message: USERS_MESSAGES.UNFOLLOW_FAILED
      })
    }
  }

  public changePassword = async (req: Request<ParamsDictionary, any, UserChangePasswordBody>, res: Response) => {
    const result = await this.UserService.changePassword(
      req.body.oldPassword as string,
      req.body.password as string,
      req.decoded_authorization?.userId as string
    )
    if (result) {
      res.status(HTTP_STATUS.OK).json({
        message: USERS_MESSAGES.CHANGE_PASSWORD_SUCCESS
      })
    } else {
      res.status(HTTP_STATUS.UNAUTHORIZED).json({
        message: USERS_MESSAGES.CHANGE_PASSWORD_FAILED
      })
    }
  }
}
