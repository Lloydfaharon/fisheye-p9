"use client";

import { FormEvent } from "react";
import Modal from "@/app/components/modal/Modal";

type Props = {
  isOpen: boolean;
  photographerName: string;
  onClose: () => void;
};

export default function Contact({ isOpen, photographerName, onClose }: Props) {
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = new FormData(e.currentTarget);
    const firstName = String(form.get("firstName") ?? "");
    const lastName = String(form.get("lastName") ?? "");
    const email = String(form.get("email") ?? "");
    const message = String(form.get("message") ?? "");

    console.log({ firstName, lastName, email, message });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      ariaLabelledBy="contact-modal-title"
      variant="contact"
    >
      <div className="modal">
        <div className="modalHeader">
          <h2 id="contact-modal-title" className="modalTitle">
            Contactez-moi <br />
            <span className="modalTitleName">{photographerName}</span>
          </h2>

          <button
            type="button"
            className="modalClose"
            aria-label="Fermer la modale"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <form className="modalForm" onSubmit={onSubmit}>
          <label className="modalLabel" htmlFor="firstName">
            Prénom
          </label>
          <input
            className="modalInput"
            id="firstName"
            name="firstName"
            type="text"
            autoComplete="given-name"
            required
          />

          <label className="modalLabel" htmlFor="lastName">
            Nom
          </label>
          <input
            className="modalInput"
            id="lastName"
            name="lastName"
            type="text"
            autoComplete="family-name"
            required
          />

          <label className="modalLabel" htmlFor="email">
            Email
          </label>
          <input
            className="modalInput"
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
          />

          <label className="modalLabel" htmlFor="message">
            Votre message
          </label>
          <textarea
            className="modalTextarea"
            id="message"
            name="message"
            rows={6}
            required
          />

          <button type="submit" className="modalSubmit">
            Envoyer
          </button>
        </form>
      </div>
    </Modal>
  );
}
