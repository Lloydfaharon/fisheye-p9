import Image from "next/image";
import Link from "next/link";
import Header from "@/app/components/header/header";
import PhotographerHero from "@/app/components/photographers/PhotographerHero";
import MediaGrid from "@/app/components/media/MediaGrid";
import { getPhotographer, getAllMediasForPhotographer } from "@/app/lib/prisma-db";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function PhotographerPage({ params }: PageProps) {
  const { id } = await params; 
  const photographerId = Number(id.split("-")[0]); 

  if (Number.isNaN(photographerId)) {
    return (
      <>
        <Header />
        <main className="page">
          <p>Identifiant de photographe invalide.</p>
          <Link href="/">Retour à l’accueil</Link>
        </main>
      </>
    );
  }

  const photographer = await getPhotographer(photographerId);

  if (!photographer) {
    return (
      <>
        <Header />
        <main className="page">
          <p>Photographe introuvable.</p>
          <Link href="/">Retour à l’accueil</Link>
        </main>
      </>
    );
  }

  const medias = await getAllMediasForPhotographer(photographerId);

  return (
    <>
      <Header />
      <main className="page" role="main">
        <PhotographerHero photographer={photographer} />

        <MediaGrid medias={medias} photographerPrice={photographer.price}/>
      </main>
    </>
  );
}
