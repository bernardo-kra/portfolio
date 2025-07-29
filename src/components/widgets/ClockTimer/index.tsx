import Container from '@components/common/Container'
import Styles from './styles.module.css'
import React, { useState } from 'react'

interface ClockTimerProps {
    initialTime?: number
}
const ClockTimer: React.FC<ClockTimerProps> = React.memo(({ initialTime = 25 * 60 }) => {

    const [timeLeft, setTimeLeft] = useState(initialTime)

    const formatTime = (seconds: number) => {
        const min = Math.floor(seconds / 60)
        const sec = seconds % 60
        return `${min.toString().padStart(2, '0')}: ${sec.toString().padStart(2, '0')}`
    }

    return (
        <div>
            <p>{formatTime(timeLeft)}</p>
            <button>Iniciar</button>
        </div>
    )

})

export default ClockTimer