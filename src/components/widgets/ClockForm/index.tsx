import React from 'react'
import Container from '@components/common/Container'
import styles from './styles.module.css'
import Input from '@components/common/Input'

const ClockForm = React.memo(() => (
  <Container>
    <form>
      <div className={styles.po__clockForm__header}>
        <div className={styles.po__clockForm__header__content}>
          <Input label="Timer" as="input" placeholder="Informe o nome da Tarefa" />
        </div>
        <div className={styles.po__clockForm__header__content}>
          <p>0 0 0 0 0 0</p>
        </div>
        <div className={styles.po__clockForm__header__content}>
          <button>Enviar</button>
        </div>
      </div>
    </form>
  </Container>
))

export default ClockForm