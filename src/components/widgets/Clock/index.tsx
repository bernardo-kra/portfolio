import Container from '@components/common/Container';
import Styles from './styles.module.css';
import React from 'react';

const Clock = React.memo(() => {
    return (
        <Container>
            <div className={Styles.po__clock__content}>
                {/* Conteúdo do relógio */}
            </div>
        </Container>
    )
});

export default Clock;