import moment from 'moment'

export const DATE_FORMAT_INPUT = 'DD-MM-YYYY',
  DATE_FORMAT_PICKER = 'YYYY-MM-DD',
  TIME_FORMAT = 'HH:mm',
  TIMESTAMP_FORMAT = `${DATE_FORMAT_INPUT} ${TIME_FORMAT}`

export function formatDateInputFromPicker(pickedDate) {
  return moment(pickedDate, DATE_FORMAT_PICKER).format(DATE_FORMAT_INPUT)
}

export function formatDatePickerFromInput(date) {
  return moment(date, DATE_FORMAT_INPUT).format(DATE_FORMAT_PICKER)
}

export function formatDateTimeLong(date) {
  return moment(date).locale('nl').format('dddd DD-MMM-YYYY')
}

export function formatDateTimeLongNoYear(date) {
  return moment(date).locale('nl').format('dddd D MMMM')
}

export function formatDateTimeLongYear(date) {
  return moment(date).locale('nl').format('dddd D MMMM YYYY')
}
export function formatDateTimeLongYearTime(date) {
  return moment(date).locale('nl').format('dddd D MMMM YYYY HH:mm')
}
