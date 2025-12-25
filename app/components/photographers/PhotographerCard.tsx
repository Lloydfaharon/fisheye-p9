import Link from "next/link";
import Image from "next/image";
import type { Photographer } from "@/app/types/photographer";

type Props = {
  photographer: Photographer;
};

export default function PhotographerCard({ photographer }: Props) {
  const { id, name, city, country, tagline, price, portrait } = photographer;

  return (
    <article className="photographer-card" aria-label={`Photographe ${name}`}>
      <Link href={`/photographers/${id}`} className="photographer-card__link">
        <Image
          src={`/assets/photographers/${portrait}`}
          alt={name}
          width={200}
          height={200}
          className="photographer-card__avatar"
        />
        <h2 className="photographer-card__name">{name}</h2>
      </Link>

      <p className="photographer-card__location">
        {city}, {country}
      </p>
      <p className="photographer-card__tagline">{tagline}</p>
      <p className="photographer-card__price">{price}€/jour</p>
    </article>
  );
}
