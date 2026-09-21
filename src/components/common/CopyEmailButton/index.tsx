import { useEffect, useId, useRef, useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { useI18n } from '@src/i18n'
import { profile } from '@src/config/profile'
import styles from './styles.module.css'

type Status = 'idle' | 'copying' | 'copied' | 'manual'

const CopyEmailButton = ({
  email = profile.email,
  language,
}: {
  email?: string
  language?: 'pt' | 'en'
}) => {
  const { lang } = useI18n()
  const pt = (language ?? lang) === 'pt'
  const [status, setStatus] = useState<Status>('idle')
  const id = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const mountedRef = useRef(false)
  const pendingRef = useRef(false)

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
      clearTimeout(timerRef.current)
    }
  }, [])

  useEffect(() => {
    if (status === 'manual') {
      inputRef.current?.focus()
      inputRef.current?.select()
    }
  }, [status])

  const copy = async () => {
    if (pendingRef.current) return
    clearTimeout(timerRef.current)
    pendingRef.current = true
    setStatus('copying')
    try {
      if (!navigator.clipboard?.writeText)
        throw new Error('Clipboard unavailable')
      await navigator.clipboard.writeText(email)
      if (!mountedRef.current) return
      setStatus('copied')
      timerRef.current = setTimeout(() => setStatus('idle'), 4000)
    } catch {
      if (mountedRef.current) setStatus('manual')
    } finally {
      pendingRef.current = false
    }
  }

  return (
    <div className={styles.copyEmail}>
      <button
        type="button"
        className={styles.button}
        onClick={copy}
        disabled={status === 'copying'}
        aria-describedby={id}
      >
        {status === 'copied' ? (
          <Check size={17} aria-hidden="true" />
        ) : (
          <Copy size={17} aria-hidden="true" />
        )}
        {status === 'copied'
          ? pt
            ? 'Email copiado'
            : 'Email copied'
          : status === 'copying'
            ? pt
              ? 'Copiando…'
              : 'Copying…'
            : pt
              ? 'Copiar email'
              : 'Copy email'}
      </button>
      <span id={id} className={styles.message} role="status" aria-atomic="true">
        {status === 'copied'
          ? pt
            ? 'Pronto! Agora é só colar onde quiser.'
            : 'Done! Paste it wherever you like.'
          : status === 'manual'
            ? pt
              ? 'A cópia automática não está disponível. Selecione e copie o endereço abaixo.'
              : 'Automatic copying is unavailable. Select and copy the address below.'
            : ''}
      </span>
      {status === 'manual' && (
        <input
          ref={inputRef}
          className={styles.fallback}
          type="text"
          readOnly
          value={email}
          aria-label={
            pt ? 'Email para copiar manualmente' : 'Email to copy manually'
          }
          onFocus={(event) => event.currentTarget.select()}
        />
      )}
    </div>
  )
}
export default CopyEmailButton
