const sharedChecklist = [
  "Le type de déchets à évacuer",
  "Le volume à prévoir et la durée souhaitée",
  "L'accès du camion et l'emplacement de la benne",
];

function createPreparationGuidance(city, localContext) {
  return [
    {
      title: `Décrire le lieu de pose à ${city}`,
      description: localContext,
    },
    {
      title: "Vérifier les règles de voirie",
      description: `À ${city}, si la benne doit occuper une chaussée, un trottoir ou une place de stationnement, renseignez-vous en amont auprès de la collectivité compétente sur l'autorisation éventuellement requise et les conditions de signalisation ou de protection.`,
    },
  ];
}

export const locationPages = [
  {
    key: "montauban",
    path: "/location-benne-montauban/",
    lastModified: "2026-07-12",
    city: "Montauban",
    eyebrow: "Location de benne à Montauban",
    title: "Location de benne à Montauban : un conseil adapté à votre chantier",
    lead:
      "Pour vos travaux, votre débarras ou vos déchets verts à Montauban, nous échangeons d'abord avec vous par téléphone afin de préparer une location de benne adaptée.",
    introduction:
      "Basés à Montauban, nous commençons par comprendre précisément votre besoin. Un échange simple permet de choisir le volume pertinent, de vérifier les déchets prévus et d'anticiper l'accès au lieu de livraison.",
    useCases: [
      {
        title: "Rénovation et gravats",
        description:
          "Pour une pièce à refaire, une démolition légère ou des travaux de maçonnerie, nous vous aidons à distinguer le volume utile et les déchets à prévoir.",
      },
      {
        title: "Débarras de maison",
        description:
          "Cave, garage, dépendance ou logement : décrivez-nous ce que vous souhaitez évacuer pour éviter de réserver une benne surdimensionnée ou insuffisante.",
      },
      {
        title: "Déchets verts",
        description:
          "Après une taille, un élagage ou un nettoyage de terrain, nous vous orientons vers une solution cohérente avec la quantité de végétaux à évacuer.",
      },
    ],
    checklist: sharedChecklist,
    preparation: createPreparationGuidance(
      "Montauban",
      "Précisez si la pose est prévue dans une cour, devant une maison, près d'une dépendance ou sur un terrain à Montauban. Nous pourrons ainsi parler de la largeur d'accès, de la stabilité du sol et de l'espace nécessaire aux manœuvres du camion.",
    ),
    faqs: [
      {
        question: "Comment choisir une benne pour un chantier à Montauban ?",
        answer:
          "Appelez-nous ou envoyez votre demande : nous vous rappelons avant confirmation pour parler des déchets, du volume, de l'accès et de la durée de location.",
      },
      {
        question: "Peut-on louer une benne pour un débarras à Montauban ?",
        answer:
          "Oui. Indiquez-nous les objets et matériaux à évacuer afin que nous vérifiions avec vous le volume et la solution la plus adaptée.",
      },
    ],
    seo: {
      title: "Location de benne à Montauban | Devis et conseil téléphone",
      description:
        "Location de benne à Montauban pour gravats, débarras et déchets verts. Premier échange par téléphone, conseil sur le volume, devis gratuit et livraison organisée.",
    },
  },
  {
    key: "toulouse",
    path: "/location-benne-toulouse/",
    lastModified: "2026-07-12",
    city: "Toulouse",
    eyebrow: "Location de benne à Toulouse",
    title: "Location de benne à Toulouse : préparer l'accès avant la livraison",
    lead:
      "À Toulouse, un chantier, une rénovation ou un débarras se prépare aussi en fonction de l'accès et de l'emplacement disponible. Nous en parlons avec vous par téléphone avant de confirmer la benne.",
    introduction:
      "Une rue passante, une cour, un lotissement ou un accès plus étroit ne se gèrent pas de la même façon. Lors du premier appel, nous qualifions votre besoin et les contraintes du site pour vous orienter vers une location de benne adaptée.",
    useCases: [
      {
        title: "Rénovation en ville",
        description:
          "Pour un appartement, une maison de ville ou un local en travaux, décrivez-nous les matériaux à évacuer et l'emplacement envisagé pour la benne.",
      },
      {
        title: "Débarras et encombrants",
        description:
          "Mobilier, cartons, bois ou objets volumineux : nous évaluons avec vous le volume nécessaire afin de planifier une solution adaptée à votre projet.",
      },
      {
        title: "Chantiers professionnels",
        description:
          "Artisans et entreprises peuvent nous communiquer leurs contraintes de chantier, leurs délais et les flux de déchets afin d'organiser la location au plus juste.",
      },
    ],
    checklist: sharedChecklist,
    preparation: createPreparationGuidance(
      "Toulouse",
      "À Toulouse, indiquez si le chantier se trouve dans une rue passante, une cour, une copropriété ou un lotissement. La largeur de l'accès, le stationnement disponible et les obstacles en hauteur sont à examiner avant de choisir l'emplacement.",
    ),
    faqs: [
      {
        question: "Pourquoi parler de l'accès avant une location de benne à Toulouse ?",
        answer:
          "L'accès du camion et le lieu de pose sont à vérifier avant la livraison. Un échange téléphonique nous permet de vous poser les bonnes questions et de préparer l'intervention.",
      },
      {
        question: "Quel volume de benne choisir pour une rénovation à Toulouse ?",
        answer:
          "Le bon volume dépend des déchets et de leur quantité. Appelez-nous : nous comparons votre projet aux volumes disponibles avant de confirmer la location.",
      },
    ],
    seo: {
      title: "Location de benne à Toulouse | Conseil accès et devis gratuit",
      description:
        "Location de benne à Toulouse pour rénovation, débarras et chantier. Nous vérifions par téléphone déchets, volume et accès avant de confirmer votre devis gratuit.",
    },
  },
  {
    key: "albi",
    path: "/location-benne-albi/",
    lastModified: "2026-07-12",
    city: "Albi",
    eyebrow: "Location de benne à Albi",
    title: "Location de benne à Albi : la solution adaptée à vos déchets",
    lead:
      "Pour vos déchets de chantier, vos encombrants ou vos végétaux à Albi, nous vous conseillons par téléphone avant toute confirmation afin de prévoir une benne adaptée.",
    introduction:
      "Chaque projet d'évacuation est différent. En nous expliquant ce que vous avez à évacuer, le volume estimé et les conditions d'accès, vous obtenez un conseil clair avant de réserver votre benne.",
    useCases: [
      {
        title: "Travaux et aménagements",
        description:
          "Réfection, aménagement intérieur ou petit chantier : nous vous aidons à associer votre volume de déchets à la benne la plus adaptée.",
      },
      {
        title: "Maison et jardin",
        description:
          "Pour un nettoyage de terrain, une taille ou un débarras, le premier échange sert à distinguer les déchets et à dimensionner votre besoin.",
      },
      {
        title: "Besoin ponctuel ou régulier",
        description:
          "Que votre projet soit unique ou lié à une activité professionnelle, nous prenons en compte vos délais et vos contraintes avant de vous proposer une solution.",
      },
    ],
    checklist: sharedChecklist,
    preparation: createPreparationGuidance(
      "Albi",
      "Pour une maison, un jardin ou un local en travaux à Albi, décrivez l'entrée du site et la surface de pose envisagée. Un emplacement stable, dégagé et accessible au camion aide à préparer une livraison sans mauvaise surprise.",
    ),
    faqs: [
      {
        question: "Quels déchets évoquer avant une location de benne à Albi ?",
        answer:
          "Indiquez-nous les matériaux concernés, par exemple gravats, végétaux ou encombrants. Nous vérifions ensuite par téléphone la solution appropriée à votre projet.",
      },
      {
        question: "Comment demander un devis pour une benne à Albi ?",
        answer:
          "Vous pouvez appeler directement ou remplir le formulaire. Dans les deux cas, nous échangeons avec vous avant de confirmer la location et le volume conseillé.",
      },
    ],
    seo: {
      title: "Location de benne à Albi | Devis, volume et accès vérifiés",
      description:
        "Location de benne à Albi pour travaux, débarras et déchets verts. Premier échange téléphonique, conseil sur le volume, vérification de l'accès et devis gratuit.",
    },
  },
];

export function getLocationPage(key) {
  return locationPages.find((page) => page.key === key) || null;
}
