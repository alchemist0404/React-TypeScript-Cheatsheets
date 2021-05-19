import { Home, User, Circle, Gift, Grid, Map } from 'react-feather'

export default [
  {
    id: 'dashboards',
    title: 'Dashboards',
    icon: <Home />,
    navLink: '/dashboard'
  },
  {
    id: 'user',
    title: 'Users',
    icon: <User />,
    navLink: '/users'
  },
  {
    id: 'task',
    title: 'Tasks',
    icon: <Map />,
    navLink: '/tasks'
  }
]
