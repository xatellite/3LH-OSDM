import { SbbButton } from "@sbb-esta/lyne-react/button";
import { useLocation } from "react-router-dom";
import OSDM from "osdm-client-lib";
import { useEffect, useState } from "react";

const Booking = () => {
  const location = useLocation();
  const data = location.state;

  const [ticketData, setTicketData] = useState();

  const fetchFulfillment = () => {
    OSDM.getBooking(data.bookingId)
      .then((booking) => {
        if (!booking.booking?.fulfillments) {
          setTimeout(fetchFulfillment, 2000);
        } else {
          setTicketData(booking);
        }
      })
      .catch(() => {
        setTimeout(fetchFulfillment, 2000);
      });
  };

  useEffect(() => {
    fetchFulfillment();
  }, []);

  const openTicket = () => {
    // ToDo Finish
    if (ticketData && ticketData.booking) {
      window
        .open(
          ticketData.booking.fulfillments[0].fulfillmentDocuments[0]
            .downloadLink,
          "_blank"
        )
        .focus();
    }
  };

  return (
    <div className="flex flex-col w-full justify-center items-center">
      <h1>Booking</h1>
      <span>{JSON.stringify(ticketData)}</span>
      <SbbButton onClick={openTicket}>Open Ticket</SbbButton>
    </div>
  );
};

export default Booking;
