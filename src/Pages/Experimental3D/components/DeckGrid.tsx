import React from 'react'
import { Typography, Container } from '@components/common'
import styles from '../styles.module.css'

interface DeckCard {
  title: string
  text: string
  foot: string
}

interface DeckGridProps {
  cards: DeckCard[]
}

const DeckGrid: React.FC<DeckGridProps> = ({ cards }) => {
  return (
    <Container className={styles.deckGrid}>
      {cards.map((card) => (
        <div key={card.title} className={styles.deckCard}>
          <Typography variant="h3" className={styles.deckTitle}>
            {card.title}
          </Typography>
          <Typography variant="body2" className={styles.deckText}>
            {card.text}
          </Typography>
          <div className={styles.deckFoot}>{card.foot}</div>
        </div>
      ))}
    </Container>
  )
}

export default DeckGrid
