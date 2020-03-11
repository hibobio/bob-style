import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { HListMockSimple } from '../../../ui-framework/src/lib/lists/tree-list/tree-list.mock';
import { BTL_KEYMAP_SERVER } from '../../../ui-framework/src/lib/lists/tree-list/tree-list.const';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  constructor(private cd: ChangeDetectorRef) {}

  list = HListMockSimple;
  keymap = BTL_KEYMAP_SERVER;
  listVal: any;

  testForm = new FormGroup({
    treeSelect: new FormControl(),
  });

  ngOnInit() {
    this.testForm.get('treeSelect').valueChanges.subscribe(value => {
      console.log('\n\nList (valueChanges):', value, '\n\n');
    });
  }

  onListChanged(event) {
    console.log('\n\nList (changed):', event, '\n\n');
    this.listVal = event.selectedIDs;
  }

  setListValTo(val) {
    console.log('should set value to', val);
    this.listVal = val;
    this.cd.detectChanges();
  }

  setFormValTo(val) {
    console.log('should set value to', val);
    this.testForm.get('treeSelect').setValue(val, { emitEvent: true });
  }
}
