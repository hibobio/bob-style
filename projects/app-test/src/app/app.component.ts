import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor() {}

  editorValue = 'some text';

  updateValue(event) {
    console.log(event);
    this.editorValue = event;
  }
}
