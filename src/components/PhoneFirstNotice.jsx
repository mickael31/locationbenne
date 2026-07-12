import { company } from "../data/content";

export default function PhoneFirstNotice({ compact = false }) {
  return (
    <aside
      className={`phone-first-notice${compact ? " phone-first-notice-compact" : ""}`}
    >
      <div>
        <p className="phone-first-kicker">Un conseil avant de réserver</p>
        <h2>Avant de choisir votre benne, parlons de votre chantier</h2>
        <p>
          Que vous nous appeliez directement ou remplissiez le formulaire, nous échangeons
          toujours par téléphone avant de confirmer la location. Nous vérifions ensemble
          vos déchets, le volume et l&apos;accès afin de vous proposer la benne adaptée.
          Vous évitez ainsi une benne trop petite, trop grande ou inadaptée.
        </p>
      </div>
      <a href={`tel:${company.phoneRaw}`} className="btn btn-primary">
        Appelez-nous au {company.phoneLocalDisplay}
      </a>
    </aside>
  );
}
