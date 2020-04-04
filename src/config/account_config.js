import moment from 'moment'

export default {
  persoonlijk: [
    { title: 'Voornaam', key: 'firstName' },
    { title: 'Achternaam', key: 'lastName' },
    {
      title: 'Leeftijd',
      key: 'dateOfBirth',
      format: function(value) {
        return moment().diff(value, 'years')
      },
    },
    {
      title: 'Interesses',
      key: 'interests',
      format: function(value) {
        return value.join(', ')
      },
    },
  ],
  adres: [
    { title: 'Straat', key: 'address.street' },
    { title: 'Huisnummer', key: 'address.houseNumber' },
    { title: 'Postcode', key: 'address.postalCode' },
    { title: 'Plaats', key: 'address.locality' },
  ],
  'bereikbaar op': [
    { title: 'E-mailadres', key: 'email' },
    { title: 'Telefoonnummer', key: 'phoneNumber' },
  ],
}
