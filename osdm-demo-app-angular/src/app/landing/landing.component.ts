import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import OSDM from 'osdm-client-lib';
import '@sbb-esta/lyne-elements/button.js';
import '@sbb-esta/lyne-elements/form-field.js';
import '@sbb-esta/lyne-elements/select.js';
import '@sbb-esta/lyne-elements/option.js';
import '@sbb-esta/lyne-elements/autocomplete.js';
import '@sbb-esta/lyne-elements-experimental/pearl-chain-time.js';
import '@sbb-esta/lyne-elements-experimental/pearl-chain.js';
import '@sbb-esta/lyne-elements-experimental/pearl-chain-vertical.js';
import '@sbb-esta/lyne-elements-experimental/journey-summary.js';
import { FormsModule } from '@angular/forms';
import {CurrencyPipe, DatePipe, JsonPipe, NgOptimizedImage} from "@angular/common";
import * as uicData from '../../../assets/uic.json';
import { DurationPipe } from "../duration.pipe";
import { OffersComponent } from "../offers/offers.component";
import * as mockData from "../../../assets/landing.json";

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
  imports: [FormsModule, JsonPipe, DatePipe, CurrencyPipe, DurationPipe, OffersComponent, NgOptimizedImage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css',
})
export class LandingComponent implements OnInit {
  constructor(private router: Router) {
  }

  origin = ''; // 'Zürich HB';
  via = ''; // 'München Hbf';
  destination = '';// 'Praha hl.n.';
  stationDataMap = new Map<string, string>();
  stations: string[] = [];
  loading = false;
  selectedOffers: any;
  selectedTrip?: string;
  useMockData = false;

  pearlMap = new Map<string, any>();
  pearlDepartureMap = new Map<string, any>();
  pearlArrivalMap = new Map<string, any>();

  imageSrc = "/assets/team_1.jpg";

  ngOnInit() {
    Object.values(uicData.stops).forEach((value) => {
      this.stationDataMap.set(value.default_name, value.id);
    });
      if  (this.useMockData) {
        this.tripResults = mockData.trips;
        this.selectedOffers = mockData.offers;
      }
    }

  offerResults: any = [];
  tripResults: any = [];
  showEasterEgg = false;


  legs: any[] = [
    {
      __typename: "PTRideLeg",
      arrival: {
        time: "2022-12-11T12:13:00+01:00"
      },
      departure: {
        time: "2022-12-07T12:11:00+01:00"
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
    },
    {
      __typename: "PTRideLeg",
      arrival: {
        time: "2022-12-11T12:13:00+01:00"
      },
      departure: {
        time: "2022-12-07T12:11:00+01:00"
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
    }
  ];
  now = new Date();

  trip = {
    arrival: "arrival",
    departure: "departure",
    destination: "destination",
    duration: 0,
    legs: this.legs,
    origin: "origin",
    vias: ["via"]

  }

  getOffers() {
    if (this.origin === this.destination) {
      this.showEasterEgg = true;
      return;
    }
    this.showEasterEgg = false;

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

      this.tripResults.forEach((trip: any) => {
        this.mapLegs(trip);
      });

    });
  }

  resolveStationNameToUic(name: any) {
    return "urn:uic:stn:" + this.stationDataMap.get(name);
  }

  doUpdate(input: string) {
    if (input.length >= 2) {
      this.stations = Array.from(this.stationDataMap.keys()).filter((key) => key.toLowerCase().startsWith(input.toLowerCase())).slice(0, 10);
    } else {
      this.stations = [];
    }
  }

  selectTrip(trip: any) {
    this.selectedOffers = this.offerResults.filter((offer: any) => offer.tripCoverage.coveredTripId === trip.id);
    this.selectedTrip = trip.id;
  }

  updateImage() {
    if (this.imageSrc === "/assets/team_1.jpg") {
      this.imageSrc = "/assets/team_2.jpg";
    } else {
      this.imageSrc = "/assets/team_1.jpg";
    }
  }

  mapLegs(trip: any) {
    var legs = [];
    for (var i = 0; i < trip.legs.length; i++) {
      if (trip.legs[i].timedLeg == null) {
        continue;
      }

      legs.push({
        __typename: "PTRideLeg",
        arrival: {
          //time: "2022-12-11T12:13:00+01:00"
          time: trip.legs[i].timedLeg.start.serviceDeparture.timetabledTime
        },
        departure: {
          time: trip.legs[i].timedLeg.end.serviceArrival.timetabledTime
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
    this.pearlMap.set(trip.id, legs);
    this.pearlDepartureMap.set(trip.id, trip.legs[0].timedLeg.start.serviceDeparture.timetabledTime);
    console.log(this.pearlDepartureMap.get(trip.id));
    this.pearlArrivalMap.set(trip.id, trip.legs[trip.legs.length-1].timedLeg.end.serviceArrival.timetabledTime);
    console.log(this.pearlArrivalMap.get(trip.id));

    // console.log('Abfahrt: ',trip.legs[0].timedLeg.start.serviceDeparture.timetabledTime)
    // console.log(trip.legs.filter((leg: any) => leg.timedLeg))
    // const res = trip.legs.filter((leg: any) => leg.timedLeg)
    //   .map((leg: any) => ({
    //     __typename: "PTRideLeg",
    //     arrival: {
    //       time: leg.timedLeg.end.serviceArrival.timetabledTime
    //     },
    //   }));
// console.log(res);
    // return trip.legs
    //   // .filter((leg: any) => leg.timedLeg)
    //   .map((leg: any) => ({
    //   __typename: "PTRideLeg",
    //   arrival: {
    //     time: leg.timedLeg.end.serviceArrival.timetabledTime
    //   },
    //   departure: {
    //     time: leg.timedLeg.start.serviceDeparture.timetabledTime
    //   },
    //   serviceJourney: {
    //     quayTypeName: "platform", // Assuming static value as it's not in the input
    //     quayTypeShortName: "Pl.", // Assuming static value as it's not in the input
    //     serviceAlteration: {
    //       cancelled: false, // Assuming static value as it's not in the input
    //       delayText: "string", // Assuming static value as it's not in the input
    //       reachable: true, // Assuming static value as it's not in the input
    //       unplannedStopPointsText: "" // Assuming static value as it's not in the input
    //     }
    //   }
    // }));
  }

  protected readonly JSON = JSON;
}
