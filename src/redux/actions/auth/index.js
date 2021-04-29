import useJwt from '../../../@core/auth/jwt/jwtDefaultConfig'
// ** Handle User Login
export const handleLogin = data => {
  console.log(`data`, data)
  return dispatch => {
    dispatch({ type: 'LOGIN', data: data._doc })

    // ** Add to user to localStorage
    localStorage.setItem('userData', JSON.stringify(data._doc))
    localStorage.setItem(useJwt.storageTokenKeyName, data.token)
  }
}

// ** Handle User Logout
export const handleLogout = () => {
  return dispatch => {
    dispatch({ type: 'LOGOUT' })
    localStorage.removeItem(useJwt.storageTokenKeyName)
    localStorage.removeItem('userData')
  }
}
