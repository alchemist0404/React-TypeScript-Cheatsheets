import { lazy } from 'react'

const ChartMapsRoutes = [
    {
        path: '/login',
        component: lazy(() => import('../../views/pages/authentication/Login')),
        layout: 'BlankLayout',
        meta: {
            authRoute: true
        }
    }
]

export default ChartMapsRoutes
