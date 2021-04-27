import { lazy } from 'react'

const DashboardRoutes = [
  // Dashboards
  {
    path: '/dashboard',
    component: lazy(() => import('../../views/dashboard')),
    exact: true
  },
  {
    path: '/tasks',
    component: lazy(() => import('../../views/tasks')),
    exact: true
  }
]

export default DashboardRoutes
