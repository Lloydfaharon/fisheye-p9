import { getAllPhotographers } from "./lib/prisma-db";
import Header from "../app/components/header/header";

export default async function HomePage() {
  const photographers = await getAllPhotographers();

  return (
    <>
      <Header />

      <main className="photographers" role="main">
        <ul className="photographers__grid">
          {photographers.map((p) => (
            <li key={p.id} className="photographers__item">
              <article
                className="photographer-card"
                aria-label={`Photographe ${p.name}`}
              >
                <a
                  href={`/photographers/${p.id}`}
                  className="photographer-card__link"
                >
                  <img
                    src={`/assets/${p.portrait}`}
                    alt={p.name}
                    className="photographer-card__avatar"
                  />

                  <h2 className="photographer-card__name">{p.name}</h2>
                </a>

                <p className="photographer-card__location">
                  {p.city}, {p.country}
                </p>

                <p className="photographer-card__tagline">{p.tagline}</p>

                <p className="photographer-card__price">{p.price}€/jour</p>
              </article>
            </li>
          ))}
        </ul>
      </main>
    </>
  );
}
