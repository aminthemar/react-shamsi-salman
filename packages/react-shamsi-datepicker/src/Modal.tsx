import React, { ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string; // optional for custom styling
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, className }) => {
  const popupStyle: React.CSSProperties = {
    transform: isOpen ? "translateY(0)" : "translateY(64px)",
    transition: "opacity 0.25s ease-in-out, transform 0.25s ease-in-out",
    pointerEvents: isOpen ? "auto" : "none",
  };

  const popupStyleBg: React.CSSProperties = {
    opacity: isOpen ? 1 : 0,
    transition: "opacity 0.2s ease, transform 0.2s ease",
    pointerEvents: isOpen ? "auto" : "none",
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div style={{ position: "fixed", inset: 0, display: "flex", justifyContent: "center", alignItems: "center", zIndex: 98, ...popupStyleBg }}>
      <div onClick={handleBackdropClick} style={{ position: "fixed", inset: 0, backgroundColor: "#00000044", zIndex: -1 }} />
      <div style={popupStyle}>{children}</div>
    </div>
  );
};

export default Modal;
