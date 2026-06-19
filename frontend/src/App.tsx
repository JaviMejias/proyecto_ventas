import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { PageTransition } from './components/ui/PageTransition';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { AuthGuard } from './components/auth/AuthGuard';
import { GuestGuard } from './components/auth/GuestGuard';
import Layout from './Layout';
import PointOfSale from './pages/PointOfSale';
import History from './pages/History';
import CashCloses from './pages/CashCloses';
import NewCashClose from './pages/NewCashClose';
import Menu from './pages/Menu';
import Settings from './pages/Settings';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

function AnimatedMain() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <PageTransition key={location.pathname} className="w-full h-full">
        <Routes location={location}>
          {/* Public Routes */}
          <Route path="login" element={<GuestGuard><Login /></GuestGuard>} />
          <Route path="register" element={<GuestGuard><Register /></GuestGuard>} />

          {/* Protected Routes */}
          <Route path="/" element={<AuthGuard><Menu /></AuthGuard>} />
          <Route path="sells" element={<AuthGuard><PointOfSale /></AuthGuard>} />
          <Route path="history" element={<AuthGuard><History /></AuthGuard>} />
          <Route path="cash_closes" element={<AuthGuard><CashCloses /></AuthGuard>} />
          <Route path="cash_closes/new" element={<AuthGuard><NewCashClose /></AuthGuard>} />
          <Route path="settings" element={<AuthGuard><Settings /></AuthGuard>} />
        </Routes>
      </PageTransition>
    </AnimatePresence>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Layout>
            <AnimatedMain />
          </Layout>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
