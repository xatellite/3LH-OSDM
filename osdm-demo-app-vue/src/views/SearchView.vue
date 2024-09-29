<template>
  <main>
    <div className="flex flex-col">
      <div className="flex gap-5 items-center w-full p-10 justify-center">
        <sbb-form-field>
          <label>Origin</label>
          <input
            type="text"
            placeholder="Input placeholder"
            :value="origin"
            @change="(e) => setOrigin(e.target.value)"
          />
          <sbb-form-field-clear></sbb-form-field-clear>
        </sbb-form-field>
        <sbb-form-field>
          <label>Destination</label>
          <input
            type="text"
            placeholder="Input placeholder"
            :value="destination"
            @change="(e) => setDestination(e.target.value)"
          />
          <sbb-form-field-clear></sbb-form-field-clear>
        </sbb-form-field>
        <sbb-button @click="getOffers">Search</sbb-button>
      </div>
      <div className="flex flex-col">
        <sbb-card type="submit" form="buy" value="trip" v-for="trip in tripResults" :key="trip.id">
          {{ trip.startTime }}
          <div className="flex flex-col">
            <sbb-option
              value="Value 1"
              icon-name="ticket"
              v-for="offer in offerResults"
              :key="offer.offerId"
            >
              {{ offer.offerSummary.minimalPrice.amount }}

              <sbb-button @click="() => buyOffer(offer.offerId)"> Buy </sbb-button>
            </sbb-option>
          </div>
        </sbb-card>
      </div>
    </div>
  </main>
</template>

<script>
import { SbbButtonElement } from '@sbb-esta/lyne-elements/button'
import { SbbFormFieldElement, SbbFormFieldClearElement } from '@sbb-esta/lyne-elements/form-field'
import { SbbCardElement } from '@sbb-esta/lyne-elements/card'
import OSDM from 'osdm-client-lib'

export default {
  data() {
    return {
      origin: '',
      destination: '',
      tripResults: [],
      offerResults: [],
      passengers: [
        {
          externalRef: 'passenger_1',
          dateOfBirth: '1980-01-01',
          type: 'PERSON',
          detail: {
            firstName: 'Elo',
            lastName: 'Musterperson',
            phoneNumber: '+49475000001',
            email: 'elo.musterperson@dlh.com'
          }
        }
      ]
    }
  },
  methods: {
    setOrigin(value) {
      this.origin = value
    },
    setDestination(value) {
      this.destination = value
    },
    getOffers() {
      OSDM.searchOffers(
        {
          stopPlaceRef: this.origin,
          objectType: 'StopPlaceRef'
        },
        {
          stopPlaceRef: this.destination,
          objectType: 'StopPlaceRef'
        },
        this.passengers,
        '2024-10-10T10:00:00Z'
      ).then((offers) => {
        console.log(offers)
        this.offerResults = offers.offers
        this.tripResults = offers.trips
      })
    },
    buyOffer(offerId) {
      // Makes a booking and navigates to an overview screen
      OSDM.createBooking(offerId, this.passengers).then((booking) => {
        const bookingId = booking.booking.id
        OSDM.fulfillBooking(bookingId).then(() => {
          this.$router.push({ path: '/booking', query: { b: bookingId } })
        })
      })
    }
  }
}
</script>
