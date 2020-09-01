const driver = {
  melding: [
    { title: 'Bevestiging nieuwe reis', value: false },
    { title: 'Wijziging bewaarde reis', value: false },
    { title: 'Herinnering voor aanvang reis', value: false },
    { title: 'Nieuw persoonlijk bericht', value: false },
    { title: 'Oproepen uit de community', value: false },
  ],
  reviews: [
    { title: 'Beoordeel je reis', value: false },
    { title: 'Deel mijn reviews met anderen', value: false },
  ],
}
const passenger = {
  melding: [
    { title: 'Bevestiging nieuwe reis', value: false },
    { title: 'Wijziging bewaarde reis', value: false },
    { title: 'Herinnering voor aanvang reis', value: false },
    { title: 'Nieuw persoonlijk bericht', value: false },
    { title: 'Oproepen uit de community', value: false },
  ],
  reviews: [
    { title: 'Beoordeel je reis', value: false },
    { title: 'Deel mijn reviews met anderen', value: false },
  ],
}
const both = { ...driver }

export default {
  driver,
  passenger,
  both,
}
