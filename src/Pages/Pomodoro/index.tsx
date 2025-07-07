import { useState, useEffect } from "react";
import Container from '@components/common/Container';
import Timer from '@components/icons/Timer';
import Clock from '@components/widgets/Clock';
import ClockForm from '@components/widgets/ClockForm';
import PoMenu from '@components/widgets/PoMenu';
import StarfieldBackground from '@theme/StarfieldBackground';
import DayBackground from '@theme/DayBackground';
import ThemeToggleButton from '@theme/ThemeToggleButton';
import { useTheme } from '@theme/ThemeContext';
import styles from './styles.module.css';
import StarParallaxToggle from '@theme/StarParallaxToggle';

const STORAGE_KEY = 'starfield-disable-parallax';

const Pomodoro = () => {
    const [disableParallax, setDisableParallax] = useState(false);
    const { theme } = useTheme();

    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) setDisableParallax(saved === 'true');
    }, []);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, String(disableParallax));
    }, [disableParallax]);

    return (
        <div style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
            {theme === 'dark' ? (
                <StarfieldBackground disableParallax={disableParallax} />
            ) : (
                <DayBackground />
            )}
            <StarParallaxToggle
                value={disableParallax}
                onChange={setDisableParallax}
                style={{ position: 'fixed', top: 10, left: 10, zIndex: 10 }}
            />
            <ThemeToggleButton style={{ position: 'fixed', top: 10, right: 10, zIndex: 10 }} />
            <Container>
                <div className={styles.po__pomodoro}>
                    <Timer />
                    <PoMenu></PoMenu>
                    <Clock></Clock>
                    <ClockForm></ClockForm>
                </div>
            </Container>
        </div>
    );
};

export default Pomodoro;