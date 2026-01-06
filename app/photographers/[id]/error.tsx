"use client";

import Header from "@/app/components/header/header";
import Link from "next/link";

type Props = {
  error: Error;
  reset: () => void;
};

export default function Error({ error, reset }: Props) {
  return (
    <>
      <Header />
      <main className="page">
        <h1>Une erreur est survenue</h1>
        <p>{error.message}</p>

        <button onClick={reset}>Réessayer</button>
        <br />
        <Link href="/">Retour à l’accueil</Link>
      </main>
    </>
  );
}
