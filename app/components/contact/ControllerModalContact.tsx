"use client";

import { useEffect, useRef, useState } from "react";
import Contact from "./Contact";
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

      <Contact
        isOpen={isOpen}
        photographerName={photographer.name}
        onClose={close}
      />
    </>
  );
}
