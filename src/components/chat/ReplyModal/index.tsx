import React, { useState, useEffect, useRef } from 'react';
import styles from './styles.module.css';

interface ReplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (reply: string) => void;
  originalMessage: string;
  senderName: string;
}

const ReplyModal: React.FC<ReplyModalProps> = ({
  isOpen,
  onClose,
  onSend,
  originalMessage,
  senderName
}) => {
  const [reply, setReply] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (reply.trim()) {
      onSend(reply.trim());
      setReply('');
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h3>Responder para {senderName}</h3>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>
        
        <div className={styles.originalMessage}>
          <span className={styles.label}>Mensagem original:</span>
          <p>{originalMessage}</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <textarea
            ref={textareaRef}
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Digite sua resposta..."
            className={styles.textarea}
            rows={4}
            required
          />
          
          <div className={styles.actions}>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelButton}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={styles.sendButton}
              disabled={!reply.trim()}
            >
              Enviar Resposta
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReplyModal;



