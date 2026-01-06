import HeaderP from "@/app/components/header/headerPhotographers";
import PhotographerHero from "@/app/components/photographers/PhotographerHero";
import MediaGrid from "@/app/components/media/MediaGrid";
import { getPhotographer, getAllMediasForPhotographer } from "@/app/lib/prisma-db";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function PhotographerPage({ params }: PageProps) {
  const { id } = await params; 
  const photographerId = Number(id.split("-")[0]);

  if (Number.isNaN(photographerId)) {
    notFound();
  }

  const photographer = await getPhotographer(photographerId);

  if (!photographer) {
    notFound();
  }

  const medias = await getAllMediasForPhotographer(photographerId);

  return (
    <>
      <HeaderP />
      <main className="page" role="main">
        <PhotographerHero photographer={photographer} />
        <MediaGrid medias={medias} photographerPrice={photographer.price} />
      </main>
    </>
  );
}
