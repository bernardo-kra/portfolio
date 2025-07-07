import { FormInput } from "lucide-react"
import Container from '@components/common/Container';
import Styles from "./styles.module.css"
import Input from '@components/common/Input';
import React from 'react';

const ClockForm = React.memo(() => (
    <Container>
        <form>
            <div className={Styles.po__clockForm__header}>
                <div className={Styles.po__clockForm__header__content}>
                    <Input label="Timer" as="input" placeholder="Informe o nome da Tarefa"></Input>
                </div>
                <div className={Styles.po__clockForm__header__content}>
                    <p >0 0 0 0 0 0</p>
                </div>
                <div className={Styles.po__clockForm__header__content}>
                    <button>Enviar</button>
                </div>
            </div>
        </form>
    </Container>
));

export default ClockForm;