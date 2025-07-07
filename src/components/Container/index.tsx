import styles from './styles.module.css';

type ContainerProps = {
    children: React.ReactNode;
}

const Container = ({ children }: ContainerProps) => {
    
    return <div className={styles.po__container}>
        <div className={styles.po__container__content}>
            {children}
        </div>
    </div>;
};

export default Container;