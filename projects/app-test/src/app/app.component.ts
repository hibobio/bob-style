import { Component } from '@angular/core';
import { SelectGroupOption } from '../../../ui-framework/src/lib/form-elements/lists/list.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app-test';
  multiSelectOptions:SelectGroupOption[] = [
    {
      groupName: 'test',
      options: [
        {value: 'aa', id: 1},
        {value: 'bb', id: 2},
      ],
    }
  ];
}
