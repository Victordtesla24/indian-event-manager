import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import Events from './pages/Events';
import Login from './pages/Login';
import Register from './pages/Register';
import CreateEvent from './pages/CreateEvent';
import AdminDashboard from './pages/admin/Dashboard';
import EventApproval from './pages/admin/EventApproval';
import SponsorDashboard from './pages/sponsor/Dashboard';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import { UserRole } from './types/user';
import Layout from './components/layout/Layout';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Layout>
          <div className="relative z-10">
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/events" element={<Events />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/create-event"
                element={
                  <ProtectedRoute>
                    <CreateEvent />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/events"
                element={
                  <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
                    <EventApproval />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/sponsor/dashboard"
                element={
                  <ProtectedRoute allowedRoles={[UserRole.SPONSOR]}>
                    <SponsorDashboard />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </Layout>
      </AuthProvider>
    </Router>
  );
}

export default App;
