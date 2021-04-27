import { Fragment } from 'react'
import Avatar from '@components/avatar'
import { Bell, Check, X, AlertTriangle, Info } from 'react-feather'

const SuccessToast = (data) => (
	<Fragment>
		<div className='toastify-header'>
			<div className='title-wrapper'>
				<Avatar size='sm' color='success' icon={<Check size={12} />} />
				<h6 className='toast-title'>Success!</h6>
			</div>
			<small className='text-muted'></small>
		</div>
		<div className='toastify-body'>
			<span role='img' aria-label='toast-text'>
				{data}
			</span>
		</div>
	</Fragment>
)

const ErrorToast = (data) => (
  <Fragment>
    <div className='toastify-header'>
      <div className='title-wrapper'>
        <Avatar size='sm' color='danger' icon={<X size={12} />} />
        <h6 className='toast-title'>Error!</h6>
      </div>
      <small className='text-muted'></small>
    </div>
    <div className='toastify-body'>
      <span role='img' aria-label='toast-text'>
        {data}
      </span>
    </div>
  </Fragment>
)

const WarningToast = (data) => (
  <Fragment>
    <div className='toastify-header'>
      <div className='title-wrapper'>
        <Avatar size='sm' color='warning' icon={<AlertTriangle size={12} />} />
        <h6 className='toast-title'>Warning!</h6>
      </div>
      <small className='text-muted'></small>
    </div>
    <div className='toastify-body'>
      <span role='img' aria-label='toast-text'>
        {data}
      </span>
    </div>
  </Fragment>
)

const InfoToast = (data) => (
  <Fragment>
    <div className='toastify-header'>
      <div className='title-wrapper'>
        <Avatar size='sm' color='info' icon={<Info size={12} />} />
        <h6 className='toast-title'>Info!</h6>
      </div>
      <small className='text-muted'></small>
    </div>
    <div className='toastify-body'>
      <span role='img' aria-label='toast-text'>
        {data}
      </span>
    </div>
  </Fragment>
)

const toasts = {
	SuccessToast,
	ErrorToast,
	WarningToast,
	InfoToast
}

export default toasts;