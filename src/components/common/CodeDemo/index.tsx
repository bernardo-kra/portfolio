import React, { useState, useEffect } from 'react';
import styles from './styles.module.css';

interface CodeDemoProps {
  title?: string;
  language?: string;
}

const Clock: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const seconds = time.getSeconds().toString().padStart(2, '0');

  return (
    <div className={styles.clock}>
      <div className={styles.clock__time}>
        {hours}:{minutes}:{seconds}
      </div>
      <div className={styles.clock__date}>
        {time.toLocaleDateString('pt-BR', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}
      </div>
    </div>
  );
};

const clockCode = `import React, { useState, useEffect } from 'react';

const Clock: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const seconds = time.getSeconds().toString().padStart(2, '0');

  return (
    <div className="clock">
      <div className="clock__time">
        {hours}:{minutes}:{seconds}
      </div>
      <div className="clock__date">
        {time.toLocaleDateString('pt-BR', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}
      </div>
    </div>
  );
};`;

const CodeDemo: React.FC<CodeDemoProps> = ({ 
  title = 'Demonstração de Código', 
  language = 'typescript' 
}) => {
  return (
    <div className={styles.codeDemo}>
      <h3 className={styles.codeDemo__title}>{title}</h3>
      <div className={styles.codeDemo__container}>
        <div className={styles.codeDemo__code}>
          <div className={styles.codeDemo__header}>
            <span className={styles.codeDemo__language}>{language}</span>
            <span className={styles.codeDemo__filename}>Clock.tsx</span>
          </div>
          <pre className={styles.codeDemo__pre}>
            <code className={styles.codeDemo__codeContent}>
              {clockCode}
            </code>
          </pre>
        </div>
        <div className={styles.codeDemo__preview}>
          <div className={styles.codeDemo__previewHeader}>
            <span>Preview</span>
          </div>
          <div className={styles.codeDemo__previewContent}>
            <Clock />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeDemo; 