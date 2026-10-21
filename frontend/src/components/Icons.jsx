export function MenuIcon({ size = 20, className = '', color = 'currentColor', ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="6" x2="20" y2="6" />
      <line x1="4" y1="18" x2="20" y2="18" />
    </svg>
  )
}

export function DropletIcon({ size = 20, className = '', color = 'currentColor', ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
    </svg>
  )
}

export function TruckIcon({ size = 20, className = '', color = 'currentColor', ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
      <path d="M15 18H9" />
      <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14v10" />
      <circle cx="17" cy="18" r="2" />
      <circle cx="7" cy="18" r="2" />
    </svg>
  )
}

export function ShieldIcon({ size = 20, className = '', color = 'currentColor', ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  )
}

export function UserIcon({ size = 20, className = '', color = 'currentColor', ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

export function CartIcon({ size = 20, className = '', color = 'currentColor', ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
  )
}

export function PackageIcon({ size = 20, className = '', color = 'currentColor', ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="m7.5 4.27 9 5.15" />
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
    </svg>
  )
}

export function CheckIcon({ size = 20, className = '', color = 'currentColor', ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
}

export function MapPinIcon({ size = 20, className = '', color = 'currentColor', ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

export function PhoneIcon({ size = 20, className = '', color = 'currentColor', ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  )
}

export function WhatsAppIcon({ size = 20, className = '', color = 'currentColor', ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} className={className} {...props}>
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.96.57 3.87 1.66 5.51L2 22l4.73-1.74c1.58 1 3.44 1.56 5.31 1.56 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm0 18.08c-1.68 0-3.32-.47-4.75-1.37l-.34-.21-3.52 1.29 1.32-3.43-.22-.36c-.99-1.57-1.51-3.39-1.51-5.26 0-4.47 3.64-8.11 8.11-8.11 2.17 0 4.2.85 5.73 2.38 1.53 1.53 2.37 3.56 2.37 5.73 0 4.47-3.64 8.11-8.11 8.11zm4.84-6.07c-.27-.13-1.57-.77-1.81-.86-.24-.09-.42-.13-.6.13-.18.27-.69.86-.85 1.04-.16.18-.31.2-.58.07-.27-.13-1.13-.42-2.15-1.33-.8-.71-1.33-1.59-1.49-1.86-.16-.27-.02-.41.12-.55.12-.12.27-.31.4-.47.13-.16.18-.27.27-.45.09-.18.04-.34-.02-.47-.07-.13-.6-1.45-.82-1.99-.22-.53-.44-.45-.6-.46-.16-.01-.34-.01-.51-.01-.18 0-.47.07-.71.34-.24.27-.94.92-.94 2.25 0 1.33.97 2.62 1.1 2.8.13.18 1.91 2.91 4.62 4.08.65.28 1.15.45 1.54.58.65.21 1.25.18 1.72.11.53-.08 1.57-.64 1.79-1.26.22-.62.22-1.15.16-1.26-.07-.12-.24-.18-.51-.31z" />
    </svg>
  )
}

export function RefreshCwIcon({ size = 20, className = '', color = 'currentColor', ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
      <path d="M8 16H3v5" />
    </svg>
  )
}

export function LogOutIcon({ size = 20, className = '', color = 'currentColor', ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  )
}

export function PlusIcon({ size = 20, className = '', color = 'currentColor', ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  )
}

export function MinusIcon({ size = 20, className = '', color = 'currentColor', ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="M5 12h14" />
    </svg>
  )
}

export function AlertCircleIcon({ size = 20, className = '', color = 'currentColor', ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  )
}

export function WifiOffIcon({ size = 20, className = '', color = 'currentColor', ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <line x1="1" y1="1" x2="23" y2="23" />
      <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" />
      <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" />
      <path d="M10.71 5.05A16 16 0 0 1 22.58 9" />
      <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" />
      <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
      <line x1="12" y1="20" x2="12.01" y2="20" strokeWidth="2.5" />
    </svg>
  )
}

export function SparklesIcon({ size = 20, className = '', color = 'currentColor', ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z" />
    </svg>
  )
}

export function ClockIcon({ size = 20, className = '', color = 'currentColor', ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}

export function DollarSignIcon({ size = 20, className = '', color = 'currentColor', ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <line x1="12" y1="2" x2="12" y2="22" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  )
}

export function ChevronRightIcon({ size = 20, className = '', color = 'currentColor', ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <polyline points="9 18 15 12 9 6" />
    </svg>
  )
}

export function PlayIcon({ size = 20, className = '', color = 'currentColor', ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  )
}

export function SearchIcon({ size = 20, className = '', color = 'currentColor', ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  )
}

export function SlidersIcon({ size = 20, className = '', color = 'currentColor', ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <line x1="4" y1="21" x2="4" y2="14" />
      <line x1="4" y1="10" x2="4" y2="3" />
      <line x1="12" y1="21" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12" y2="3" />
      <line x1="20" y1="21" x2="20" y2="16" />
      <line x1="20" y1="12" x2="20" y2="3" />
      <line x1="1" y1="14" x2="7" y2="14" />
      <line x1="9" y1="8" x2="15" y2="8" />
      <line x1="17" y1="16" x2="23" y2="16" />
    </svg>
  )
}

export function HeartIcon({ size = 20, className = '', color = 'currentColor', filled = false, ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? color : 'none'} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  )
}

export function CloseIcon({ size = 20, className = '', color = 'currentColor', ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
}

export function ShoppingBagIcon({ size = 20, className = '', color = 'currentColor', ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  )
}

/* ==============================================================
   ILUSTRACIONES / RENDERS VECTORIALES DE PRODUCTO (Sin Emojis)
   ============================================================== */

export function ProductVisual({ type = 'bottle20', size = 80 }) {
  if (type === 'dispenser') {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="dispenserBody" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f8fafc" />
            <stop offset="100%" stopColor="#cbd5e1" />
          </linearGradient>
          <linearGradient id="bottleBlue" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="50%" stopColor="#0ea5e9" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>
        </defs>
        {/* Bidón invertido arriba */}
        <path d="M36 12 C36 8 44 6 50 6 C56 6 64 8 64 12 L66 32 C66 34 62 36 50 36 C38 36 34 34 34 32 Z" fill="url(#bottleBlue)" opacity="0.9" />
        <ellipse cx="50" cy="12" rx="14" ry="4" fill="#7dd3fc" />
        <rect x="46" y="36" width="8" height="5" rx="1" fill="#0369a1" />
        
        {/* Cuerpo del dispenser */}
        <rect x="28" y="40" width="44" height="54" rx="6" fill="url(#dispenserBody)" stroke="#94a3b8" strokeWidth="1.5" />
        {/* Panel frontal */}
        <rect x="34" y="46" width="32" height="24" rx="3" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        {/* Canilla Fría (Azul) */}
        <circle cx="43" cy="56" r="3" fill="#0284c7" />
        <rect x="41.5" y="59" width="3" height="6" rx="1" fill="#0284c7" />
        {/* Canilla Caliente (Roja) */}
        <circle cx="57" cy="56" r="3" fill="#ef4444" />
        <rect x="55.5" y="59" width="3" height="6" rx="1" fill="#ef4444" />
        {/* Rejilla de goteo */}
        <rect x="36" y="80" width="28" height="4" rx="1.5" fill="#64748b" />
        {/* Base */}
        <rect x="26" y="93" width="48" height="3" rx="1.5" fill="#475569" />
      </svg>
    )
  }

  if (type === 'bottle12') {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad12" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="35%" stopColor="#bae6fd" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>
        </defs>
        {/* Tapa azul */}
        <rect x="43" y="10" width="14" height="8" rx="2" fill="#0284c7" />
        {/* Cuello */}
        <rect x="44.5" y="18" width="11" height="6" fill="#38bdf8" />
        {/* Cuerpo del bidón de 12L */}
        <path d="M30 36 C30 24 38 24 44.5 24 L55.5 24 C62 24 70 24 70 36 L70 82 C70 88 64 90 50 90 C36 90 30 88 30 82 Z" fill="url(#grad12)" stroke="#0284c7" strokeWidth="1.5" />
        {/* Ranuras estructurales */}
        <line x1="32" y1="48" x2="68" y2="48" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.65" />
        <line x1="32" y1="62" x2="68" y2="62" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.65" />
        <line x1="32" y1="76" x2="68" y2="76" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.65" />
        {/* Asa integrada */}
        <rect x="25" y="44" width="7" height="24" rx="3.5" fill="#0284c7" opacity="0.8" />
      </svg>
    )
  }

  if (type === 'bottle6') {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad6" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#67e8f9" />
            <stop offset="40%" stopColor="#cffafe" />
            <stop offset="100%" stopColor="#0891b2" />
          </linearGradient>
        </defs>
        {/* Tapa roja/azul */}
        <rect x="44" y="20" width="12" height="7" rx="2" fill="#0891b2" />
        {/* Cuerpo compacto 6L */}
        <rect x="34" y="27" width="32" height="60" rx="7" fill="url(#grad6)" stroke="#0891b2" strokeWidth="1.5" />
        <line x1="36" y1="46" x2="64" y2="46" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
        <line x1="36" y1="64" x2="64" y2="64" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
        {/* Asa ergonómica */}
        <path d="M66 38 C72 38 74 44 74 54 C74 64 72 68 66 68" stroke="#0891b2" strokeWidth="4" strokeLinecap="round" fill="none" />
      </svg>
    )
  }

  if (type === 'pack') {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="gradPack" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#0369a1" />
          </linearGradient>
        </defs>
        {/* Bidón trasero izquierdo */}
        <rect x="18" y="28" width="22" height="50" rx="5" fill="#7dd3fc" stroke="#0284c7" strokeWidth="1" opacity="0.7" />
        {/* Bidón trasero derecho */}
        <rect x="60" y="28" width="22" height="50" rx="5" fill="#7dd3fc" stroke="#0284c7" strokeWidth="1" opacity="0.7" />
        {/* Bidón frontal central */}
        <rect x="34" y="20" width="32" height="64" rx="7" fill="url(#gradPack)" stroke="#0284c7" strokeWidth="1.5" />
        <rect x="44" y="14" width="12" height="6" rx="2" fill="#0369a1" />
        <line x1="36" y1="40" x2="64" y2="40" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
        <line x1="36" y1="56" x2="64" y2="56" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
        {/* Cinta promocional de Pack */}
        <rect x="16" y="62" width="68" height="12" rx="3" fill="#10b981" />
        <text x="50" y="71" textAnchor="middle" fill="#ffffff" fontSize="7.5" fontWeight="bold" fontFamily="sans-serif">PACK X5</text>
      </svg>
    )
  }

  // Por defecto: Bidón 20L
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad20" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="30%" stopColor="#bae6fd" />
          <stop offset="70%" stopColor="#0ea5e9" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>
      </defs>
      {/* Tapa azul sellada */}
      <rect x="42" y="8" width="16" height="9" rx="2.5" fill="#0369a1" />
      {/* Cuello */}
      <rect x="44" y="17" width="12" height="6" fill="#38bdf8" />
      {/* Cuerpo cilíndrico del 20 Litros */}
      <path d="M26 36 C26 23 35 23 44 23 L56 23 C65 23 74 23 74 36 L74 84 C74 90 66 92 50 92 C34 92 26 90 26 84 Z" fill="url(#grad20)" stroke="#0284c7" strokeWidth="1.5" />
      {/* Ranuras de refuerzo del policarbonato */}
      <line x1="28" y1="44" x2="72" y2="44" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
      <line x1="28" y1="56" x2="72" y2="56" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
      <line x1="28" y1="68" x2="72" y2="68" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
      <line x1="28" y1="80" x2="72" y2="80" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
      {/* Reflejo de luz */}
      <path d="M32 36 L32 82" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" opacity="0.4" />
      {/* Badge grabado en el centro */}
      <circle cx="50" cy="50" r="7" fill="none" stroke="#ffffff" strokeWidth="1" opacity="0.5" />
      <text x="50" y="52.5" textAnchor="middle" fill="#ffffff" fontSize="6.5" fontWeight="bold" fontFamily="sans-serif" opacity="0.8">20L</text>
    </svg>
  )
}

export function LockIcon({ size = 20, className = '', color = 'currentColor', ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  )
}


export function MoonIcon({ size = 20, className = '', color = 'currentColor', ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}

export function SunIcon({ size = 20, className = '', color = 'currentColor', ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  )
}

export function TrashIcon({ size = 20, className = '', color = 'currentColor', ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
  )
}
