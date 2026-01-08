"use client";

import Image from "next/image";
import { useEffect } from "react";
import Modal from "@/app/components/modal/Modal";

type Media = {
  id: number;
  title: string;
  image?: string | null;
  video?: string | null;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  medias: Media[];
  index: number;
  setIndex: React.Dispatch<React.SetStateAction<number>>;
};

export default function Lightbox({ isOpen, onClose, medias, index, setIndex }: Props) {
  const current = medias[index];

  const prev = () => setIndex((i) => (i - 1 + medias.length) % medias.length);
  const next = () => setIndex((i) => (i + 1) % medias.length);

  // Flèches clavier
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, medias.length]); // volontairement pas index pour éviter rebind

  if (!isOpen || !current) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} ariaLabelledBy="lightbox-title"   variant="lightbox">
      <div className="lightbox">
        <button type="button" className="lightbox__close" aria-label="Fermer" onClick={onClose}>
          ✕
        </button>

        <button type="button" className="lightbox__nav" aria-label="Média précédent" onClick={prev}>
          ❮
        </button>

        <div className="lightbox__content">
          <div className="lightbox__media">
            {current.image ? (
              <Image
                src={`/assets/${current.image}`}
                alt={current.title}
                fill
                sizes="90vw"
                className="lightbox__img"
                priority
              />
            ) : current.video ? (
              <video className="lightbox__video" controls autoPlay muted>
                <source src={`/assets/${current.video}`} />
              </video>
            ) : null}
          </div>

          <p id="lightbox-title" className="lightbox__title">
            {current.title}
          </p>
        </div>

        <button type="button" className="lightbox__nav" aria-label="Média suivant" onClick={next}>
          ❯
        </button>
      </div>
    </Modal>
  );
}

