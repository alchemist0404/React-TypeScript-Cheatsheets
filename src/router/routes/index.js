// ** Routes Imports
import ChartMapsRoutes from './ChartsMaps'
import DashboardRoutes from './Dashboards'

// ** Document title
const TemplateTitle = '%s - Vuexy React Admin Template'

// ** Default Route
const DefaultRoute = '/dashboard/ecommerce'

// ** Merge Routes
const Routes = [
  ...DashboardRoutes,
  ...ChartMapsRoutes
]

export { DefaultRoute, TemplateTitle, Routes }
