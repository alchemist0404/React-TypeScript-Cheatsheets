import axios from 'axios'
import jwtDefaultConfig from './jwtDefaultConfig'

export default class JwtService {
  jwtConfig = { ...jwtDefaultConfig }
  isAlreadyFetchingAccessToken = false
  subscribers = []
  constructor(jwtOverrideConfig) {
    this.jwtConfig = { ...this.jwtConfig, ...jwtOverrideConfig }
    axios.interceptors.request.use(
      config => {
        config.baseURL = jwtDefaultConfig.apiUrl
        const accessToken = this.getToken()
        if (accessToken) {
          config.headers.user = JSON.stringify({ token: accessToken })
        }
        return config
      },
      error => Promise.reject(error)
    )

    axios.interceptors.response.use(
      response => response,
      error => {
        const { config, response } = error
        if (response && response.status === 401) {
        }
        return Promise.reject(error)
      }
    )
  }

  onAccessTokenFetched(accessToken) {
    this.subscribers = this.subscribers.filter(callback => callback(accessToken))
  }

  addSubscriber(callback) {
    this.subscribers.push(callback)
  }

  getToken() {
    return localStorage.getItem(this.jwtConfig.storageTokenKeyName)
  }

  getRefreshToken() {
    return localStorage.getItem(this.jwtConfig.storageRefreshTokenKeyName)
  }

  setToken(value) {
    localStorage.setItem(this.jwtConfig.storageTokenKeyName, value)
  }

  setRefreshToken(value) {
    localStorage.setItem(this.jwtConfig.storageRefreshTokenKeyName, value)
  }

  login(...args) {
    return axios.post(this.jwtConfig.loginEndpoint, ...args)
  }

  refreshToken() {
    return axios.post(this.jwtConfig.refreshEndpoint, {
      refreshToken: this.getRefreshToken()
    })
  }

  addTask(...args) {
    return axios.post(this.jwtConfig.addTaskEndpoint, ...args)
  }

  getTasks(...args) {
    return axios.post(this.jwtConfig.getTasksEndpoint, ...args)
  }
  
  deleteTask(...args) {
    return axios.post(this.jwtConfig.deleteTaskEndpoint, ...args)
  }
}
