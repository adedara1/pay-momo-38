export const cedeaoCountries = [
  "Bénin",
  "Burkina Faso",
  "Cap-Vert",
  "Côte d'Ivoire",
  "Gambie",
  "Ghana",
  "Guinée",
  "Guinée-Bissau",
  "Liberia",
  "Mali",
  "Niger",
  "Nigeria",
  "Sénégal",
  "Sierra Leone",
  "Togo"
];

export const citiesByCountry: { [key: string]: string[] } = {
  "Bénin": [
    "Cotonou",
    "Porto-Novo",
    "Parakou",
    "Abomey-Calavi",
    "Bohicon",
    "Natitingou",
    "Lokossa",
    "Ouidah",
    "Djougou",
    "Kandi"
  ],
  "Côte d'Ivoire": [
    "Abidjan",
    "Bouaké",
    "Yamoussoukro",
    "Korhogo",
    "San-Pédro",
    "Man",
    "Daloa",
    "Gagnoa",
    "Divo",
    "Abengourou"
  ],
  // Add other countries' cities here
};

export const momoProviders = [
  {
    value: "mtn_ci",
    label: "MTN Money Côte d'Ivoire",
    country: "Côte d'Ivoire"
  },
  {
    value: "orange_ci",
    label: "Orange Money Côte d'Ivoire",
    country: "Côte d'Ivoire"
  },
  {
    value: "moov_ci",
    label: "Moov Money Côte d'Ivoire",
    country: "Côte d'Ivoire"
  },
  {
    value: "wave_ci",
    label: "Wave Côte d'Ivoire",
    country: "Côte d'Ivoire"
  },
  {
    value: "mtn_bj",
    label: "MTN Money Bénin",
    country: "Bénin"
  },
  {
    value: "moov_bj",
    label: "Moov Money Bénin",
    country: "Bénin"
  }
];