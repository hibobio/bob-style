import {
  Component,
  EventEmitter,
  Input,
  NgModule,
  OnInit,
  Output,
} from '@angular/core';
import { ChainSelectModule } from './chain-select.module';
import { SingleSelectModule } from '../single-select/single-select.module';
import { CommonModule } from '@angular/common';
import { SelectGroupOption } from '../list.interface';

@Component({
  selector: 'b-chain-single-select-example',
  template: `
    <b-single-select [options]="options" (selectChange)="change($event)">
    </b-single-select>
  `,
})
export class ChainSingleSelectExampleComponent implements OnInit {
  @Input() selectedId: number;
  public options: SelectGroupOption[];
  @Output() selectChange: EventEmitter<any> = new EventEmitter<any>();

  ngOnInit(): void {
    console.log('ain-single-select-example init');
    this.options = [
      {
        groupName: 'test',
        options: [
          {
            value: 'option 1',
            id: 1,
            selected: 1 === this.selectedId,
          },
          {
            value: 'option 2',
            id: 2,
            selected: 2 === this.selectedId,
          },
          {
            value: 'option 3',
            id: 3,
            selected: 3 === this.selectedId,
          },
        ],
      },
    ];
  }

  change($event) {
    this.selectChange.emit($event);
  }
}

export const template = `
  <b-chain-select [actionLabel]="actionLabel"
                  [selectedItemList]="selectedIdList"
                  [staticMode]="staticMode"
                  (selectChange)="change($event)">
      <b-chain-single-select-example
        *bChainSelect="let selected=selected; let selectChange=selectChange; let index=index"
        [selectedId]="selected"
        (selectChange)="selectChange($event, index)">
      </b-chain-single-select-example>
  </b-chain-select>
`;

@Component({
  template,
  selector: 'b-chain-select-example',
})
export class ChainSelectExampleComponent {
  @Input() actionLabel: string;
  @Input() staticMode: boolean;
  @Output() selectChange: EventEmitter<any> = new EventEmitter<any>();
  public selectedIdList = [1, 2, 3];
  public change($event) {
    this.selectChange.emit($event);
  }
}

@NgModule({
  declarations: [
    ChainSelectExampleComponent,
    ChainSingleSelectExampleComponent,
  ],
  imports: [CommonModule, ChainSelectModule, SingleSelectModule],
  exports: [ChainSelectExampleComponent],
  entryComponents: [ChainSingleSelectExampleComponent],
})
export class ChainSelectExampleModule {}
