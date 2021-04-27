import { Button } from 'reactstrap'
import { Link } from 'react-router-dom'
import notAuthImg from '@src/assets/images/pages/not-authorized.svg'
import LogoIco from '../assets/images/logo/logoico.png'

import '@styles/base/pages/page-misc.scss'

const NotAuthorized = () => {
  return (
    <div className='misc-wrapper'>
      <a className='brand-logo' href='/'>
        <img src={LogoIco} />
      </a>
      <div className='misc-inner p-2 p-sm-3'>
        <div className='w-100 text-center'>
          <h2 className='mb-1'>You are not authorized! 🔐</h2>
          <p className='mb-2'>
            The Webtrends Marketing Lab website in IIS uses the default IUSR account credentials to access the web pages
            it serves.
          </p>
          <Button tag={Link} to='/pages/login-v2' color='primary' className='btn-sm-block mb-1'>
            Back to login
          </Button>
          <img className='img-fluid' src={notAuthImg} alt='Not authorized page' />
        </div>
      </div>
    </div>
  )
}
export default NotAuthorized
