import moment from 'moment'

const MIN_WAITING_TIME = 60 // Time in seconds

export function generateItineraryDetailSteps(itinerary) {
  // Guard: If we have no legs then we have no steps.
  if (itinerary == null || !itinerary.legs || itinerary.legs.length == 0) {
    return []
  }
  let steps = []
  for (let i = 0; i < itinerary.legs.length - 1; i++) {
    // Add every leg to steps.
    let currentLeg = itinerary.legs[i]
    let nextLeg = itinerary.legs[i + 1]
    steps.push(currentLeg)

    // For 'long' waiting times we will add a custom 'WAIT' step.
    if (nextLeg.startTime - currentLeg.endTime > MIN_WAITING_TIME * 1000) {
      steps.push({
        traverseMode: 'WAIT',
        startTime: currentLeg.endTime,
        endTime: nextLeg.startTime,
        duration: (nextLeg.startTime - currentLeg.endTime) / 1000,
      })
    }
  }
  // Push the last leg and add a custom 'FINISH' step.
  let lastLeg = itinerary.legs[itinerary.legs.length - 1]
  steps.push(lastLeg)
  steps.push({
    traverseMode: 'FINISH',
    startTime: lastLeg.endTime,
    endTime: lastLeg.endTime,
    to: lastLeg.to,
  })
  return steps
}

export function generateShoutOutDetailSteps(shoutout) {
  if (shoutout.ride) {
    return generateShoutOutOfferDetailSteps(shoutout)
  } else {
    return generateCommunityShoutOutDetailSteps(shoutout)
  }
}

function generateCommunityShoutOutDetailSteps(shoutout) {
  const departure = shoutout.useAsArrivalTime
    ? null
    : moment(shoutout.travelTime)
        .toDate()
        .getTime()
  const arrival = shoutout.useAsArrivalTime
    ? moment(shoutout.travelTime)
        .toDate()
        .getTime()
    : null
  const from = shoutout.from ? shoutout.from.label : '',
    to = shoutout.to ? shoutout.to.label : ''
  return [
    {
      mode: 'CAR',
      startTime: departure,
      endTime: arrival,
      from: { name: from },
    },
    {
      mode: 'ARRIVAL',
      startTime: arrival,
      from: { name: to },
    },
  ]
}

function generateShoutOutOfferDetailSteps(shoutout) {
  const { fromPlace, car, bookings } = shoutout.ride
  let steps = []
  const booking = bookings.find(b => b.state === 'PROPOSED')
  if (booking) {
    let departureTime = moment(shoutout.ride.departureTime)
      .toDate()
      .getTime()
    let arrivalTime = moment(shoutout.ride.arrivalTime)
      .toDate()
      .getTime()
    let pickupTime = moment(booking.departureTime)
      .toDate()
      .getTime()
    let dropOffTime = moment(booking.arrivalTime)
      .toDate()
      .getTime()
    steps.push({
      mode: 'CAR',
      startTime: departureTime,
      endTime: pickupTime,
      from: { name: fromPlace.label },
    })
    steps.push({
      mode: 'RIDESHARE',
      startTime: pickupTime,
      endTime: dropOffTime,
      from: { label: booking.pickup.label },
      driverName: 'Jij',
      vehicleName: car.brand,
      vehicleLicensePlate: car.model,
      tripId: shoutout.ride.id,
    })
    steps.push({
      mode: 'ARRIVAL',
      startTime: dropOffTime,
      endTime: arrivalTime,
      from: { name: booking.dropOff.label },
    })
  }
  return steps
}
