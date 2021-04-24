import { lazy } from 'react'
import DashboardRoutes from './Dashboards'

const Title = 'Pharao´s world'

const DefaultRoute = '/dashboard'

const Routes = [
  ...DashboardRoutes,
  {
    path: '/login',
    component: lazy(() => import('../../views/authentication/Login')),
    layout: 'BlankLayout'
  },
  {
    path: '/register',
    component: lazy(() => import('../../views/authentication/Register')),
    layout: 'BlankLayout'
  },
  {
    path: '/error',
    component: lazy(() => import('../../views/Error')),
    layout: 'BlankLayout'
  }
]

export { DefaultRoute, Title, Routes }
