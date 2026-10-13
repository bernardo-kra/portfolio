import { Sparkles } from 'lucide-react'
import {
  compositionCss,
  pageLabels,
  type PageComposition,
} from './builderModel'
import styles from './builder.module.css'

export default function PagePreview({
  composition,
  width,
  label,
}: {
  composition: PageComposition
  width: number
  label: string
}) {
  const t = pageLabels[composition.lang]
  return (
    <div
      className={styles.previewOuter}
      role="region"
      aria-label={label}
      tabIndex={0}
    >
      <style>{compositionCss(composition.palette)}</style>
      <div
        className="lab-built-page"
        style={{ width, flexShrink: 0, marginInline: 'auto' }}
        id="built-top"
      >
        {composition.sections.map((kind) => {
          if (kind === 'hero')
            return (
              <div key={kind}>
                <div
                  className="built-art"
                  style={
                    composition.artwork.background
                      ? {
                          backgroundImage: `url("${composition.artwork.background}")`,
                        }
                      : undefined
                  }
                >
                  {composition.artwork.icon ? (
                    <img
                      className="built-icon"
                      src={composition.artwork.icon}
                      alt=""
                    />
                  ) : (
                    <Sparkles size={44} aria-hidden="true" />
                  )}
                </div>
                <section>
                  <p className="built-tag">{t.tag}</p>
                  <h3 className={styles.pageHeading}>{composition.title}</h3>
                  <p>{composition.text}</p>
                </section>
              </div>
            )
          if (kind === 'story')
            return (
              <section key={kind}>
                <h3 className={styles.blockHeading}>{t.story}</h3>
                <p>{composition.text}</p>
              </section>
            )
          if (kind === 'features')
            return (
              <section key={kind}>
                <div className="built-features">
                  {t.features.map((feature, index) => (
                    <div key={feature}>
                      0{index + 1}
                      <br />
                      {feature}
                    </div>
                  ))}
                </div>
              </section>
            )
          return (
            <section key={kind} className="built-action">
              <h3 className={styles.blockHeading}>{t.actionTitle}</h3>
              <a className="built-link" href="#built-top">
                {composition.action} ↗
              </a>
            </section>
          )
        })}
        <footer>{t.footer}</footer>
      </div>
    </div>
  )
}
