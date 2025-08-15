import React from 'react'
import { Focus, Eye } from 'lucide-react'
import styles from './styles.module.css'

interface FocusModeToggleProps {
  value: boolean
  onChange: (v: boolean) => void
  className?: string
  style?: React.CSSProperties
}

const FocusModeToggle: React.FC<FocusModeToggleProps> = React.memo(({ value, onChange, className, style }) => {
  return (
    <button
      className={styles.focusModeToggle + (value ? ' ' + styles.focusModeToggleActive : '') + (className ? ' ' + className : '')}
      style={style}
      onClick={() => onChange(!value)}
      aria-label={value ? 'Desativar modo foco' : 'Ativar modo foco'}
      title={value ? 'Clique para sair do modo foco' : 'Clique para ativar o modo foco (apenas timer visível)'}
    >
      {value ? (
        <Eye size={16} color="var(--color-primary)" />
      ) : (
        <Focus size={16} color="var(--color-primary)" />
      )}
    </button>
  )
})

export default FocusModeToggle
