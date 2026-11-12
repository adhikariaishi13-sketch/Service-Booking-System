import { useEffect } from 'react';

const Modal = ({ title, onClose, children }) => {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="modal-backdrop-custom" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-card" role="dialog" aria-modal="true" aria-label={title}>
        <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
          <h5 className="m-0">{title}</h5>
          <button className="btn-close" onClick={onClose} aria-label="Close"></button>
        </div>
        <div className="p-3">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
