import { Link, useLocation } from 'react-router-dom'
import './Sidebar.css'

const Sidebar = () => {
  const { pathname } = useLocation()

  return (
    <aside className="sidebar">
      <h2>Cultural Inclusion</h2>
      <p className="subtitle">Data for Impact</p>
      <nav>
        <ul>
          <li className={pathname === '/' ? 'active' : ''}>
            <Link to="/">Dashboard</Link>
          </li>
          <li className={pathname === '/data-entry' ? 'active' : ''}>
            <Link to="/data-entry">Data Entry</Link>
          </li>
          <li className={pathname === '/insights' ? 'active' : ''}>
            <Link to="/insights">Insights</Link>
          </li>
          <li className={pathname === '/cohorts' ? 'active' : ''}>
            <Link to="/cohorts">Cohorts</Link>
          </li>
          <li className={pathname === '/reports' ? 'active' : ''}>
            <Link to="/reports">Export</Link>
          </li>
        </ul>
      </nav>

      <div className="impact-card">
        <h4>📊 Impact Stats</h4>
        <p>Empowering decisions through inclusive data analysis</p>
      </div>
    </aside>
  )
}

export default Sidebar
