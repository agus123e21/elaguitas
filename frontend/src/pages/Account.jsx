import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useCart } from '../context/CartContext.jsx'
import {
  UserIcon,
  TruckIcon,
  ShieldIcon,
  MapPinIcon,
  RefreshCwIcon,
  PackageIcon,
  DropletIcon,
  PhoneIcon,
  WhatsAppIcon,
  LogOutIcon,
  ChevronRightIcon,
  ShoppingBagIcon,
} from '../components/Icons.jsx'

export default function Account() {
  const { user, logout } = useAuth()
  const { clearCart } = useCart()
  const navigate = useNavigate()

  function handleLogout() {
    clearCart()
    logout()
    navigate('/login')
  }

  if (!user) {
    return (
      <div className="page" style={{ maxWidth: 480, margin: '0 auto', textAlign: 'center', padding: '3.5rem 1.25rem' }}>
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: '9999px',
            background: 'var(--primary-light)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem',
            color: 'var(--primary)',
            boxShadow: 'var(--shadow-soft)',
          }}
        >
          <UserIcon size={38} />
        </div>
        <h1 style={{ fontSize: '1.65rem', margin: '0 0 0.5rem', fontWeight: 900, color: 'var(--text)' }}>
          Mi Cuenta
        </h1>
        <p className="muted" style={{ margin: '0 auto 2rem', fontSize: '0.94rem', lineHeight: 1.6, maxWidth: 360 }}>
          Iniciá sesión en El Agüitas para gestionar tus direcciones, tus envases y tus pedidos en San Rafael.
        </p>
        <Link
          className="btn btn-primary"
          to="/login"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.6rem',
            fontWeight: 800,
            padding: '1rem 2.25rem',
            borderRadius: '9999px',
            boxShadow: '0 10px 24px rgba(11, 125, 194, 0.28)',
          }}
        >
          <UserIcon size={18} />
          <span>Ingresar a mi Cuenta</span>
        </Link>
      </div>
    )
  }

  const roleLabels = {
    ADMIN: { label: 'Administrador / Dirección', bg: '#fef3c7', text: '#92400e' },
    DRIVER: { label: 'Repartidor / Chofer', bg: 'var(--primary-light)', text: 'var(--primary-dark)' },
    CLIENT: { label: 'Cliente Particular', bg: '#ecfdf5', text: 'var(--success)' },
  }

  const badge = roleLabels[user.role] || roleLabels.CLIENT

  const menuItems = [
    {
      title: 'Mis Pedidos',
      subtitle: 'Seguimiento en vivo e historial',
      icon: PackageIcon,
      to: '/pedidos',
      color: 'var(--primary)',
    },
    {
      title: 'Direcciones de Entrega',
      subtitle: 'Domicilios guardados en San Rafael',
      icon: MapPinIcon,
      to: '/direcciones',
      color: 'var(--primary)',
    },
    {
      title: 'Envases Retornables',
      subtitle: 'Saldo y control de bidones',
      icon: RefreshCwIcon,
      to: '/bidones',
      color: 'var(--success)',
    },
    {
      title: 'Suscripciones Periódicas',
      subtitle: 'Recargas programadas semanales',
      icon: DropletIcon,
      to: '/suscripciones',
      color: 'var(--primary)',
    },
  ]

  return (
    <div className="page" style={{ maxWidth: 960, margin: '0 auto', paddingBottom: '7rem' }}>
      <div className="home-desktop-layout">
        <div>
          {/* Header Perfil */}
          <div
            className="card"
        style={{
          padding: '1.75rem',
          borderRadius: '32px',
          border: '1px solid rgba(11, 125, 194, 0.12)',
          boxShadow: 'var(--shadow-soft)',
          background: '#ffffff',
          marginBottom: '1.25rem',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: '9999px',
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            fontSize: '2rem',
            fontWeight: 900,
            boxShadow: '0 10px 25px rgba(11, 125, 194, 0.3)',
            marginBottom: '0.85rem',
          }}
        >
          {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
        </div>

        <h1 style={{ fontSize: '1.6rem', margin: 0, fontWeight: 900, color: 'var(--text)' }}>
          {user.name || 'Mi Perfil'}
        </h1>
        <p className="muted" style={{ margin: '0.25rem 0 0.85rem', fontSize: '0.9rem' }}>
          {user.email} {user.phone ? `· ${user.phone}` : ''}
        </p>

        <span
          style={{
            display: 'inline-block',
            background: badge.bg,
            color: badge.text,
            padding: '0.35rem 0.95rem',
            borderRadius: '9999px',
            fontSize: '0.78rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
          }}
        >
          {badge.label}
        </span>

        {/* Accesos Especiales por Rol */}
        {user.role === 'DRIVER' && (
          <div style={{ marginTop: '1.25rem' }}>
            <Link
              to="/repartos"
              className="btn btn-primary btn-block"
              style={{
                borderRadius: '9999px',
                minHeight: '48px',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
              }}
            >
              <TruckIcon size={18} />
              <span>Abrir Hoja de Reparto en Vivo</span>
            </Link>
          </div>
        )}

        {user.role === 'ADMIN' && (
          <div style={{ marginTop: '1.25rem' }}>
            <Link
              to="/admin"
              className="btn btn-block"
              style={{
                background: '#fef3c7',
                color: '#92400e',
                border: '1px solid #fde68a',
                borderRadius: '9999px',
                minHeight: '48px',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
              }}
            >
              <ShieldIcon size={18} color="#92400e" />
              <span>Abrir Consola Administrativa</span>
            </Link>
          </div>
        )}
      </div>
        </div>

        <div>
          {/* Menú de Opciones del Cliente */}
          <div
            className="card"
        style={{
          padding: '0.5rem',
          borderRadius: '28px',
          border: '1px solid rgba(11, 125, 194, 0.12)',
          boxShadow: 'var(--shadow-soft)',
          background: '#ffffff',
          marginBottom: '1.25rem',
        }}
      >
        {menuItems.map((item, idx) => {
          const Icon = item.icon
          const isLast = idx === menuItems.length - 1
          return (
            <Link
              key={item.to}
              to={item.to}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1rem 1.15rem',
                textDecoration: 'none',
                borderBottom: isLast ? 'none' : '1px solid #f1f5f9',
                borderRadius: '20px',
                transition: 'background 0.15s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: '14px',
                    background: 'var(--primary-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: item.color,
                  }}
                >
                  <Icon size={20} />
                </div>
                <div>
                  <strong style={{ fontSize: '0.96rem', color: 'var(--text)', display: 'block' }}>
                    {item.title}
                  </strong>
                  <span className="muted" style={{ fontSize: '0.78rem' }}>
                    {item.subtitle}
                  </span>
                </div>
              </div>
              <ChevronRightIcon size={18} color="var(--muted)" />
            </Link>
          )
        })}
      </div>

      {/* Atención y Soporte en San Rafael */}
      <div
        className="card"
        style={{
          padding: '1.25rem 1.4rem',
          borderRadius: '24px',
          border: '1px solid #e2e8f0',
          background: '#f8fafc',
          marginBottom: '1.5rem',
        }}
      >
        <span style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '0.75rem' }}>
          Atención Local en San Rafael
        </span>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
          <a
            href="tel:+5492604322659"
            className="btn btn-outline"
            style={{
              minHeight: '44px',
              borderRadius: '9999px',
              fontSize: '0.84rem',
              fontWeight: 800,
              background: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.45rem',
            }}
          >
            <PhoneIcon size={15} />
            <span>Llamar</span>
          </a>
          <a
            href="https://wa.me/5492604322659?text=Hola,%20quisiera%20hacer%20una%20consulta%20sobre%20mi%20cuenta%20de%20El%20Agüitas"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline"
            style={{
              minHeight: '44px',
              borderRadius: '9999px',
              fontSize: '0.84rem',
              fontWeight: 800,
              background: '#f0fdf4',
              borderColor: '#86efac',
              color: '#15803d',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.45rem',
            }}
          >
            <WhatsAppIcon size={15} color="#15803d" />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>

          {/* Botón de Cerrar Sesión */}
          <button
            type="button"
            onClick={handleLogout}
            className="btn btn-outline btn-block"
            style={{
              minHeight: '50px',
              borderRadius: '9999px',
              fontWeight: 800,
              color: 'var(--danger)',
              borderColor: '#fca5a5',
              background: '#fff5f5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.55rem',
            }}
          >
            <LogOutIcon size={18} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </div>
    </div>
  )
}
