// ** Auth Endpoints
const url = 'http://h2931731.stratoserver.net'
const test = 'http://localhost:20127'
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
  apiUrl: `${test}/admin/`,
  fileUrl: `${test}/upload/`,
  Domain: `${test}`
}