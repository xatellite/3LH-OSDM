import {Routes} from '@angular/router';
import {LandingComponent} from './landing/landing.component';
import {BookingComponent} from './booking/booking.component';
import {ConfirmationComponent} from "./confirmation/confirmation.component";

export const routes: Routes = [
  {path: '', component: LandingComponent},
  {path: 'booking', component: BookingComponent},
  {path: 'confirmation', component: ConfirmationComponent},
];
