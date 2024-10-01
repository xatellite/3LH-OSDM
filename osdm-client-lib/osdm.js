export const searchPlaces = async (base_url, name) => {
  const response = await fetch(`${base_url}/places`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      placeInput: {
        name: name,
      },
    }),
  });
  const data = await response.json();
  return data;
};

export const getPlace = async (base_url, placeID) => {
  const response = await fetch(`${base_url}/places/${placeID}`);
  const data = await response.json();
  return data;
};

export const getPlaces = async (base_url) => {
  const response = await fetch(`${base_url}/places`);
  const data = await response.json();
  return data;
};

export const getBooking = async (bookingId) => {
  const response = await fetch(`${base_url}/bookings/${bookingId}`);
  const data = await response.json();
  return data;
};

export const searchTrips = async (
  base_url,
  departureTime,
  arrivalTime,
  start,
  destination
) => {
  const response = await fetch(`${base_url}/trips-collection/${placeID}`);
  const data = await response.json();
  return data;
};

export const searchOffers = async (
  base_url,
  origin,
  destination,
  anonymousPassengerSpecifications,
  departureTime = undefined,
  arrivalTime = undefined
) => {
  const response = await fetch(`${base_url}/offers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      anonymousPassengerSpecifications,
      tripSearchCriteria: {
        departureTime,
        arrivalTime,
        origin,
        destination,
      },
      objectType: "OfferCollectionRequest",
    }),
  });
  const data = await response.json();
  return data;
};

export const createBooking = async (base_url, offerId, passengers) => {
  const response = await fetch(`${base_url}/bookings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      offers: [
        {
          offerId,
          passengerRefs: passengers.map((passenger) => passenger.externalRef),
        },
      ],
      passengerSpecifications: passengers,
      purchaser: {
        detail: {
          firstName: "",
          lastName: "",
        },
      },
      externalRef: "myboooking",
    }),
  });
  const data = await response.json();
  return data;
};

export const fulfillBooking = async (base_url, bookingId) => {
  const response = await fetch(
    `${base_url}/bookings/${bookingId}/fulfillments`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    }
  );
};
