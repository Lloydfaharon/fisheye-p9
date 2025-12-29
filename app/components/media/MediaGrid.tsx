"use client";

import Image from "next/image";
import { useMemo, useState, useTransition } from "react";
import Lightbox from "@/app/components/lightbox/Lightbox";
import { likeMedia } from "@/app/actions/likes";
import MediaTri from "@/app/components/media/MediaTri";

type TriKey = "popularity" | "date" | "title";

type Media = {
  id: number;
  title: string;
  image?: string | null;
  video?: string | null;
  likes: number;
  date: string; 
};

type Props = {
  medias: Media[];
  photographerPrice?: number;
};

export default function MediaGrid({ medias, photographerPrice }: Props) {
  const [items, setItems] = useState<Media[]>(medias);

  // Lightbox
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Like action
  const [isPending, startTransition] = useTransition();

  // Tri
  const [triKey, setTriKey] = useState<TriKey>("popularity");

  const totalLikes = useMemo(
    () => items.reduce((sum, m) => sum + m.likes, 0),
    [items]
  );

  const sortedItems = useMemo(() => {
    const copy = [...items];

    switch (triKey) {
      case "popularity":
        copy.sort((a, b) => b.likes - a.likes);
        break;

      case "date":
        copy.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        break;

      case "title":
        copy.sort((a, b) =>
          a.title.localeCompare(b.title, "fr", { sensitivity: "base" })
        );
        break;
    }

    return copy;
  }, [items, triKey]);

  const openAt = (index: number) => {
    setCurrentIndex(index);
    setIsOpen(true);
  };

  const close = () => setIsOpen(false);

  const onLike = (mediaId: number) => {
   
    setItems((prev) =>
      prev.map((m) => (m.id === mediaId ? { ...m, likes: m.likes + 1 } : m))
    );

    startTransition(async () => {
      try {
        const newLikes = await likeMedia(mediaId); // DB increment
        setItems((prev) =>
          prev.map((m) => (m.id === mediaId ? { ...m, likes: newLikes } : m))
        );
      } catch {
        // rollback si erreur
        setItems((prev) =>
          prev.map((m) => (m.id === mediaId ? { ...m, likes: m.likes - 1 } : m))
        );
      }
    });
  };

  return (
    <>
      {/*  TRI  */}
      <MediaTri value={triKey} onChange={setTriKey} />

      <section className="media" aria-label="Galerie du photographe">
        <div className="media__grid">
          {sortedItems.map((m, index) => (
            <article key={m.id} className="media-card">
              {/* Zone cliquable pour ouvrir la lightbox */}
              <button
                type="button"
                className="media-card__button"
                onClick={() => openAt(index)}
                aria-label={`Ouvrir ${m.title} en plein écran`}
              >
                <div className="media-card__thumb">
                  {m.image ? (
                    <Image
                      src={`/assets/${m.image}`}
                      alt={m.title}
                      fill
                      sizes="(max-width: 1200px) 50vw, 33vw"
                      className="media-card__img"
                    />
                  ) : (
                    <div
                      className="media-card__videoPlaceholder"
                      aria-label={`Vidéo : ${m.title}`}
                    >
                      <span className="media-card__play" aria-hidden="true">
                        ▶
                      </span>
                    </div>
                  )}
                </div>
              </button>

              {/* Meta + Like */}
              <div className="media-card__meta">
                <h3 className="media-card__title">{m.title}</h3>

                <div className="media-card__likes">
                  <span aria-label={`${m.likes} likes`}>{m.likes}</span>

                  <button
                    type="button"
                    className="likeButton"
                    onClick={() => onLike(m.id)}
                    onMouseDown={(e) => e.stopPropagation()}
                    onKeyDown={(e) => e.stopPropagation()}
                    aria-label={`Aimer ${m.title}`}
                    disabled={isPending}
                  >
                    ♥
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Encart bas total likes */}
      <aside
        className="photographer-stats"
        aria-label="Statistiques du photographe"
      >
        <div className="photographer-stats__likes">
          <span>{totalLikes}</span> 
          <span className="likes-heart" aria-hidden="true">♥</span>
          <span className="sr-only">likes</span>
        </div>

        {typeof photographerPrice === "number" && (
          <div className="photographer-stats__price">
            {photographerPrice}€ / jour
          </div>
        )}
      </aside>

      <Lightbox
        isOpen={isOpen}
        onClose={close}
        medias={sortedItems}
        index={currentIndex}
        setIndex={setCurrentIndex}
      />
    </>
  );
}
