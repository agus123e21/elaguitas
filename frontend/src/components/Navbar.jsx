import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useCart } from '../context/CartContext.jsx'
import {
  MenuIcon,
  ShoppingBagIcon,
  MapPinIcon,
  DropletIcon,
  PackageIcon,
  TruckIcon,
  UserIcon,
  ShieldIcon,
  CloseIcon,
  PhoneIcon,
  WhatsAppIcon,
  LogOutIcon,
  RefreshCwIcon,
} from './Icons.jsx'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { count: cartCount } = useCart()
  const location = useLocation()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const currentPath = location.pathname

  function handleLogout() {
    logout()
    setMenuOpen(false)
    navigate('/login')
  }

  const role = user?.role

  return (
    <>
      {/* =========================================================
          TOP BAR NATIVA ULTRA-LIMPIA (Inspirada en el Mockup)
          ========================================================= */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 90,
          background: 'rgba(255, 255, 255, 0.94)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid var(--border)',
          padding: '0.65rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Izquierda: Botón Menú Mobile + Logo Desktop */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            className="navbar__mobile-toggle"
            onClick={() => setMenuOpen(true)}
            aria-label="Abrir menú"
            style={{
              background: 'transparent',
              border: 'none',
              alignItems: 'center',
              justifyContent: 'center',
              width: 40,
              height: 40,
              borderRadius: '50%',
              cursor: 'pointer',
              color: 'var(--text)',
              padding: 0,
            }}
          >
            <MenuIcon size={22} />
          </button>

          <Link
            to="/"
            style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', textDecoration: 'none', color: 'var(--text)' }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: '12px',
                background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: '0 4px 12px rgba(11, 125, 194, 0.28)',
              }}
            >
              <DropletIcon size={20} />
            </div>
            <span style={{ fontSize: '1.2rem', fontWeight: 900, letterSpacing: '-0.02em', color: 'var(--text)' }}>
              El Agüitas
            </span>
          </Link>
        </div>

        {/* Centro: Links de Navegación Desktop */}
        <nav className="navbar__desktop-menu">
          <Link
            to="/"
            style={{
              padding: '0.45rem 1rem',
              borderRadius: '9999px',
              fontSize: '0.86rem',
              fontWeight: 700,
              textDecoration: 'none',
              background: currentPath === '/' ? 'var(--primary-light)' : 'transparent',
              color: currentPath === '/' ? 'var(--primary-dark)' : 'var(--text)',
              transition: 'all 0.15s ease',
            }}
          >
            Inicio
          </Link>
          <Link
            to="/productos"
            style={{
              padding: '0.45rem 1rem',
              borderRadius: '9999px',
              fontSize: '0.86rem',
              fontWeight: 700,
              textDecoration: 'none',
              background: currentPath === '/productos' ? 'var(--primary-light)' : 'transparent',
              color: currentPath === '/productos' ? 'var(--primary-dark)' : 'var(--text)',
              transition: 'all 0.15s ease',
            }}
          >
            Catálogo
          </Link>
          <Link
            to="/pedidos"
            style={{
              padding: '0.45rem 1rem',
              borderRadius: '9999px',
              fontSize: '0.86rem',
              fontWeight: 700,
              textDecoration: 'none',
              background: currentPath.startsWith('/pedidos') ? 'var(--primary-light)' : 'transparent',
              color: currentPath.startsWith('/pedidos') ? 'var(--primary-dark)' : 'var(--text)',
              transition: 'all 0.15s ease',
            }}
          >
            Pedidos
          </Link>
          {role === 'DRIVER' && (
            <Link
              to="/repartos"
              style={{
                padding: '0.45rem 1rem',
                borderRadius: '9999px',
                fontSize: '0.86rem',
                fontWeight: 700,
                textDecoration: 'none',
                background: currentPath === '/repartos' ? 'var(--primary-light)' : 'transparent',
                color: 'var(--primary)',
                transition: 'all 0.15s ease',
              }}
            >
              Repartos
            </Link>
          )}
          {role === 'ADMIN' && (
            <Link
              to="/admin"
              style={{
                padding: '0.45rem 1rem',
                borderRadius: '9999px',
                fontSize: '0.86rem',
                fontWeight: 700,
                textDecoration: 'none',
                background: currentPath.startsWith('/admin') ? '#fef3c7' : 'transparent',
                color: '#92400e',
                transition: 'all 0.15s ease',
              }}
            >
              Consola Admin
            </Link>
          )}
        </nav>

        {/* Derecha: Badge San Rafael + Carrito + Botón Perfil en Desktop */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              background: 'var(--primary-light)',
              padding: '0.3rem 0.75rem',
              borderRadius: '9999px',
              border: '1px solid #bae6fd',
            }}
          >
            <MapPinIcon size={14} color="var(--primary)" />
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--primary-dark)', letterSpacing: '0.02em' }}>
              San Rafael, Mza
            </span>
          </div>

          <Link
            to="/carrito"
            aria-label="Ver carrito"
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 40,
              height: 40,
              borderRadius: '50%',
              color: 'var(--text)',
              textDecoration: 'none',
              background: '#f8fafc',
              border: '1px solid var(--border)',
            }}
          >
            <ShoppingBagIcon size={20} />
            {cartCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-3px',
                  right: '-3px',
                  background: 'var(--primary)',
                  color: '#ffffff',
                  fontSize: '0.68rem',
                  fontWeight: 900,
                  width: 18,
                  height: 18,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                }}
              >
                {cartCount}
              </span>
            )}
          </Link>

          {/* Botón de Cuenta visible en Desktop */}
          <Link
            to={user ? '/cuenta' : '/login'}
            className="navbar__desktop-menu"
            style={{
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.45rem 1.1rem',
              borderRadius: '9999px',
              fontSize: '0.84rem',
              fontWeight: 800,
              textDecoration: 'none',
              background: (currentPath === '/cuenta' || currentPath === '/perfil' || currentPath === '/login') ? 'var(--primary)' : '#ffffff',
              color: (currentPath === '/cuenta' || currentPath === '/perfil' || currentPath === '/login') ? '#ffffff' : 'var(--text)',
              border: '1px solid var(--border)',
              boxShadow: 'var(--shadow-xs)',
              transition: 'all 0.15s ease',
            }}
          >
            <UserIcon size={16} />
            <span>{user ? user.name?.split(' ')[0] || 'Cuenta' : 'Ingresar'}</span>
          </Link>
        </div>
      </header>

      {/* =========================================================
          DRAWER / MENÚ LATERAL RÁPIDO (OFF-CANVAS)
          ========================================================= */}
      {menuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(4px)',
            zIndex: 10000,
            display: 'flex',
          }}
          onClick={() => setMenuOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '80%',
              maxWidth: 320,
              height: '100%',
              background: '#ffffff',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: 'var(--shadow-lg)',
              animation: 'slideRight 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <div>
              {/* Header del Drawer */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <span style={{ display: 'inline-flex', padding: '6px', background: 'var(--primary)', borderRadius: '8px' }}>
                    <DropletIcon size={16} color="#ffffff" />
                  </span>
                  <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text)' }}>El Agüitas</span>
                </div>
                <button
                  onClick={() => setMenuOpen(false)}
                  style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                >
                  <CloseIcon size={16} />
                </button>
              </div>

              {/* Info de Usuario o Estado */}
              {user ? (
                <div style={{ padding: '0.85rem', background: 'var(--bg)', borderRadius: '12px', marginBottom: '1.25rem' }}>
                  <div style={{ fontSize: '0.74rem', color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                    Cuenta Conectada
                  </div>
                  <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text)', marginTop: '0.1rem' }}>
                    {user.name}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>
                    {user.email}
                  </div>
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="btn btn-primary btn-block"
                  style={{ marginBottom: '1.25rem', minHeight: '42px', fontWeight: 700 }}
                >
                  Ingresar a mi cuenta
                </Link>
              )}

              {/* Enlaces de Navegación */}
              <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <Link
                  to="/"
                  onClick={() => setMenuOpen(false)}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.65rem', borderRadius: '10px', color: 'var(--text)', fontWeight: 600, textDecoration: 'none' }}
                >
                  <DropletIcon size={18} color="var(--primary)" />
                  <span>Inicio & Catálogo</span>
                </Link>
                <Link
                  to="/pedidos"
                  onClick={() => setMenuOpen(false)}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.65rem', borderRadius: '10px', color: 'var(--text)', fontWeight: 600, textDecoration: 'none' }}
                >
                  <PackageIcon size={18} color="var(--primary)" />
                  <span>Mis Pedidos</span>
                </Link>
                <Link
                  to={user ? '/cuenta' : '/login'}
                  onClick={() => setMenuOpen(false)}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.65rem', borderRadius: '10px', color: 'var(--text)', fontWeight: 600, textDecoration: 'none' }}
                >
                  <UserIcon size={18} color="var(--primary)" />
                  <span>Mi Cuenta</span>
                </Link>
                <Link
                  to="/direcciones"
                  onClick={() => setMenuOpen(false)}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.65rem', borderRadius: '10px', color: 'var(--text)', fontWeight: 600, textDecoration: 'none' }}
                >
                  <MapPinIcon size={18} color="var(--primary)" />
                  <span>Mis Direcciones</span>
                </Link>
                <Link
                  to="/bidones"
                  onClick={() => setMenuOpen(false)}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.65rem', borderRadius: '10px', color: 'var(--text)', fontWeight: 600, textDecoration: 'none' }}
                >
                  <RefreshCwIcon size={18} color="var(--primary)" />
                  <span>Mis Envases</span>
                </Link>
                <Link
                  to="/carrito"
                  onClick={() => setMenuOpen(false)}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.65rem', borderRadius: '10px', color: 'var(--text)', fontWeight: 600, textDecoration: 'none' }}
                >
                  <ShoppingBagIcon size={18} color="var(--primary)" />
                  <span>Carrito ({cartCount})</span>
                </Link>

                {role === 'DRIVER' && (
                  <Link
                    to="/repartos"
                    onClick={() => setMenuOpen(false)}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.65rem', borderRadius: '10px', color: 'var(--primary)', fontWeight: 700, textDecoration: 'none', background: 'var(--primary-light)' }}
                  >
                    <TruckIcon size={18} />
                    <span>Hoja de Repartos</span>
                  </Link>
                )}

                {role === 'ADMIN' && (
                  <Link
                    to="/admin"
                    onClick={() => setMenuOpen(false)}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.65rem', borderRadius: '10px', color: '#92400e', fontWeight: 700, textDecoration: 'none', background: '#fef3c7' }}
                  >
                    <ShieldIcon size={18} />
                    <span>Consola de Dirección</span>
                  </Link>
                )}
              </nav>

              {/* Atención en San Rafael */}
              <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border)' }}>
                <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '0.65rem' }}>
                  Atención en San Rafael
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                  <a
                    href="tel:+5492604322659"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.84rem', color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}
                  >
                    <PhoneIcon size={15} />
                    <span>+54 9 2604 32-2659</span>
                  </a>
                  <a
                    href="https://wa.me/5492604322659?text=Hola,%20quisiera%20hacer%20un%20pedido%20de%20bidones%20en%20San%20Rafael"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.84rem', color: '#15803d', textDecoration: 'none', fontWeight: 600 }}
                  >
                    <WhatsAppIcon size={15} color="#15803d" />
                    <span>WhatsApp Directo</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Logout al pie */}
            {user && (
              <button
                onClick={handleLogout}
                className="btn btn-outline btn-block btn-sm"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', color: 'var(--danger)', borderColor: '#fca5a5' }}
              >
                <LogOutIcon size={15} />
                <span>Cerrar Sesión</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* =========================================================
          MOBILE BOTTOM NAV DOCK (Inspirado en el Mockup)
          Píldora flotante ergonómica en el Thumb Zone
          ========================================================= */}
      <nav
        className="mobile-bottom-nav"
        aria-label="Navegación Principal"
        style={{
          position: 'fixed',
          bottom: '12px',
          left: '1rem',
          right: '1rem',
          maxWidth: '460px',
          margin: '0 auto',
          zIndex: 95,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius: '9999px',
          padding: '0.4rem 0.5rem',
          boxShadow: '0 12px 35px -6px rgba(15, 23, 42, 0.16), 0 4px 10px rgba(0, 0, 0, 0.06)',
          border: '1px solid rgba(226, 232, 240, 0.85)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
        }}
      >
        {/* Tab 1: Inicio (Píldora activa con label cuando está en Home) */}
        <Link
          to="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: currentPath === '/' ? '0.45rem 1rem' : '0.45rem',
            borderRadius: '9999px',
            background: currentPath === '/' ? 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)' : 'transparent',
            color: currentPath === '/' ? '#ffffff' : 'var(--text-muted)',
            fontWeight: currentPath === '/' ? 800 : 500,
            fontSize: '0.82rem',
            textDecoration: 'none',
            transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <DropletIcon size={19} color={currentPath === '/' ? '#ffffff' : 'var(--text-muted)'} />
          {currentPath === '/' && <span>Inicio</span>}
        </Link>

        {/* Tab 2: Catálogo */}
        <Link
          to="/productos"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: currentPath === '/productos' ? '0.45rem 1rem' : '0.45rem',
            borderRadius: '9999px',
            background: currentPath === '/productos' ? 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)' : 'transparent',
            color: currentPath === '/productos' ? '#ffffff' : 'var(--text-muted)',
            fontWeight: currentPath === '/productos' ? 800 : 500,
            fontSize: '0.82rem',
            textDecoration: 'none',
            transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <PackageIcon size={19} color={currentPath === '/productos' ? '#ffffff' : 'var(--text-muted)'} />
          {currentPath === '/productos' && <span>Catálogo</span>}
        </Link>

        {/* Tab 3: Pedidos */}
        <Link
          to="/pedidos"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: currentPath.startsWith('/pedidos') ? '0.45rem 1rem' : '0.45rem',
            borderRadius: '9999px',
            background: currentPath.startsWith('/pedidos') ? 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)' : 'transparent',
            color: currentPath.startsWith('/pedidos') ? '#ffffff' : 'var(--text-muted)',
            fontWeight: currentPath.startsWith('/pedidos') ? 800 : 500,
            fontSize: '0.82rem',
            textDecoration: 'none',
            transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <TruckIcon size={19} color={currentPath.startsWith('/pedidos') ? '#ffffff' : 'var(--text-muted)'} />
          {currentPath.startsWith('/pedidos') && <span>Pedidos</span>}
        </Link>

        {/* Tab 4: Cuenta / Perfil */}
        <Link
          to={user ? '/cuenta' : '/login'}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: (currentPath === '/cuenta' || currentPath === '/perfil' || currentPath === '/login' || currentPath === '/registro') ? '0.45rem 1rem' : '0.45rem',
            borderRadius: '9999px',
            background: (currentPath === '/cuenta' || currentPath === '/perfil' || currentPath === '/login' || currentPath === '/registro') ? 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)' : 'transparent',
            color: (currentPath === '/cuenta' || currentPath === '/perfil' || currentPath === '/login' || currentPath === '/registro') ? '#ffffff' : 'var(--text-muted)',
            fontWeight: (currentPath === '/cuenta' || currentPath === '/perfil' || currentPath === '/login' || currentPath === '/registro') ? 800 : 500,
            fontSize: '0.82rem',
            textDecoration: 'none',
            transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <UserIcon size={19} color={(currentPath === '/cuenta' || currentPath === '/perfil' || currentPath === '/login' || currentPath === '/registro') ? '#ffffff' : 'var(--text-muted)'} />
          {(currentPath === '/cuenta' || currentPath === '/perfil' || currentPath === '/login' || currentPath === '/registro') && <span>Cuenta</span>}
        </Link>
      </nav>
    </>
  )
}
