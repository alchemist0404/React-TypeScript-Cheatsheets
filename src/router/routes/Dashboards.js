import { lazy } from 'react'

const DashboardRoutes = [
  // Dashboards
  {
    path: '/dashboard/ecommerce',
    component: lazy(() => import('../../views/dashboard/ecommerce')),
    exact: true
  }
]

export default DashboardRoutes
