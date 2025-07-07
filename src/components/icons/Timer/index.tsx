import styles from './styles.module.css';
import CustomTimerIcon from '@components/icons/Timer/CustomTimerIcon';

const Timer = () => {
    return (
        <div className={styles.po__timer}>
            <a href="#" className={styles.po__timer__link}>
                <CustomTimerIcon effectClassName="pointerRoll" clockHour={12} />
                <span>Timer</span>
            </a>
        </div>
    )
};

export default Timer;