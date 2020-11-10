const driver = {
  melding: [
    {
      title: 'Bevestiging nieuwe rit',
      info:
        'Je ontvangt een melding wanneer een chauffeur jouw ritverzoek heeft geaccepteerd of wanneer een passagier met jou wil meerijden.',
      value: true,
    },
    {
      title: 'Wijziging bewaarde rit',
      info:
        'Je ontvangt een melding wanneer er wijzigingen worden aangebracht op jouw bewaarde reis. Denk aan een annulering.',
      value: true,
    },
    {
      title: 'Herinnering voor aanvang rit',
      info:
        '5 Minuten voor je reis wordt je via een melding herinnerd dat je reis spoedig plaatsvindt.',
      value: true,
    },
    {
      title: 'Nieuw persoonlijk bericht',
      info:
        'Je ontvangt een melding wanneer een passagier of chauffeur jou een chatbericht stuurt.',
      value: true,
    },
    {
      title: 'Oproepen uit de community',
      info:
        'Je ontvangt een melding wanneer een passagier een oproep heeft ingediend in de buurt van jouw huis.',
      value: true,
    },
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
