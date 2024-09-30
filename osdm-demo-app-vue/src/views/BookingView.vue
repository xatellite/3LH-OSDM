<template>
  <div className="flex flex-col w-full justify-center items-center">
    <h1>Booking</h1>
    <p>{{ ticketData }}</p>
    <sbb-button @click="openTicket">Open Ticket</sbb-button>
  </div>
</template>

<script>
import { SbbButtonElement } from '@sbb-esta/lyne-elements/button'
import OSDM from 'osdm-client-lib'

export default {
  data() {
    return {
      bookingId: '',
      ticketData: {}
    }
  },
  methods: {
    openTicket() {
      // ToDo Finish data path
      window
        .open(
          this.ticketData.booking.fulfillments[0].fulfillmentDocuments[0].downloadLink,
          '_blank'
        )
        .focus()
    },
    fetchFulfillment() {
      OSDM.getBooking(this.bookingId).then((booking) => {
        this.ticketData = booking

        if (!this.ticketData.booking.fulfillments) {
          setTimeout(() => this.fetchFulfillment(), 1000)
        }
      })
    }
  },
  mounted() {
    this.bookingId = this.$route.query.b
    this.fetchFulfillment()
  }
}
</script>
