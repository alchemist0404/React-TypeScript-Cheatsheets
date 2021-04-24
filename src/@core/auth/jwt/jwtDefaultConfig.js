// ** Auth Endpoints
const url = 'http://h2931731.stratoserver.net'
const test = 'http://localhost:20127'
export default {
  loginEndpoint: 'users/login',
  registerEndpoint: 'users/register',
  refreshEndpoint: 'users/refresh-token',
  logoutEndpoint: 'users/logout',
  
  tokenType: 'Bearer',
  storageTokenKeyName: 'accessToken',
  storageRefreshTokenKeyName: 'refreshToken',
  Socket: null,
  apiUrl: `${test}/admin/`,
  Domain: `${test}`
}