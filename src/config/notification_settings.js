const driver = {
  melding: [
    {
      title: 'Ritbevestigingen',
      info: 'Je ontvangt een melding wanneer een chauffeur jouw ritverzoek heeft geaccepteerd of wanneer een passagier met jou wil meerijden.',
      key: 'tripConfirmations',
    },
    {
      title: 'Ritwijzigingen',
      info: 'Je ontvangt een melding wanneer er wijzigingen worden aangebracht op jouw bewaarde reis. Denk aan een annulering.',
      key: 'tripUpdates',
    },
    {
      title: 'Ritherinneringen',
      info: '5 Minuten voor je reis wordt je via een melding herinnerd dat je reis spoedig plaatsvindt.',
      key: 'tripReminders',
    },
    {
      title: 'Berichten',
      info: 'Je ontvangt een melding wanneer een passagier of chauffeur jou een chatbericht stuurt.',
      key: 'messages',
    },
    {
      title: 'Ritoproepen',
      info: 'Je ontvangt een melding wanneer een passagier een oproep heeft ingediend in de buurt van jouw huis.',
      key: 'shoutouts',
    },
  ],
  beoordelingen: [
    {
      title: 'Beoordeel je rit',
      info: 'Je ontvangt een melding na aanvang van je rit met het verzoek om een beoordeling achter te laten voor de chauffeur van de afgelegde rit.',
      value: true,
    },
    { title: 'Deel mijn beoordelingen met anderen', value: true },
  ],
}
const passenger = {
  melding: [
    {
      title: 'Ritbevestigingen',
      info: 'Je ontvangt een melding wanneer een chauffeur jouw ritverzoek heeft geaccepteerd of wanneer een passagier met jou wil meerijden.',
      key: 'tripConfirmations',
    },
    {
      title: 'Ritwijzigingen',
      info: 'Je ontvangt een melding wanneer er wijzigingen worden aangebracht op jouw bewaarde reis. Denk aan een annulering.',
      key: 'tripUpdates',
    },
    {
      title: 'Ritherinneringen',
      info: '5 minuten voor je reis wordt je via een melding herinnerd dat je reis spoedig plaatsvindt.',
      key: 'tripReminders',
    },
    {
      title: 'Berichten',
      info: 'Je ontvangt een melding wanneer een passagier of chauffeur jou een chatbericht stuurt.',
      key: 'messages',
    },
    {
      title: 'Ritoproepen',
      info: 'Je ontvangt een melding wanneer een passagier een oproep heeft ingediend in de buurt van jouw huis.',
      key: 'shoutouts',
    },
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
