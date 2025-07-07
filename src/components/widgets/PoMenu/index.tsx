import { HomeIcon, TimerIcon, AlarmClockPlus, SettingsIcon, SunIcon } from 'lucide-react';
import styles from './styles.module.css';
import Container from '@components/common/Container';
import React from 'react';

const PoMenu = React.memo(() => {
    return (
        <Container className={styles.po__menu__container} >
            <nav className={
                styles.po__menu}>
                <a href="#"
                    className={styles.po__menu__link}>
                    <HomeIcon size={32}
                        color="var(--color-primary)" /></a>
                <a href="#"
                    className={
                        styles.po__menu__link}>
                    <TimerIcon size={32} color="var(--color-primary)" /></a>
                <a href="#"
                    className={styles.po__menu__link}>
                    <AlarmClockPlus size={32} color="var(--color-primary)" /></a>
                <a href="#"
                    className={styles.po__menu__link}>
                    <SettingsIcon size={32} color="var(--color-primary)" /></a>
                <a href="#"
                    className={styles.po__menu__link}>
                    <SunIcon size={32} color="var(--color-primary)" /></a>
            </nav>
        </Container>
    )
});

export default PoMenu;
