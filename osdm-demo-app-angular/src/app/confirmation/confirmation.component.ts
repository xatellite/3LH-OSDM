import {Component, CUSTOM_ELEMENTS_SCHEMA, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import OSDM from 'osdm-client-lib';
import '@sbb-esta/lyne-elements/button.js';
import '@sbb-esta/lyne-elements/form-field.js';
import '@sbb-esta/lyne-elements/select.js';
import '@sbb-esta/lyne-elements/option.js';
import '@sbb-esta/lyne-elements/card.js';
import '@sbb-esta/lyne-elements/autocomplete.js';
import '@sbb-esta/lyne-elements/journey-header.js';
import {FormsModule} from '@angular/forms';
import {CurrencyPipe, DatePipe, JsonPipe} from "@angular/common";
import {DurationPipe} from "../duration.pipe";
import * as mockData from '../../../assets/booking.json';
import * as stationData from '../../../assets/uic.json';


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
  selector: 'confirmation',
  standalone: true,
  imports: [FormsModule, JsonPipe, DatePipe, CurrencyPipe, DurationPipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './confirmation.component.html',
  styleUrl: './confirmation.component.css',
})
export class ConfirmationComponent implements OnInit {
  constructor(private router: Router, private route: ActivatedRoute) {
  }

  bookingId?: string;
  booking?: any;
  loading = false;
  useMockData = false;
  legs : any;

  confirm() {
    this.loading = true;
    OSDM.fulfillBooking(this.bookingId).then(() => {
      this.router.navigate(['/booking'], {queryParams: {b: this.bookingId}});
    });
  }

  resolveStationNameFromUic(uic: string) : string {
    const parts : string[] = uic.split(":");
    return stationData.stops[parts[parts.length - 1] as keyof typeof stationData.stops].default_name;
  }

  ngOnInit(): void {
    if  (this.useMockData) {
      this.bookingId = mockData.booking.id;
      this.booking = mockData;
      this.generateLeg(this.booking);
    } else {
      OSDM.createBooking((this.route.queryParams as any).value.o, passengers).then((booking: any) => {
        this.booking = booking;
        this.bookingId = booking.booking.id;
        this.generateLeg(this.booking);
      });
    }
  }

  generateLeg(booking : any) {
    var legs = [];
    for (var i = 0; i < booking.booking.trips[0].legs.length; i++) {
      if (booking.booking.trips[0].legs[i].timedLeg == null) {
        continue;
      }

      legs.push({
        __typename: "PTRideLeg",
        arrival: {
          time: booking.booking.trips[0].legs[i].timedLeg.start.serviceDeparture.timetabledTime
        },
        departure: {
          time: booking.booking.trips[0].legs[i].timedLeg.end.serviceArrival.timetabledTime
        },
        serviceJourney: {
          quayTypeName: "platform",
          quayTypeShortName: "Pl.",
          serviceAlteration: {
            cancelled: false,
            delayText: "string",
            reachable: true,
            unplannedStopPointsText: ""
          }
        }
      });
    }
    this.legs = legs;
  }
}
