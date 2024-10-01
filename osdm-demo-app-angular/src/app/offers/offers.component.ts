import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { CurrencyPipe } from "@angular/common";
import { Router } from "@angular/router";

@Component({
  selector: 'app-offers',
  standalone: true,
  imports: [
    CurrencyPipe
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './offers.component.html',
  styleUrl: './offers.component.css'
})
export class OffersComponent {
  @Input() offers: any[] = [];


  constructor(private router: Router) {
  }

  buyOffer(offerId: any) {
    this.router.navigate(['/confirmation'], {queryParams: {o: offerId}});

    // Makes a booking and navigates to an overview screen
    /*OSDM.createBooking(offerId, passengers).then((booking: any) => {
      const bookingId = booking.booking.id;
      OSDM.fulfillBooking(bookingId).then(() => {
        this.router.navigate(['/booking'], {queryParams: {b: bookingId}});
      });
    });*/
  }
}
