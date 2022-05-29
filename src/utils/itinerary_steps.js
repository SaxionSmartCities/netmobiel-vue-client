import moment from 'moment'
import travelModes from '@/constants/travel-modes.js'

const MIN_WAITING_TIME = 60 // Time in seconds

export function generateItineraryDetailSteps(itinerary) {
  // Guard: If we have no legs then we have no steps.
  if (itinerary == null || !itinerary.legs) {
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

export function generateRideItineraryDetailSteps(ride) {
  // console.log(`Generate ride steps: ${ride?.rideRef}`)
  // Guard: If we have no ride (id) then don't do the processing.
  if (!ride?.id) return []

  let result = []
  let bookingDict = generateBookingDictionary(ride.bookings)
  for (let i = 0; i < ride.legs.length - 1; i++) {
    let currentLeg = ride.legs[i]
    setPassenger(currentLeg, bookingDict)
    let nextLeg = ride.legs[i + 1]
    result.push(currentLeg)

    // For 'long' waiting times we will add a custom 'WAIT' step.
    if (nextLeg.startTime - currentLeg?.endTime > MIN_WAITING_TIME * 1000) {
      result.push({
        mode: 'WAIT',
        startTime: currentLeg.endTime,
        endTime: nextLeg.startTime,
        duration: (nextLeg.startTime - currentLeg.endTime) / 1000,
      })
    }
  }
  // Push the last leg and add a custom 'FINISH' step.
  let lastLeg = ride.legs[ride.legs.length - 1]
  setPassenger(lastLeg, bookingDict)
  result.push(lastLeg)
  result.push({
    mode: 'FINISH',
    startTime: lastLeg.endTime,
    to: lastLeg.to,
  })
  return result
}

function generateBookingDictionary(bookings) {
  let dict = []
  for (let i = 0; i < bookings.length; i++) {
    let map = bookings[i].legs.map((l) => {
      let dictItem = { ...bookings[i].passenger }
      dictItem.legRef = l.legRef
      return dictItem
    })
    dict = dict.concat(map)
  }
  return dict
}

function setPassenger(leg, bookingDict) {
  // TODO: Check why modality is not provided
  if (leg) {
    leg.mode = travelModes.CAR.mode
    let passenger = bookingDict.find((b) => b.legRef === leg.legRef)
    if (passenger) {
      leg.passenger = passenger
      leg.mode = travelModes.RIDESHARE.mode
    }
    // console.log(`Leg ${leg.id} Passenger ${passenger?.managedIdentity}`)
  }
}

export function generateCommunityShoutOutDetailSteps(shoutout) {
  const departure = shoutout.useAsArrivalTime
    ? null
    : moment(shoutout.travelTime).toDate().getTime()
  const arrival = shoutout.useAsArrivalTime
    ? moment(shoutout.travelTime).toDate().getTime()
    : null
  const fromLabel = shoutout.from ? shoutout.from.label : ''
  const toLabel = shoutout.to ? shoutout.to.label : ''
  return [
    {
      mode: 'CAR',
      startTime: departure,
      endTime: arrival,
      from: { label: fromLabel },
    },
    {
      mode: 'ARRIVAL',
      startTime: arrival,
      from: { label: toLabel },
    },
  ]
}

export function generateShoutOutItineraryDetailSteps(
  shoutOut,
  proposedItinerary,
  driverView = false
) {
  let steps = []
  if (proposedItinerary != null) {
    steps = generateItineraryDetailSteps(proposedItinerary)
    const travelTime = moment(shoutOut.travelTime)
    const rslegIx = steps.findIndex((leg) => leg.traverseMode === 'RIDESHARE')
    if (rslegIx >= 0) {
      const rsleg = steps[rslegIx]
      const actualTravelTime = moment(
        shoutOut.useAsArrivalTime ? rsleg.endTime : rsleg.startTime
      )
      steps[shoutOut.useAsArrivalTime ? rslegIx + 1 : rslegIx].deltaTime =
        moment.duration(actualTravelTime.diff(travelTime)).as('milliseconds')
    }
  } else {
    steps = generateCommunityShoutOutDetailSteps(shoutOut)
  }
  if (driverView) {
    steps
      .filter((leg) => leg.traverseMode === 'RIDESHARE')
      .forEach((leg) => (leg.passenger = shoutOut.traveller))
  }
  return steps
}

/**
 * Generates the steps for a ride. A ride from a list of rides has no leg information.
 * (it is taken from a list of proposed rides).
 * When a detailed view is requested, the legs of a ride are available too.
 * The bookings of a ride are always available.
 * @param ride the ride from a list of rides
 * @param veryDetailed if true then add all details
 * @return {*[]} a list of steps
 */
export function generateShoutOutRideOfferDetailSteps(ride, veryDetailed) {
  // eslint-disable-next-line no-unused-vars
  const { fromPlace, toPlace, car, bookings, legs } = ride
  // If the legs are available too, then booking.legs[].legRef points to the
  // leg with passenger.
  // The leg also has info on the distance.
  // All other information is available in the booking too.
  // If there would be waiting steps in between, then the leg information is really needed.
  // A detailed ride has all car information.
  // A listed ride has only cat brand and model.
  const steps = []
  const booking = bookings?.find((b) => b.state.toUpperCase() === 'PROPOSED')
  if (booking) {
    let departureTime = moment(ride.departureTime).toDate().getTime()
    let arrivalTime = moment(ride.arrivalTime).toDate().getTime()
    let pickupTime = moment(booking.departureTime).toDate().getTime()
    let dropOffTime = moment(booking.arrivalTime).toDate().getTime()
    // Check whether the driver has to ride a part to pickup the passenger
    // If so, he departs before he does a pickup
    if (ride.departureTime !== booking.departureTime) {
      steps.push({
        mode: 'CAR',
        startTime: departureTime,
        endTime: pickupTime,
        from: { label: fromPlace.label },
      })
    }
    const rideshareStep = {
      mode: 'RIDESHARE',
      startTime: pickupTime,
      endTime: dropOffTime,
      from: { label: booking.pickup.label },
    }
    if (veryDetailed) {
      rideshareStep.driverName = 'Jij'
      rideshareStep.vehicleName = car.brand
      rideshareStep.vehicleLicensePlate = car.model
      // Omit the driver image, it is always the current driver.
      // if (ride.driverRef) {
      //   rideshareStep.driverId = ride.driverRef
      // }
    }
    steps.push(rideshareStep)
    // Check whether the driver has to ride a part to reach his own final destination
    // If so, he arrives after he does a drop-off
    if (ride.arrivalTime !== booking.arrivalTime) {
      steps.push({
        mode: 'CAR',
        startTime: dropOffTime,
        endTime: arrivalTime,
        from: { label: booking.dropOff.label },
      })
    }
    steps.push({
      mode: 'FINISH',
      startTime: arrivalTime,
      to: { label: toPlace.label },
    })
  }
  return steps
}
