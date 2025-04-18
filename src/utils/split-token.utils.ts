export const splitAccessToken = (accessToken: string): string => {
  const result = accessToken.split(' ')[1]
  return result
}
