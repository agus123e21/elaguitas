import { createContext, useCallback, useContext, useMemo, useState } from 'react'

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

  const persist = useCallback((next) => {
    setItems(next)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  }, [])

  const addItem = useCallback(
    (product, quantity = 1) => {
      const existing = items.find((i) => i.productId === product.id)
      const next = existing
        ? items.map((i) =>
            i.productId === product.id
              ? { ...i, quantity: Math.min(i.quantity + quantity, product.stock) }
              : i
          )
        : [...items, { productId: product.id, name: product.name, price: Number(product.price), quantity }]
      persist(next)
    },
    [items, persist]
  )

  const updateQuantity = useCallback(
    (productId, quantity) => {
      const next = items
        .map((i) => (i.productId === productId ? { ...i, quantity: Math.max(1, quantity) } : i))
        .filter((i) => i.quantity > 0)
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
