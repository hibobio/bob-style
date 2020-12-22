import { ComponentFixture, resetFakeAsyncZone, TestBed, waitForAsync } from '@angular/core/testing';
import {
  elementFromFixture,
  elementsFromFixture,
} from '../../services/utils/test-helpers';
import { Icons } from '../../icons/icons.enum';
import { CommonModule } from '@angular/common';
import { makeArray } from '../../services/utils/functional-utils';
import { cloneDeep } from 'lodash';
import { ListChange } from '../../lists/list-change/list-change';
import {
  DOMhelpersProvideMock,
  listKeyboardServiceStub,
  MobileServiceProvideMock,
  mockHighlightPipe,
  mockTranslatePipe,
  MutationObservableServiceProvideMock,
  NgZoneProvideMock,
  TrackByPropPipeStub,
  TranslateServiceProvideMock,
  WindowRefProvideMock,
} from '../../tests/services.stub.spec';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MultiListComponent } from '../../lists/multi-list/multi-list.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ListModelService } from '../../lists/list-service/list-model.service';
import { ListChangeService } from '../../lists/list-change/list-change.service';
import { ListKeyboardService } from '../../lists/list-service/list-keyboard.service';
import { ListFooterComponent } from '../../lists/list-footer/list-footer.component';
import { MultiListAndListComponent } from './multi-list-and-list.component';
import { SquareButtonComponent } from '../../buttons/square/square.component';
import { BasicListComponent } from '../../lists/basic-list/basic-list.component';
import { ListRow } from './multi-list-and-list.interface';
import { MockComponent } from 'ng-mocks';
import { MenuComponent } from '../../navigation/menu/menu.component';
import { TextButtonComponent } from '../../buttons/text-button/text-button.component';
import { itemID } from '../list.interface';

describe('MultiListAndListComponent', () => {
  let component: MultiListAndListComponent;
  let fixture: ComponentFixture<MultiListAndListComponent>;

  beforeEach(() => {
    resetFakeAsyncZone();
  });

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        MultiListAndListComponent,

        MultiListComponent,
        BasicListComponent,
        MockComponent(MenuComponent),
        MockComponent(SquareButtonComponent),
        ListFooterComponent,
        TextButtonComponent,

        TrackByPropPipeStub,
        mockTranslatePipe,
        mockHighlightPipe,
      ],
      imports: [CommonModule, NoopAnimationsModule, ScrollingModule],
      providers: [
        ListModelService,
        ListChangeService,
        { provide: ListKeyboardService, useValue: listKeyboardServiceStub },
        TranslateServiceProvideMock(),
        MobileServiceProvideMock(),
        DOMhelpersProvideMock(),
        MutationObservableServiceProvideMock(),
        WindowRefProvideMock(),
        NgZoneProvideMock(),
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(MultiListAndListComponent);
        component = fixture.componentInstance;

        component.inputOptions$ = [] as any;

        component.selectChange.subscribe(() => {});
        component.changed.subscribe(() => {});
        component.listOptions$.subscribe(() => {});
        component.otherList$.subscribe(() => {});
        component.listValue$.subscribe(() => {});

        spyOn(component.selectChange, 'next');

        fixture.autoDetectChanges();
      });
  }));

  afterAll(() => {
    [
      component.selectChange,
      component.changed,
      component.listOptions$,
      component.otherList$,
      component.listValue$,
    ].forEach((s) => {
      s.complete();
    });
  });

  describe('Labels', () => {
    beforeEach(() => {
      component.listLabel = 'listLabel';
      component.otherLabel = 'selectedLabel';
      fixture.detectChanges();
      component['cd'].detectChanges();
    });

    it('Should display Multi-list label', () => {
      const listLabel = elementFromFixture(fixture, '.mlas-list-label');
      expect(listLabel.innerHTML).toContain('listLabel');
    });

    it('Should display list label', () => {
      const chipsLabel = elementFromFixture(
        fixture,
        '.basic-list .mlas-list-label'
      );
      expect(chipsLabel.innerHTML).toContain('selectedLabel');
    });
  });

  describe('Empty state', () => {
    let emptyStateEl: HTMLElement;

    beforeEach(() => {
      component.emptyState = {
        icon: Icons.toDos_link,
      };

      fixture.detectChanges();
    });

    it('Should display Empty State component, if empty state config is passed and no options are selected', () => {
      emptyStateEl = elementFromFixture(fixture, 'b-basic-list');
      expect(emptyStateEl).toBeTruthy();
    });

    it('Should not display Empty State component, if some options are selected', () => {
      component.inputOptions$ = [
        {
          groupName: 'Group',
          options: [
            {
              id: 1,
              value: 'Option',
              selected: true,
            },
          ],
        },
      ] as any;

      component.ngOnInit();
      fixture.detectChanges();

      emptyStateEl = elementFromFixture(fixture, 'b-basic-list b-empty-state');
      expect(emptyStateEl).toBeFalsy();
    });
  });

  describe('Options & List', () => {
    let listOptions: HTMLElement[];
    let listEle: HTMLElement[];

    beforeEach(() => {
      component.inputOptions$ = [
        {
          groupName: 'Group',
          options: makeArray(5).map((itm, ind) => ({
            id: ind,
            value: 'Option' + ind,
          })),
        },
      ] as any;

      component.ngOnInit();
      fixture.detectChanges();
      component['cd'].detectChanges();

      listOptions = elementsFromFixture(
        fixture,
        '.mlas-list .option-select.option'
      );
    });

    it('Should display options', () => {
      expect(listOptions.length).toEqual(5);
    });

    it('Should add list item when an option was selected', () => {
      listEle = elementsFromFixture(
        fixture,
        'b-basic-list tbody .bbl-list-item'
      );
      expect(listEle.length).toEqual(0);
      listOptions[0].click();
      fixture.detectChanges();

      listEle = elementsFromFixture(
        fixture,
        'b-basic-list tbody .bbl-list-item'
      );
      expect(listEle.length).toEqual(1);
    });

    it('Should remove list, if options were cleared', () => {
      listOptions[0].click();
      listOptions[1].click();
      listOptions[2].click();

      fixture.detectChanges();
      component['cd'].detectChanges();

      listEle = elementsFromFixture(
        fixture,
        'b-basic-list tbody .bbl-list-item'
      );
      expect(listEle.length).toEqual(3);

      const clearButt = elementFromFixture(
        fixture,
        'b-multi-list .clear-button [role="button"]'
      );
      clearButt.click();

      fixture.detectChanges();
      listEle = elementsFromFixture(
        fixture,
        'b-basic-list tbody .bbl-list-item'
      );
      expect(listEle.length).toEqual(0);
    });
  });

  describe('Select all', () => {
    let selectedList: HTMLElement[];

    it('Should display All list, if all options of group are selected', () => {
      component.inputOptions$ = [
        {
          groupName: 'Group1',
          options: makeArray(3).map((itm, ind) => ({
            id: ind,
            value: 'Option' + ind,
            selected: true,
          })),
        },
      ] as any;

      component.ngOnInit();
      fixture.detectChanges();

      selectedList = elementsFromFixture(
        fixture,
        'b-basic-list tbody .bbl-list-item'
      );

      expect(selectedList.length).toEqual(3);
      expect(selectedList[0].innerText.trim()).toEqual('Group1 - Option0');
    });
  });

  describe('Events', () => {
    let listOptions: HTMLElement[];

    const options = [
      {
        groupName: 'Group',
        options: makeArray(5).map((itm, ind) => ({
          id: ind,
          value: 'Option' + ind,
          selected: false,
        })),
      },
    ];

    beforeEach(() => {
      component.inputOptions$ = options as any;

      component.ngOnInit();
      fixture.detectChanges();

      listOptions = elementsFromFixture(
        fixture,
        '.mlas-list .option-select.option'
      );
    });

    it('Should emit event when option is selected', () => {
      const updatedOptions = cloneDeep(options);
      updatedOptions[0].options[4].selected = true;
      const listChange = new ListChange(updatedOptions);

      listOptions[4].click();

      expect(component.selectChange.next).toHaveBeenCalledWith(listChange);
    });

    it('Should emit event when selectedList item is removed', () => {
      const updatedOptions = cloneDeep(options);
      updatedOptions[0].options[0].selected = true;
      const listChange = new ListChange(updatedOptions);

      listOptions[0].click();
      listOptions[3].click();

      component.unselectOptions({ id: 3 as itemID } as ListRow);

      expect(component.selectChange.next).toHaveBeenCalledWith(listChange);
    });
  });
});
