import { useState, Fragment } from 'react'
import classnames from 'classnames'
import { useDispatch } from 'react-redux'
import { Link, useHistory } from 'react-router-dom'
import { toast, Slide } from 'react-toastify'
import { Facebook, Twitter, Mail, GitHub, Coffee, X } from 'react-feather'
import { Row, Col, CardTitle, CardText, FormGroup, Label, Button } from 'reactstrap'
import { AvForm, AvInput } from 'availity-reactstrap-validation-safe'
import { useSkin } from '@hooks/useSkin'
import Avatar from '@components/avatar'
import useJwt from '@src/auth/jwt/useJwt'
import { handleLogin } from '@store/actions/auth'
import InputPasswordToggle from '@components/input-password-toggle'
import '@styles/base/pages/page-auth.scss'
import LogoIco from '../../assets/images/logo/logoico.png'

const Login = () => {
  const [skin, setSkin] = useSkin()
  const history = useHistory()
  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState({})
  const [password, setPassword] = useState('')
  const dispatch = useDispatch()
  const illustration = skin === 'dark' ? 'login-v2-dark.svg' : 'login-v2.svg',
    source = require(`@src/assets/images/pages/${illustration}`).default
  
  const SuccessToast = ({ username }) => (
    <Fragment>
      <div className='toastify-header'>
        <div className='title-wrapper'>
          <Avatar size='sm' color='success' icon={<Coffee size={12} />} />
          <h6 className='toast-title font-weight-bold'>Welcome, {username}</h6>
        </div>
      </div>
      <div className='toastify-body'>
        <span>You have successfully logged in as a user to Myyaak. Now you can start to play. Enjoy!</span>
      </div>
    </Fragment>
  )

  const ErrorToast = ({title, desc}) => (
    <Fragment>
      <div className='toastify-header'>
        <div className='title-wrapper'>
          <Avatar size='sm' color='danger' icon={<X size={12} />} />
          <h6 className='text-danger ml-50 mb-0'>{title}</h6>
        </div>
      </div>
      <div className='toastify-body'>
        <span>{desc}</span>
      </div>
    </Fragment>
  )
  

  const handleEmailChange = e => {
    const errs = errors
    if (errs.email) delete errs.email
    setEmail(e.target.value)
    setErrors(errs)
  }

  const handleSubmit = (event, errors) => {
    if (errors && !errors.length) {
      useJwt
        .login({ email, password })
        .then(({data}) => {
          if (data.status === true) {
            dispatch(handleLogin(data.data))
            toast.success(<SuccessToast username={email}/>, { transition: Slide, hideProgressBar: true, autoClose: 2000 })
            history.push('/')
          } else {
            toast.error(<ErrorToast desc={`${data.data}`} title={`Error`} />, { transition: Slide, hideProgressBar: true, autoClose: 2000 })
          }
        })
        .catch(err => console.log(err))
    }
  }

  return (
    <div className='auth-wrapper auth-v2'>
      <Row className='auth-inner m-0'>
        <Link className='brand-logo' to='/'>
          <img src={LogoIco} />
        </Link>
        <Col className='d-none d-lg-flex align-items-center p-5' lg='8' sm='12'>
          <div className='w-100 d-lg-flex align-items-center justify-content-center px-5'>
            <img className='img-fluid' src={source} alt='Login V2' />
          </div>
        </Col>
        <Col className='d-flex align-items-center auth-bg px-2 p-lg-5' lg='4' sm='12'>
          <Col className='px-xl-2 mx-auto' sm='8' md='6' lg='12'>
            <CardTitle tag='h2' className='font-weight-bold mb-1'>
              Welcome to Myyaak! 👋
            </CardTitle>
            <CardText className='mb-2'>Please sign-in to your account and start the adventure</CardText>
            <AvForm action='/' className='auth-register-form mt-2' onSubmit={handleSubmit}>
              <FormGroup>
                <Label className='form-label' for='register-email'>
                  Email
                </Label>
                <AvInput
                  required
                  type='email'
                  id='register-email'
                  name='register-email'
                  value={email}
                  placeholder='john@example.com'
                  onChange={handleEmailChange}
                  className={classnames({ 'border-danger': Object.keys(errors).length && errors.email })}
                />
                {Object.keys(errors).length && errors.email ? (
                  <small className='text-danger'>{errors.email}</small>
                ) : null}
              </FormGroup>
              <FormGroup>
                <Label className='form-label' for='register-password'>
                  Password
                </Label>
                <InputPasswordToggle
                  required
                  tag={AvInput}
                  id='register-password'
                  name='register-password'
                  value={password}
                  className='input-group-merge'
                  onChange={e => setPassword(e.target.value)}
                />
              </FormGroup>
              <Button.Ripple
                block
                color='primary'
                disabled={!email.length || !password.length}
              >
                Sign in
              </Button.Ripple>
            </AvForm>
            {/* <p className='text-center mt-2'>
              <span className='mr-25'>New on our platform?</span>
              <Link to='/register'>
                <span>Create an account</span>
              </Link>
            </p>
            <div className='divider my-2'>
              <div className='divider-text'>or</div>
            </div>
            <div className='auth-footer-btn d-flex justify-content-center'>
              <Button.Ripple color='facebook'>
                <Facebook size={14} />
              </Button.Ripple>
              <Button.Ripple color='twitter'>
                <Twitter size={14} />
              </Button.Ripple>
              <Button.Ripple color='google'>
                <Mail size={14} />
              </Button.Ripple>
              <Button.Ripple className='mr-0' color='github'>
                <GitHub size={14} />
              </Button.Ripple>
            </div> */}
          </Col>
        </Col>
      </Row>
    </div>
  )
}

export default Login
