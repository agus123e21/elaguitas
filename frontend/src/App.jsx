import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import { CartProvider } from './context/CartContext.jsx'
import Navbar from './components/Navbar.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx'
import ResetPassword from './pages/ResetPassword.jsx'
import Catalog from './pages/Catalog.jsx'
import Cart from './pages/Cart.jsx'
import Checkout from './pages/Checkout.jsx'
import MyOrders from './pages/MyOrders.jsx'
import OrderDetail from './pages/OrderDetail.jsx'
import MyAddresses from './pages/MyAddresses.jsx'
import Containers from './pages/Containers.jsx'
import AdminProducts from './pages/admin/AdminProducts.jsx'
import AdminZones from './pages/admin/AdminZones.jsx'
import AdminContainers from './pages/admin/AdminContainers.jsx'
import NotFound from './pages/NotFound.jsx'

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/productos" element={<Catalog />} />
          <Route path="/carrito" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/recuperar-password" element={<ResetPassword />} />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute roles={['CLIENT', 'ADMIN']}>
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pedidos"
            element={
              <ProtectedRoute roles={['CLIENT', 'ADMIN']}>
                <MyOrders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pedidos/:id"
            element={
              <ProtectedRoute roles={['CLIENT', 'ADMIN']}>
                <OrderDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/direcciones"
            element={
              <ProtectedRoute roles={['CLIENT', 'ADMIN']}>
                <MyAddresses />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bidones"
            element={
              <ProtectedRoute roles={['CLIENT', 'ADMIN']}>
                <Containers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/productos"
            element={
              <ProtectedRoute roles={['ADMIN']}>
                <AdminProducts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/zonas"
            element={
              <ProtectedRoute roles={['ADMIN']}>
                <AdminZones />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/bidones"
            element={
              <ProtectedRoute roles={['ADMIN']}>
                <AdminContainers />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </CartProvider>
    </AuthProvider>
  )
}
