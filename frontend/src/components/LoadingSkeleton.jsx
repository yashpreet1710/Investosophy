 
export default function LoadingSkeleton({ height = '20px', width = '100%', borderRadius = '8px' }) {
  return (
    <div style={{
      height,
      width,
      borderRadius,
      background: 'linear-gradient(90deg, var(--card) 25%, var(--muted) 50%, var(--card) 75%)',
      backgroundSize: '200% 100%',
      animation: 'shimmer 1.5s infinite',
    }} />
  )
}