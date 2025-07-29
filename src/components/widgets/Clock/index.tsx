import React from 'react'
import Container from '@components/common/Container'
import styles from './styles.module.css'

const Clock = React.memo(() => {
  return (
    <Container>
      <div className={styles.po__clock__content}>
      </div>
    </Container>
  )
})

export default Clock