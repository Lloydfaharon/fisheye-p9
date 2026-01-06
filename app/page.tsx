import { getAllPhotographers } from "./lib/prisma-db";
import Header from "./components/header/header";
import PhotographerCard from "./components/photographers/PhotographerCard";

export default async function HomePage() {
  const photographers = await getAllPhotographers();

  return (
    <>
      <Header />

      <main className="photographers">
        <section aria-labelledby="home-title">
          <h2 id="home-title" className="sr-only">
            Liste des photographes
          </h2>

          {photographers.length === 0 ? (
            <p>Aucun photographe disponible pour le moment.</p>
          ) : (
            <ul className="photographers__grid">
              {photographers.map((p) => (
                <li key={p.id} className="photographers__item">
                  <PhotographerCard photographer={p} />
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </>
  );
}
