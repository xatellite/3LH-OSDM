const SANDBOX_URL = "http://localhost:5050/benerail";

export const searchPlaces = async (name) => {
  const response = await fetch(`${SANDBOX_URL}/places`, {
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

export const getPlace = async (placeID) => {
  const response = await fetch(`${SANDBOX_URL}/places/${placeID}`);
  const data = await response.json();
  return data;
};

export const getPlaces = async () => {
  const response = await fetch(`${SANDBOX_URL}/places`);
  const data = await response.json();
  return data;
};

export const getBooking = async (bookingId) => {
  const response = await fetch(`${SANDBOX_URL}/bookings/${bookingId}`);
  const data = await response.json();
  return data;
};

export const searchTrips = async (
  departureTime,
  arrivalTime,
  start,
  destination
) => {
  const response = await fetch(`${SANDBOX_URL}/trips-collection/${placeID}`);
  const data = await response.json();
  return data;
};

export const searchOffers = async (
  origin,
  destination,
  anonymousPassengerSpecifications,
  departureTime = undefined,
  arrivalTime = undefined,
  vias = undefined
) => {
  const response = await fetch(`${SANDBOX_URL}/offers`, {
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
        vias
      },
      objectType: "OfferCollectionRequest",
    }),
  });
  const data = await response.json();
  return data;
};

export const createBooking = async (offerId, passengers) => {
  const response = await fetch(`${SANDBOX_URL}/bookings`, {
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

export const fulfillBooking = async (bookingId) => {
  const response = await fetch(
    `${SANDBOX_URL}/bookings/${bookingId}/fulfillments`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    }
  );
};
