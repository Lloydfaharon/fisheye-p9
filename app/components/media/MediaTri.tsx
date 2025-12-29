"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";

export type TriKey = "popularity" | "date" | "title";

type Props = {
  value: TriKey;
  onChange: (value: TriKey) => void;
  label?: string;
};

const OPTIONS: Array<{ key: TriKey; label: string }> = [
  { key: "popularity", label: "Popularité" },
  { key: "date", label: "Date" },
  { key: "title", label: "Titre" },
];

export default function MediaTri({ value, onChange, label = "Trier par" }: Props) {
  const listboxId = useId();
  const buttonId = useId();

  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const optRefs = useRef<Array<HTMLButtonElement | null>>([]);

  // Label affiché dans le bouton (valeur sélectionnée)
  const selectedLabel = useMemo(
    () => OPTIONS.find((o) => o.key === value)?.label ?? "Popularité",
    [value]
  );

  // Liste affichée dans le panel = options SAUF celle sélectionnée
  const panelOptions = useMemo(
    () => OPTIONS.filter((o) => o.key !== value),
    [value]
  );

  const [activeIndex, setActiveIndex] = useState(0);

  // Clic dehors => fermer
  useEffect(() => {
    if (!open) return;
    const onMouseDown = (e: MouseEvent) => {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, [open]);

  // Quand on ouvre => focus 1ère option du panel
  useEffect(() => {
    if (!open) return;
    setActiveIndex(0);
    requestAnimationFrame(() => optRefs.current[0]?.focus());
  }, [open]);

  const closeAndFocusButton = () => {
    setOpen(false);
    requestAnimationFrame(() => btnRef.current?.focus());
  };

  const selectIndex = (idx: number) => {
    const opt = panelOptions[idx];
    if (!opt) return;
    onChange(opt.key);
    closeAndFocusButton();
  };

  const onButtonKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpen(true);
    }
  };

  const onListKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") {
      e.preventDefault();
      closeAndFocusButton();
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = Math.min(panelOptions.length - 1, activeIndex + 1);
      setActiveIndex(next);
      optRefs.current[next]?.focus();
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      const prev = Math.max(0, activeIndex - 1);
      setActiveIndex(prev);
      optRefs.current[prev]?.focus();
      return;
    }

    if (e.key === "Home") {
      e.preventDefault();
      setActiveIndex(0);
      optRefs.current[0]?.focus();
      return;
    }

    if (e.key === "End") {
      e.preventDefault();
      const last = panelOptions.length - 1;
      setActiveIndex(last);
      optRefs.current[last]?.focus();
      return;
    }

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      selectIndex(activeIndex);
      return;
    }
  };

  return (
    <div className="tri" ref={wrapRef}>
      <span className="tri__label">{label}</span>

      <div className="tri__wrap">
        <button
          ref={btnRef}
          id={buttonId}
          type="button"
          className={`tri__btn ${open ? "is-open" : ""}`}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listboxId}
          onClick={() => setOpen((v) => !v)}
          onKeyDown={onButtonKeyDown}
        >
          <span className="tri__btnText">{selectedLabel}</span>
          <span className={`tri__chevron ${open ? "is-open" : ""}`} aria-hidden="true">
            ▾
          </span>
        </button>

        {open && (
          <div
            className="tri__panel"
            role="listbox"
            id={listboxId}
            aria-labelledby={buttonId}
            tabIndex={-1}
            onKeyDown={onListKeyDown}
          >
            {panelOptions.map((opt, idx) => (
              <button
                key={opt.key}
                ref={(el) => {
                  optRefs.current[idx] = el;
                }}
                type="button"
                role="option"
                aria-selected={false}
                className="tri__opt"
                onClick={() => selectIndex(idx)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
