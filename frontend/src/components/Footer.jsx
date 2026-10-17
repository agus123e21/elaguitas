export default function Footer() {
  // En la experiencia de App Móvil Nativa, la navegación se maneja desde el Bottom Nav Dock.
  // Este componente actúa únicamente como espacio de resguardo para el scroll inferior.
  return (
    <div
      style={{
        height: '60px',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
      aria-hidden="true"
    />
  )
}
