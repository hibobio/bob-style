import { Component } from '@angular/core';

@Component({
  selector: 'b-mini-preloader',
  template: `
    <div class="fountainG fountainG_1"></div>
    <div class="fountainG fountainG_2"></div>
    <div class="fountainG fountainG_3"></div>
  `,
  styleUrls: ['./mini-preloader.component.scss'],
})
export class MiniPreloaderComponent {

  constructor() {
  }
}
