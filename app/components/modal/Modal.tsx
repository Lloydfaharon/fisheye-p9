"use client";

import { ReactNode, useEffect, useRef } from "react";

type Variant = "contact" | "lightbox";

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
  variant = "contact",
}: Props) {
  const dialogRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    // 1) lock scroll
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // 2) focus sur le conteneur (pas un champ direct)
    dialogRef.current?.focus();

    // 3) ESC + focus trap
    const onKeyDown = (e: KeyboardEvent) => {
      if (!dialogRef.current) return;

      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }

      // Focus trap uniquement avec Tab
      if (e.key !== "Tab") return;

      const focusables = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
      ).filter((el) => !el.hasAttribute("disabled"));

      if (focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (e.shiftKey) {
        if (active === first || active === dialogRef.current) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (active === last) {
          e.preventDefault();
          first.focus();
        }
      }
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
        ref={dialogRef}
        className={`modalDialog modalDialog--${variant}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={ariaLabelledBy}
        tabIndex={-1}
      >
        {children}
      </div>
    </div>
  );
}
