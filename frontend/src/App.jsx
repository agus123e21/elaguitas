import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import { CartProvider } from './context/CartContext.jsx'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

const Home = lazy(() => import('./pages/Home.jsx'))
const Login = lazy(() => import('./pages/Login.jsx'))
const Register = lazy(() => import('./pages/Register.jsx'))
const ForgotPassword = lazy(() => import('./pages/ForgotPassword.jsx'))
const ResetPassword = lazy(() => import('./pages/ResetPassword.jsx'))
const Catalog = lazy(() => import('./pages/Catalog.jsx'))
const Cart = lazy(() => import('./pages/Cart.jsx'))
const Checkout = lazy(() => import('./pages/Checkout.jsx'))
const MyOrders = lazy(() => import('./pages/MyOrders.jsx'))
const OrderDetail = lazy(() => import('./pages/OrderDetail.jsx'))
const MyAddresses = lazy(() => import('./pages/MyAddresses.jsx'))
const Containers = lazy(() => import('./pages/Containers.jsx'))
const MySubscriptions = lazy(() => import('./pages/MySubscriptions.jsx'))
const Promotions = lazy(() => import('./pages/Promotions.jsx'))
const Notifications = lazy(() => import('./pages/Notifications.jsx'))
const DriverOrders = lazy(() => import('./pages/DriverOrders.jsx'))
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts.jsx'))
const AdminZones = lazy(() => import('./pages/admin/AdminZones.jsx'))
const AdminContainers = lazy(() => import('./pages/admin/AdminContainers.jsx'))
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard.jsx'))
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders.jsx'))
const AdminPromotions = lazy(() => import('./pages/admin/AdminPromotions.jsx'))
const NotFound = lazy(() => import('./pages/NotFound.jsx'))

function Page({ children }) {
  return <Suspense fallback={<div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>Cargando…</div>}>{children}</Suspense>
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Navbar />
        <Routes>          <Route path="/" element={<Page><Home /></Page>} />
          <Route path="/productos" element={<Page><Catalog /></Page>} />
          <Route path="/carrito" element={<Page><Cart /></Page>} />
          <Route path="/login" element={<Page><Login /></Page>} />
          <Route path="/register" element={<Page><Register /></Page>} />
          <Route path="/forgot-password" element={<Page><ForgotPassword /></Page>} />
          <Route path="/recuperar-password" element={<Page><ResetPassword /></Page>} />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute roles={['CLIENT', 'ADMIN']}>
                <Page><Checkout /></Page>
              </ProtectedRoute>
            }
          />
          <Route
            path="/pedidos"
            element={
              <ProtectedRoute roles={['CLIENT', 'ADMIN']}>
                <Page><MyOrders /></Page>
              </ProtectedRoute>
            }
          />
          <Route
            path="/pedidos/:id"
            element={
              <ProtectedRoute roles={['CLIENT', 'ADMIN']}>
                <Page><OrderDetail /></Page>
              </ProtectedRoute>
            }
          />
          <Route
            path="/direcciones"
            element={
              <ProtectedRoute roles={['CLIENT', 'ADMIN']}>
                <Page><MyAddresses /></Page>
              </ProtectedRoute>
            }
          />
          <Route
            path="/bidones"
            element={
              <ProtectedRoute roles={['CLIENT', 'ADMIN']}>
                <Page><Containers /></Page>
              </ProtectedRoute>
            }
          />
          <Route
            path="/suscripciones"
            element={
              <ProtectedRoute roles={['CLIENT']}>
                <Page><MySubscriptions /></Page>
              </ProtectedRoute>
            }
          />
          <Route path="/promociones" element={<Page><Promotions /></Page>} />
          <Route
            path="/notificaciones"
            element={
              <ProtectedRoute roles={['CLIENT', 'DRIVER', 'ADMIN']}>
                <Page><Notifications /></Page>
              </ProtectedRoute>
            }
          />
          <Route
            path="/repartos"
            element={
              <ProtectedRoute roles={['DRIVER']}>
                <Page><DriverOrders /></Page>
              </ProtectedRoute>
            }
          />
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute roles={['ADMIN']}>
                <Page><AdminDashboard /></Page>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/pedidos"
            element={
              <ProtectedRoute roles={['ADMIN']}>
                <Page><AdminOrders /></Page>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/productos"
            element={
              <ProtectedRoute roles={['ADMIN']}>
                <Page><AdminProducts /></Page>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/zonas"
            element={
              <ProtectedRoute roles={['ADMIN']}>
                <Page><AdminZones /></Page>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/bidones"
            element={
              <ProtectedRoute roles={['ADMIN']}>
                <Page><AdminContainers /></Page>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/promociones"
            element={
              <ProtectedRoute roles={['ADMIN']}>
                <Page><AdminPromotions /></Page>
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Page><NotFound /></Page>} />
        </Routes>
        <Footer />
      </CartProvider>
    </AuthProvider>
  )
}
