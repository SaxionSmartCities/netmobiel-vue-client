import moment from 'moment'
import {
  formatDateInputFromPicker,
  formatDatePickerFromInput,
} from '@/utils/datetime.js'

export default {
  persoonlijk: [
    { title: 'Voornaam', key: 'firstName' },
    { title: 'Achternaam', key: 'lastName' },
    {
      title: 'Geboortedatum',
      key: 'dateOfBirth',
      format: formatDateInputFromPicker,
      parse: formatDatePickerFromInput,
    },
    // {
    //   title: 'Interesses',
    //   key: 'interests',
    //   format: function(value) {
    //     return value.join(', ')
    //   },
    //   parse(value) {
    //     return value
    //       .split(',')
    //       .map(s => s.trim())
    //       .filter(s => s.length)
    //   },
    // },
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
