import { useRef } from 'react'
import VariableProximity from '@components/reactbits/VariableProximity/VariableProximity'

const FROM = "'wght' 600"
const TO = "'wght' 900"

/** Hero title whose weight swells toward the cursor (React Bits VariableProximity). */
export function FormaTitle({ accentClassName }: { accentClassName?: string }) {
  const ref = useRef<HTMLHeadingElement>(null)
  const shared = {
    containerRef: ref,
    fromFontVariationSettings: FROM,
    toFontVariationSettings: TO,
    radius: 160,
    falloff: 'gaussian' as const,
  }
  return (
    <h1 id="forma-title" ref={ref}>
      <VariableProximity label="Criatividade que" {...shared} />
      <br />
      <VariableProximity label="faz" {...shared} />{' '}
      <span className={accentClassName}>
        <VariableProximity label="sentido." {...shared} />
      </span>
    </h1>
  )
}
