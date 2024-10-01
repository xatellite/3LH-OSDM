import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import OSDM from 'osdm-client-lib';
import '@sbb-esta/lyne-elements/button.js';
import '@sbb-esta/lyne-elements/loading-indicator.js';
import '@sbb-esta/lyne-elements/card.js';
import { CurrencyPipe, DatePipe } from "@angular/common";
import { DurationPipe } from "../duration.pipe";

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [
    DatePipe,
    CurrencyPipe,
    DurationPipe
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.css',
})
export class BookingComponent {
  constructor(private route: ActivatedRoute) {}

  ticketData?: any;

  fetchFulfillment(bookingId: any) {
    OSDM.getBooking(bookingId)
      .then((booking: any) => {
        if (!booking.booking?.fulfillments) {
          setTimeout(() => this.fetchFulfillment(bookingId), 2000);
        } else {
          this.ticketData = booking;
        }
      })
      .catch(() => {
        setTimeout(() => this.fetchFulfillment(bookingId), 2000);
      });
  }

  openTicket() {
    (window as any)
      .open(
        (this.ticketData as any).booking.fulfillments[0].fulfillmentDocuments[0]
          .downloadLink,
        '_blank'
      )
      .focus();
  }

  ngOnInit(): void {
    this.fetchFulfillment((this.route.queryParams as any).value.b);
  }
}
