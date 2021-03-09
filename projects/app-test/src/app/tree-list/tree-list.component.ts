import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnInit,
  NgModule,
} from '@angular/core';
import { HListMockSimple } from '../../../../ui-framework/src/lib/lists/tree-list/tree-list.mock';
import { BTL_KEYMAP_SERVER } from '../../../../ui-framework/src/lib/lists/tree-list/tree-list.const';
import {
  FormGroup,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TreeListModule } from '../../../../ui-framework/src/lib/lists/tree-list/tree-list/tree-list.module';
import { TreeSelectModule } from '../../../../ui-framework/src/lib/lists/tree-list/tree-select/tree-select.module';
import { StatsModule } from '../../../../ui-framework/src/lib/services/util-components/stats.module';
import { SelectType } from '../../../../ui-framework/src/lib/lists/list.enum';

@Component({
  selector: 'app-tree-list',
  templateUrl: './tree-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TreeListTestComponent implements OnInit {
  constructor(private cd: ChangeDetectorRef) {}

  list = HListMockSimple;
  keymap = BTL_KEYMAP_SERVER;
  listVal: any;
  listVal2: any;

  testForm = new FormGroup({
    treeSelect: new FormControl(),
  });
  testForm2 = new FormGroup({
    treeSelect2: new FormControl(),
  });

  multiListTestValue = [
    HListMockSimple[1].children[0].serverId,
    HListMockSimple[1].children[1].children[0].serverId,
    HListMockSimple[2].children[1].children[2].serverId,
    HListMockSimple[2].children[2].serverId,
  ];

  readonly selectType = SelectType;

  ngOnInit() {
    this.testForm.get('treeSelect').valueChanges.subscribe((value) => {
      console.log('\n\nSingle List (valueChanges):', value, '\n\n');
    });
    this.testForm2.get('treeSelect2').valueChanges.subscribe((value) => {
      console.log('\n\nMulti List (valueChanges):', value, '\n\n');
    });
  }

  onListChanged(event, formName = 'testForm') {
    console.log(
      `\n\n ${formName === 'testForm2' ? 'Multi' : 'Single'} List (changed):`,
      event,
      '\n\n'
    );
    this[formName === 'testForm2' ? 'listVal2' : 'listVal'] = event.selectedIDs;
  }

  setListValTo(val, formName = 'testForm') {
    console.log(
      `should set ${
        formName === 'testForm2' ? 'Multi' : 'Single'
      } List value to`,
      val
    );
    this[formName === 'testForm2' ? 'listVal2' : 'listVal'] = val;
    this.cd.detectChanges();
  }

  setFormValTo(val, formName = 'testForm') {
    console.log(
      `should set ${
        formName === 'testForm2' ? 'Multi' : 'Single'
      } List value to`,
      val
    );
    this[formName === 'testForm2' ? 'testForm2' : 'testForm']
      .get(formName === 'testForm2' ? 'treeSelect2' : 'treeSelect')
      .setValue(val, { emitEvent: true });
  }

  onRowOrderChanged($event: any) {
    console.log($event);
  }
}

@NgModule({
  declarations: [TreeListTestComponent],
  exports: [TreeListTestComponent],
  imports: [
    CommonModule,
    StatsModule,
    TreeListModule,
    TreeSelectModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [],
})
export class TreeListTestModule {}
