import Home from './pages/home/home';
import CreateReservation from './pages/criar_reserva/criar_reserva';
import AdminPage from './pages/admin/admin_page'; 
import LoginAdmin from './pages/login_admin/login_admin';
import GetAllorDeleteReservations from './pages/get_reservations/get_reservations';
import DailySummary from './pages/daily_summary/daily_summary';
import ManageTables from './pages/manage_tables/manage_tables';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <Router>
      <Routes >
        <Route path="/" element={<Home />} />
        <Route path="/criar_reserva" element={<CreateReservation />} />
        <Route path="/login_admin" element={<LoginAdmin/>} />
        <Route path="/admin_page" element={<AdminPage/>} />
        <Route path="/get_reservations" element={<GetAllorDeleteReservations/>} />
        <Route path="/get_daily_summary" element={<DailySummary/>} />
        <Route path="/manage_tables" element={<ManageTables/>} />
      </Routes>
    </Router>
  )
}

export default App
