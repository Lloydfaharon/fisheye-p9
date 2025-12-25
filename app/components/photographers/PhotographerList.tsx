import PhotographerCard from "./PhotographerCard";
import type { Photographer } from "@/app/types/photographer";

type PhotographerListProps = {
  photographers: Photographer[];
};

export default function PhotographerList({
  photographers,
}: PhotographerListProps) {
  return (
    <section aria-label="Liste des photographes">
      <ul className="photographer-grid">
        {photographers.map((p) => (
          <li key={p.id} className="photographer-grid__item">
            <PhotographerCard photographer={p} />
          </li>
        ))}
      </ul>
    </section>
  );
}
