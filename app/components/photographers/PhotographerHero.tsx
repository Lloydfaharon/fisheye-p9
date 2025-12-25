import Image from "next/image";
import type { Photographer } from "@/app/types/photographer";

type Props = {
  photographer: Photographer;
};

export default function PhotographerHero({ photographer }: Props) {
  return (
    <section
      className="photographer-hero"
      aria-label={`Présentation de ${photographer.name}`}
    >
      <div className="photographer-hero__info">
        <h1 className="photographer-hero__name">{photographer.name}</h1>

        <p className="photographer-hero__location">
          {photographer.city}, {photographer.country}
        </p>

        <p className="photographer-hero__tagline">{photographer.tagline}</p>
      </div>

      <button type="button" className="photographer-hero__contact">
        Contactez-moi
      </button>

      <div className="photographer-hero__avatar" aria-label={`Portrait de ${photographer.name}`}>
        <Image
          src={`/assets/${photographer.portrait}`}  
          alt={photographer.name}
          width={200}
          height={200}
          className="photographer-hero__img"
          priority
        />
      </div>
    </section>
  );
}
