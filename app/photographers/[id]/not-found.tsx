import Link from "next/link";
import Header from "@/app/components/header/header";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="page">
        <h1>Photographe introuvable</h1>
        <p>Ce photographe n’existe pas ou a été supprimé.</p>
        <Link href="/">Retour à l’accueil</Link>
      </main>
    </>
  );
}
