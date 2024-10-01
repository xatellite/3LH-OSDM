import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import OSDM from 'osdm-client-lib';
import '@sbb-esta/lyne-elements/button.js';
import '@sbb-esta/lyne-elements/form-field.js';
import '@sbb-esta/lyne-elements/select.js';
import '@sbb-esta/lyne-elements/option.js';
import '@sbb-esta/lyne-elements/autocomplete.js';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe, DatePipe, JsonPipe } from "@angular/common";
import * as uicData from '../../../assets/uic.json';
import { DurationPipe } from "../duration.pipe";
import { OffersComponent } from "../offers/offers.component";

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
  imports: [FormsModule, JsonPipe, DatePipe, CurrencyPipe, DurationPipe, OffersComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css',
})
export class LandingComponent implements OnInit {
  constructor(private router: Router) {
  }

  origin = 'Zürich HB'; // Brussels
  via = 'München Hbf'; // Zurich
  destination = 'Praha hl.n.'; // Praha
  stationDataMap = new Map<string, string>();
  stations: string[] = [];
  loading = false;
  selectedTrip: any;
  selectedOffers: any;

  ngOnInit() {
    Object.values(uicData.stops).forEach((value) => {
      this.stationDataMap.set(value.default_name, value.id);
    });
  }

  offerResults: any = [];
  tripResults: any = [];

  getOffers() {
    this.loading = true;
    OSDM.searchOffers(
      {
        stopPlaceRef: this.resolveStationNameToUic(this.origin),
        objectType: 'StopPlaceRef',
      },
      {
        stopPlaceRef: this.resolveStationNameToUic(this.destination),
        objectType: 'StopPlaceRef',
      },
      passengers,
      '2024-10-14T09:00:00.000Z',
      undefined,
      this.via.length > 0 ? [
        {
          viaPlace: {
            stopPlaceRef: this.resolveStationNameToUic(this.via),
            objectType: 'StopPlaceRef',
          }
        }
      ] : undefined
    ).then((offers: any) => {
      console.log(offers);
      this.loading = false;
      this.offerResults = offers.offers;
      this.tripResults = offers.trips;
    });
  }

  resolveStationNameToUic(name: any) {
    return "urn:uic:stn:" + this.stationDataMap.get(name);
  }

  doUpdate(input: string) {
    if (input.length >= 2) {
      this.stations = Array.from(this.stationDataMap.keys()).filter((key) => key.startsWith(input)).slice(0, 10);
    } else {
      this.stations = [];
    }
  }

  selectTrip(trip: any) {
    this.selectedOffers = this.offerResults.filter((offer: any) => offer.tripCoverage.coveredTripId === trip.id);
  }
}
