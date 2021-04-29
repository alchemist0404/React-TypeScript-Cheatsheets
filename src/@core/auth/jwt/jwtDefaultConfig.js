// ** Auth Endpoints
const url = process.env.NODE_ENV === 'production' ? 'https://vr.myyaak.com' : 'http://localhost:20127'
export default {
  loginEndpoint: 'user/login',
  refreshEndpoint: 'users/refresh-token',
  
  addTaskEndpoint: 'tasks/add',
  getTasksEndpoint: 'tasks/getTasks',
  deleteTaskEndpoint: 'tasks/deleteTask',
  
  tokenType: 'Bearer',
  storageTokenKeyName: 'accessToken',
  storageRefreshTokenKeyName: 'refreshToken',
  Socket: null,
  apiUrl: `${url}/admin/`,
  fileUrl: `${url}/upload/`,
  Domain: `${url}`
}