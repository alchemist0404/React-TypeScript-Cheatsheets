import { BarChart2, PieChart, Circle, Map } from 'react-feather'
export default [
  {
    id: 'chartsAndMaps',
    title: 'Charts & Maps',
    icon: <BarChart2 />,
    children: [
      {
        id: 'leafletMaps',
        title: 'Leaflet Maps',
        icon: <Map />,
        navLink: '/maps/leaflet'
      }
    ]
  }
]
