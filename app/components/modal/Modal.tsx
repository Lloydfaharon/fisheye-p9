"use client";

import { ReactNode, useEffect, useRef } from "react";

type Variant = "default" | "lightbox";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  ariaLabelledBy: string;
  children: ReactNode;
  variant?: Variant;
};

export default function Modal({
  isOpen,
  onClose,
  ariaLabelledBy,
  children,
  variant = "default",
}: Props) {
  const dialogRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    // lock scroll
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // focus dans la modale
    dialogRef.current?.focus();

    // ESC pour fermer
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className={`modalOverlay modalOverlay--${variant}`}
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`modalDialog modalDialog--${variant}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={ariaLabelledBy}
        tabIndex={-1}
        ref={dialogRef}
      >
        {children}
      </div>
    </div>
  );
}
