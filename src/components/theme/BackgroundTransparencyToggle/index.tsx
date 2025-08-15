import React from 'react'
import { Eye, EyeOff } from 'lucide-react'
import styles from './styles.module.css'

interface BackgroundTransparencyToggleProps {
  value: boolean
  onChange: (v: boolean) => void
  className?: string
  style?: React.CSSProperties
}

const BackgroundTransparencyToggle: React.FC<BackgroundTransparencyToggleProps> = React.memo(({ value, onChange, className, style }) => {
  return (
    <button
      className={`${styles.backgroundTransparencyToggle} ${value ? styles.backgroundTransparencyToggleActive : ''} ${className || ''}`}
      style={style}
      onClick={() => onChange(!value)}
      aria-label={value ? 'Desativar transparência' : 'Ativar transparência'}
      title={value ? 'Clique para desativar a transparência dos componentes' : 'Clique para ativar a transparência dos componentes'}
    >
      {value ? (
        <EyeOff size={16} color="var(--color-primary)" />
      ) : (
        <Eye size={16} color="var(--color-primary)" />
      )}
    </button>
  )
})

BackgroundTransparencyToggle.displayName = 'BackgroundTransparencyToggle'

export default BackgroundTransparencyToggle
