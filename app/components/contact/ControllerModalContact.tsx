"use client";

import { useEffect, useRef, useState } from "react";
import ModalContact from "./ModalContact";
import type { Photographer } from "@/app/types/photographer";

type Props = {
  photographer: Photographer;
  triggerClassName?: string;
};

export default function ControllerModalContact({
  photographer,
  triggerClassName,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const openBtnRef = useRef<HTMLButtonElement | null>(null);
  const wasOpenRef = useRef(false);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  // Fermer au clavier (Escape)
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  // Bloquer le scroll quand la modale est ouverte
  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  // Rendre le focus au bouton seulement après fermeture (pas au premier rendu)
  useEffect(() => {
    if (wasOpenRef.current && !isOpen) {
      openBtnRef.current?.focus();
    }
    wasOpenRef.current = isOpen;
  }, [isOpen]);

  return (
    <>
      <button
        ref={openBtnRef}
        type="button"
        className={triggerClassName ?? "photographer-hero__contact"}
        onClick={open}
      >
        Contactez-moi
      </button>

      {isOpen && (
        <ModalContact
          photographerName={photographer.name}
          onClose={close}
        />
      )}
    </>
  );
}
