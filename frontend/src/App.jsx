import { lazy, Suspense, Component } from 'react'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import { CartProvider } from './context/CartContext.jsx'
import Navbar from './components/Navbar.jsx'
import NetworkStatusBanner from './components/NetworkStatusBanner.jsx'
import Footer from './components/Footer.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

function safeLazy(importFn) {
  return lazy(async () => {
    try {
      const module = await importFn()
      window.sessionStorage.removeItem('chunk_retry_reload')
      return module
    } catch (error) {
      const hasRetried = window.sessionStorage.getItem('chunk_retry_reload')
      if (!hasRetried) {
        window.sessionStorage.setItem('chunk_retry_reload', 'true')
        window.location.reload()
        return new Promise(() => {})
      }
      throw error
    }
  })
}

class ChunkErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error) {
    console.error('Error al cargar la ruta:', error)
    const isChunkError =
      error?.name === 'ChunkLoadError' ||
      error?.message?.includes('dynamically imported module') ||
      error?.message?.includes('Failed to fetch')
    if (isChunkError && !window.sessionStorage.getItem('chunk_error_reload')) {
      window.sessionStorage.setItem('chunk_error_reload', 'true')
      window.location.reload()
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '3.5rem 1.5rem', textAlign: 'center', maxWidth: 440, margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text)' }}>Actualización detectada</h2>
          <p className="muted" style={{ fontSize: '0.9rem', margin: '0.5rem 0 1.5rem' }}>
            Se ha publicado una nueva versión de El Agüitas. Recargá la página para verla.
          </p>
          <button
            className="btn btn-primary"
            onClick={() => {
              window.sessionStorage.removeItem('chunk_error_reload')
              window.location.reload()
            }}
            style={{ borderRadius: '9999px', padding: '0.8rem 1.75rem', fontWeight: 800 }}
          >
            Actualizar Ahora
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

const Home = safeLazy(() => import('./pages/Home.jsx'))
const DemoPage = safeLazy(() => import('./pages/DemoPage.jsx'))
const Login = safeLazy(() => import('./pages/Login.jsx'))
const Register = safeLazy(() => import('./pages/Register.jsx'))
const ForgotPassword = safeLazy(() => import('./pages/ForgotPassword.jsx'))
const ResetPassword = safeLazy(() => import('./pages/ResetPassword.jsx'))
const Catalog = safeLazy(() => import('./pages/Catalog.jsx'))
const Cart = safeLazy(() => import('./pages/Cart.jsx'))
const Checkout = safeLazy(() => import('./pages/Checkout.jsx'))
const Account = safeLazy(() => import('./pages/Account.jsx'))
const MyOrders = safeLazy(() => import('./pages/MyOrders.jsx'))
const OrderDetail = safeLazy(() => import('./pages/OrderDetail.jsx'))
const MyAddresses = safeLazy(() => import('./pages/MyAddresses.jsx'))
const Containers = safeLazy(() => import('./pages/Containers.jsx'))
const MySubscriptions = safeLazy(() => import('./pages/MySubscriptions.jsx'))
const Promotions = safeLazy(() => import('./pages/Promotions.jsx'))
const Notifications = safeLazy(() => import('./pages/Notifications.jsx'))
const DriverOrders = safeLazy(() => import('./pages/DriverOrders.jsx'))
const AdminProducts = safeLazy(() => import('./pages/admin/AdminProducts.jsx'))
const AdminZones = safeLazy(() => import('./pages/admin/AdminZones.jsx'))
const AdminContainers = safeLazy(() => import('./pages/admin/AdminContainers.jsx'))
const AdminDashboard = safeLazy(() => import('./pages/admin/AdminDashboard.jsx'))
const AdminOrders = safeLazy(() => import('./pages/admin/AdminOrders.jsx'))
const AdminPromotions = safeLazy(() => import('./pages/admin/AdminPromotions.jsx'))
const NotFound = safeLazy(() => import('./pages/NotFound.jsx'))

function Page({ children }) {
  return (
    <ChunkErrorBoundary>
      <Suspense fallback={<div style={{ padding: '2.5rem 1.5rem', fontFamily: 'sans-serif', color: 'var(--text)' }}>Cargando…</div>}>
        {children}
      </Suspense>
    </ChunkErrorBoundary>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <NetworkStatusBanner />
        <Navbar />
        <Routes>          <Route path="/" element={<Page><Home /></Page>} />
          <Route path="/demo" element={<Page><DemoPage /></Page>} />
          <Route path="/productos" element={<Page><Catalog /></Page>} />
          <Route path="/carrito" element={<Page><Cart /></Page>} />
          <Route path="/login" element={<Page><Login /></Page>} />
          <Route path="/register" element={<Page><Register /></Page>} />
          <Route path="/registro" element={<Page><Register /></Page>} />
          <Route path="/forgot-password" element={<Page><ForgotPassword /></Page>} />
          <Route path="/olvide-password" element={<Page><ForgotPassword /></Page>} />
          <Route path="/recuperar-password" element={<Page><ResetPassword /></Page>} />
          <Route path="/reset-password" element={<Page><ResetPassword /></Page>} />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute roles={['CLIENT', 'ADMIN']}>
                <Page><Checkout /></Page>
              </ProtectedRoute>
            }
          />
          <Route path="/cuenta" element={<Page><Account /></Page>} />
          <Route path="/perfil" element={<Page><Account /></Page>} />
          <Route path="/pedidos" element={<Page><MyOrders /></Page>} />
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
              <ProtectedRoute roles={['DRIVER', 'ADMIN']}>
                <Page><DriverOrders /></Page>
              </ProtectedRoute>
            }
          />
          <Route
            path="/driver"
            element={
              <ProtectedRoute roles={['DRIVER', 'ADMIN']}>
                <Page><DriverOrders /></Page>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={['ADMIN']}>
                <Page><AdminDashboard /></Page>
              </ProtectedRoute>
            }
          />
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
