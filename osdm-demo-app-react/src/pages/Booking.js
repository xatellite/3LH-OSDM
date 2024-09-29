import { SbbButton } from "@sbb-esta/lyne-react/button";
import { useLocation } from "react-router-dom";
import OSDM from "osdm-client-lib";
import { useState } from "react";

const Booking = () => {
  const location = useLocation();
  const data = location.state;

  const [ticketData, setTicketData] = useState();

  OSDM.getBooking(data.bookingId).then((booking) => {
    setTicketData(booking);
  });

  const openTicket = () => {
    // ToDo Finish
    window.open(ticketData.fulfillment, "_blank").focus();
  };

  return (
    <div className="flex flex-col w-full justify-center items-center">
      <h1>Booking</h1>
      <span>{ticketData}</span>
      <SbbButton onClick={openTicket}>Open Ticket</SbbButton>
    </div>
  );
};

export default Booking;
