const driver = {
  melding: [
    { title: 'Bevestiging nieuwe rit', value: true },
    { title: 'Wijziging bewaarde rit', value: true },
    { title: 'Herinnering voor aanvang rit', value: true },
    { title: 'Nieuw persoonlijk bericht', value: true },
    { title: 'Oproepen uit de community', value: true },
  ],
  beoordelingen: [
    { title: 'Beoordeel je rit', value: true },
    { title: 'Deel mijn beoordelingen met anderen', value: true },
  ],
}
const passenger = {
  melding: [
    { title: 'Bevestiging nieuwe rit', value: true },
    { title: 'Wijziging bewaarde rit', value: true },
    { title: 'Herinnering voor aanvang rit', value: true },
    { title: 'Nieuw persoonlijk bericht', value: true },
    { title: 'Oproepen uit de community', value: true },
  ],
  beoordelingen: [
    { title: 'Beoordeel je rit', value: true },
    { title: 'Deel mijn beoordelingen met anderen', value: true },
  ],
}
const both = { ...driver }

export default {
  driver,
  passenger,
  both,
}
