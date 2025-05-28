import { inject, Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class BusyService {

  busyRequestsCount = 0;
  private spinnerService = inject(NgxSpinnerService);

  busy() {
    this.busyRequestsCount++;
    if (this.busyRequestsCount === 1) {
      this.spinnerService.show(undefined, {
        type: 'pacman',
        bdColor: 'rgba(255, 255, 255, 0.7)',
        color: '#333333'
      });
    }
  }

  idle() {
    this.busyRequestsCount--;
    if (this.busyRequestsCount === 0) {
      this.spinnerService.hide();
    }
  }
}
