import { async, ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule, MatIconModule, MatInputModule, MatTooltipModule } from '@angular/material';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SearchModule } from '../../../navigation/search/search.module';
import { ButtonsModule } from '../../../buttons-indicators/buttons';
import { IconsModule } from '../../../icons';
import { FlexLayoutModule } from '@angular/flex-layout';
import { InputModule } from '../../input';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { SingleListComponent } from './single-list.component';
import { ListModelService } from '../list-service/list-model.service';
import { SelectGroupOption } from '../list.interface';

xdescribe('SingleSelectComponent', () => {
  let component: SingleListComponent;
  let optionsMock: SelectGroupOption[];
  let selectionGroupOptionsMock;
  let fixture: ComponentFixture<SingleListComponent>;

  beforeEach(async(() => {
    optionsMock = [
      {
        groupName: 'Basic Info',
        options: [
          { value: 'Basic Info 1', id: 1 },
          { value: 'Basic Info 2', id: 2 },
        ],
      },
      {
        groupName: 'Personal',
        options: [
          { value: 'Personal 1', id: 11 },
          { value: 'Personal 2', id: 12 },
        ],
      },
    ];

    selectionGroupOptionsMock = [
      {
        groupName: 'Basic Info',
        isCollapsed: false,
        groupHeader: {
          groupName: 'Basic Info',
          value: 'Basic Info',
          id: 'Basic Info',
          isGroupHeader: true,
        },
        'options': [
          {
            value: 'Basic Info 1',
            id: 1,
            groupName: 'Basic Info',
            isGroupHeader: false,
          },
          {
            value: 'Basic Info 2',
            id: 2,
            groupName: 'Basic Info',
            isGroupHeader: false,
          },
        ]
      },
      {
        groupName: 'Personal',
        isCollapsed: false,
        groupHeader: {
          groupName: 'Personal',
          value: 'Personal',
          id: 'Personal',
          isGroupHeader: true,
        },
        'options': [
          {
            value: 'Personal 1',
            id: 11,
            groupName: 'Personal',
            isGroupHeader: false,
          },
          {
            value: 'Personal 2',
            id: 12,
            groupName: 'Personal',
            isGroupHeader: false
          },
        ]
      },
    ];

    TestBed.configureTestingModule({
      declarations: [
        SingleListComponent,
      ],
      providers: [
        ListModelService,
      ],
      imports: [
        NoopAnimationsModule,
        CommonModule,
        FormsModule,
        InputModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        SearchModule,
        ButtonsModule,
        IconsModule,
        MatTooltipModule,
        FlexLayoutModule,
        ScrollingModule,
      ],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(SingleListComponent);
        component = fixture.componentInstance;
        component.options = optionsMock;
        component.value = 1;
        spyOn(component.selectChange, 'emit');
        fixture.autoDetectChanges();
      });
  }));

  describe('ngOnInit', () => {
    it('should',
      fakeAsync(() => {
        tick(20);
        console.log('b');
        debugger;
        expect(1 === 1).toBe(true);
      }));
    // it('should 2',
    //   fakeAsync(() => {
    //     tick(500);
    //     debugger
    //     expect(1 === 1).toBe(true);
    //   }));
  });
});
