// ** Routes Imports
import ChartMapsRoutes from './ChartsMaps'
import DashboardRoutes from './Dashboards'
import AuthRoutes from './Auths'

// ** Document title
const TemplateTitle = '%s - Myyaak AR app Admin'

// ** Default Route
const DefaultRoute = '/dashboard/ecommerce'

// ** Merge Routes
const Routes = [
  ...DashboardRoutes,
  ...ChartMapsRoutes,
  ...AuthRoutes
]

export { DefaultRoute, TemplateTitle, Routes }
