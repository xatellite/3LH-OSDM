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
      ticketData: {}
    }
  },
  methods: {
    openTicket() {
      // ToDo Finish data path
      window.open(this.ticketData.fulfillment, '_blank').focus()
    }
  },
  mounted() {
    const bookingId = this.$route.b
    OSDM.getBooking(bookingId).then((booking) => {
      this.bookingData = booking
    })
  }
}
</script>
