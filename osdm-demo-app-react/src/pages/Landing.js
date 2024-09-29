import { SbbButton } from "@sbb-esta/lyne-react/button";
import {
  SbbFormField,
  SbbFormFieldClear,
} from "@sbb-esta/lyne-react/form-field";
import { SbbCard } from "@sbb-esta/lyne-react/card";
import OSDM from "osdm-client-lib";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const passengers = [
  {
    externalRef: "passenger_1",
    dateOfBirth: "1980-01-01",
    type: "PERSON",
    detail: {
      firstName: "Elo",
      lastName: "Musterperson",
      phoneNumber: "+49475000001",
      email: "elo.musterperson@dlh.com",
    },
  },
];

const Landing = () => {
  const [origin, setOrigin] = useState([]);
  const [destination, setDestination] = useState([]);
  const [tripResults, setTripResults] = useState([]);
  const [offerResults, setOfferResults] = useState([]);
  const navigate = useNavigate();

  const getOffers = () => {
    OSDM.searchOffers(
      {
        stopPlaceRef: origin,
        objectType: "StopPlaceRef",
      },
      {
        stopPlaceRef: destination,
        objectType: "StopPlaceRef",
      },
      passengers,
      "2024-10-10T10:00:00Z"
    ).then((offers) => {
      console.log(offers);
      setOfferResults(offers.offers);
      setTripResults(offers.trips);
    });
  };

  const buyOffer = (offerId) => {
    // Makes a booking and navigates to an overview screen
    OSDM.createBooking(offerId, passengers).then((booking) => {
      const bookingId = booking.booking.id;
      OSDM.fulfillBooking(bookingId).then(() => {
        navigate("/booking", { state: { bookingId } });
      });
    });
  };

  return (
    <div className="flex flex-col">
      <div className="flex gap-5 items-center w-full p-10 justify-center">
        <SbbFormField>
          <label>Origin</label>
          <input
            type="text"
            placeholder="Input placeholder"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
          />
          <SbbFormFieldClear></SbbFormFieldClear>
        </SbbFormField>
        <SbbFormField>
          <label>Destination</label>
          <input
            type="text"
            placeholder="Input placeholder"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />
          <SbbFormFieldClear></SbbFormFieldClear>
        </SbbFormField>
        <SbbButton onClick={getOffers}>Search</SbbButton>
      </div>
      <div className="flex flex-col">
        {tripResults.map((trip) => (
          <SbbCard type="submit" form="buy" value="trip" key={trip.id}>
            {trip.startTime}
            <div className="flex flex-col">
              {offerResults
                .filter((offer) => offer.tripCoverage.coveredTripId === trip.id)
                .map((offer) => (
                  <sbb-option
                    value="Value 1"
                    icon-name="ticket"
                    key={offer.offerId}
                  >
                    {offer.offerSummary.minimalPrice.amount}

                    <SbbButton onClick={() => buyOffer(offer.offerId)}>
                      Buy
                    </SbbButton>
                  </sbb-option>
                ))}
            </div>
          </SbbCard>
        ))}
      </div>
    </div>
  );
};

export default Landing;
