import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useAnalytics, trackPageView } from '@hooks/useAnalytics'

const Analytics: React.FC = () => {
  const location = useLocation()

  useAnalytics()

  useEffect(() => {
    trackPageView(location.pathname, document.title)
  }, [location])

  return null
}

export default Analytics
