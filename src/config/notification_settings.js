const driver = {
  melding: [
    { title: 'Bevestiging nieuwe rit', value: false },
    { title: 'Wijziging bewaarde rit', value: false },
    { title: 'Herinnering voor aanvang rit', value: false },
    { title: 'Nieuw persoonlijk bericht', value: false },
    { title: 'Oproepen uit de community', value: false },
  ],
  reviews: [
    { title: 'Beoordeel je rit', value: false },
    { title: 'Deel mijn reviews met anderen', value: false },
  ],
}
const passenger = {
  melding: [
    { title: 'Bevestiging nieuwe rit', value: false },
    { title: 'Wijziging bewaarde rit', value: false },
    { title: 'Herinnering voor aanvang rit', value: false },
    { title: 'Nieuw persoonlijk bericht', value: false },
    { title: 'Oproepen uit de community', value: false },
  ],
  reviews: [
    { title: 'Beoordeel je rit', value: false },
    { title: 'Deel mijn reviews met anderen', value: false },
  ],
}
const both = { ...driver }

export default {
  driver,
  passenger,
  both,
}
