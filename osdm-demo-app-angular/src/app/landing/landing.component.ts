import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';
import { Router } from '@angular/router';
import OSDM from 'osdm-client-lib';
import '@sbb-esta/lyne-elements/button.js';
import '@sbb-esta/lyne-elements/form-field.js';
import { FormsModule } from '@angular/forms';
import { JsonPipe } from "@angular/common";

const passengers = [
  {
    externalRef: 'passenger_1',
    dateOfBirth: '1980-01-01',
    type: 'PERSON',
    detail: {
      firstName: 'Elo',
      lastName: 'Musterperson',
      phoneNumber: '+49475000001',
      email: 'elo.musterperson@dlh.com',
    },
  },
];

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [FormsModule, JsonPipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css',
})
export class LandingComponent {
  constructor(private router: Router) {}
  origin = 'urn:uic:stn:8814001'; // Brussels
  via = 'urn:uic:stn:8503000'; // Zurich
  destination = 'urn:uic:stn:8503000'; // Praha

  offerResults: any = [];
  tripResults: any = [];

  getOffers() {
    OSDM.searchOffers(
      {
        stopPlaceRef: this.origin,
        objectType: 'StopPlaceRef',
      },
      {
        stopPlaceRef: this.destination,
        objectType: 'StopPlaceRef',
      },
      passengers,
      '2024-10-10T10:00:00Z',
      undefined,
      [
        {
          viaPlace:  {
            stopPlaceRef: this.via,
            objectType: 'StopPlaceRef',
          }
        }
      ]
    ).then((offers: any) => {
      console.log(offers);
      this.offerResults = offers.offers;
      this.tripResults = offers.trips;
    });
  }

  buyOffer(offerId: any) {
    // Makes a booking and navigates to an overview screen
    OSDM.createBooking(offerId, passengers).then((booking: any) => {
      const bookingId = booking.booking.id;
      OSDM.fulfillBooking(bookingId).then(() => {
        this.router.navigate(['/booking'], { queryParams: { b: bookingId } });
      });
    });
  }
}
