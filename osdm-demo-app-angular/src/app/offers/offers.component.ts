import {Component, CUSTOM_ELEMENTS_SCHEMA, Input} from '@angular/core';
import {CurrencyPipe} from "@angular/common";
import {Router} from "@angular/router";
import '@sbb-esta/lyne-elements/popover.js';

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

  normalizeText(text: String) {
    // Convert the text to lowercase
    const lowercased = text.toLowerCase();

    // Replace underscores with spaces
    const spacesAdded = lowercased.replace(/_/g, ' ');

    // Capitalize the first letter of each word
    const words = spacesAdded.split(' ');
    const capitalized = words.map(word => word.charAt(0).toUpperCase() + word.slice(1));

    // Join the words back into a single string
    return capitalized.join(' ');
  }

  normalizeClassText(text: String) {
    if (text.toLowerCase() == 'first') {
      return '1st class';
    }
    if (text.toLowerCase() == 'second') {
      return '2nd class';
    }
    return this.normalizeText(text);
  }
}
