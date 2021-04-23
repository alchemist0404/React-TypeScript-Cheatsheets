import { lazy } from 'react'

const ChartMapsRoutes = [
  {
    path: '/maps/leaflet',
    component: lazy(() => import('../../views/maps'))
  }
]

export default ChartMapsRoutes
