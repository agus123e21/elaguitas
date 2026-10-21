import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useAuth } from './AuthContext.jsx'

const CartContext = createContext(null)
const STORAGE_KEY = 'agua_cart'

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []
  } catch {
    return []
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadCart)
  const { user } = useAuth()
  const prevUserRef = useRef(user?.id)

  const persist = useCallback((next) => {
    setItems(next)
    if (!next || next.length === 0) {
      localStorage.removeItem(STORAGE_KEY)
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    }
  }, [])

  // Desvincular carrito al cerrar sesión o cambiar de usuario
  useEffect(() => {
    if (prevUserRef.current !== undefined && prevUserRef.current !== user?.id) {
      persist([])
    }
    prevUserRef.current = user?.id
  }, [user?.id, persist])

  const addItem = useCallback(
    (product, quantity = 1) => {
      const existing = items.find((i) => i.productId === product.id)
      const next = existing
        ? items.map((i) =>
            i.productId === product.id
              ? { ...i, quantity: Math.min(i.quantity + quantity, product.stock || 999) }
              : i
          )
        : [...items, { productId: product.id, name: product.name, price: Number(product.price), quantity }]
      persist(next)
    },
    [items, persist]
  )

  const updateQuantity = useCallback(
    (productId, quantity) => {
      const q = Number(quantity)
      // Si la cantidad llega a 0 o menor, se quita el producto del carrito
      if (q <= 0) {
        persist(items.filter((i) => i.productId !== productId))
        return
      }
      const next = items.map((i) =>
        i.productId === productId ? { ...i, quantity: q } : i
      )
      persist(next)
    },
    [items, persist]
  )

  const removeItem = useCallback(
    (productId) => persist(items.filter((i) => i.productId !== productId)),
    [items, persist]
  )

  const clearCart = useCallback(() => persist([]), [persist])

  const count = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items])
  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [items]
  )

  const value = useMemo(
    () => ({ items, addItem, updateQuantity, removeItem, clearCart, count, subtotal }),
    [items, addItem, updateQuantity, removeItem, clearCart, count, subtotal]
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  return useContext(CartContext)
}
