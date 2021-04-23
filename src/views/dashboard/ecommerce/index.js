import { useContext } from 'react'
import { Row, Col } from 'reactstrap'
import CompanyTable from './CompanyTable'
import { ThemeColors } from '@src/utility/context/ThemeColors'

import '@styles/react/libs/charts/apex-charts.scss'
import '@styles/base/pages/dashboard-ecommerce.scss'

const EcommerceDashboard = () => {
  const { colors } = useContext(ThemeColors),
    trackBgColor = '#e9ecef'

  return (
    <div id='dashboard-ecommerce'>
      <Row className='match-height'>
        <Col lg='12' xs='12'>
          <CompanyTable />
        </Col>
      </Row>
    </div>
  )
}

export default EcommerceDashboard
