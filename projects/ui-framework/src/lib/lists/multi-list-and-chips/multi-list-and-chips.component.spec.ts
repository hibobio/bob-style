import { ComponentFixture, resetFakeAsyncZone, TestBed, waitForAsync } from '@angular/core/testing';
import {
  elementFromFixture,
  elementsFromFixture,
  emptyImgWithText,
} from '../../services/utils/test-helpers';
import { MultiListAndChipsComponent } from './multi-list-and-chips.component';
import { Icons } from '../../icons/icons.enum';
import { CommonModule } from '@angular/common';
import { makeArray } from '../../services/utils/functional-utils';
import { cloneDeep } from 'lodash';
import { ListChange } from '../../lists/list-change/list-change';
import { AvatarImageComponent } from '../../avatar/avatar/avatar-image/avatar-image.component';
import {
  TranslateServiceProvideMock,
  mockTranslatePipe,
  mockHighlightPipe,
  listKeyboardServiceStub,
  MobileServiceProvideMock,
  TrackByPropPipeStub,
  DOMhelpersProvideMock,
  MutationObservableServiceProvideMock,
  WindowRefProvideMock,
  NgZoneProvideMock,
} from '../../tests/services.stub.spec';
import { ChipListComponent } from '../../chips/chip-list/chip-list.component';
import { ChipComponent } from '../../chips/chip/chip.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MultiListComponent } from '../../lists/multi-list/multi-list.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ListModelService } from '../../lists/list-service/list-model.service';
import { ListChangeService } from '../../lists/list-change/list-change.service';
import { ListKeyboardService } from '../../lists/list-service/list-keyboard.service';
import { ListFooterComponent } from '../../lists/list-footer/list-footer.component';
import { NgLetModule } from '../../services/utils/nglet.directive';
import { MockComponent } from 'ng-mocks';
import { TextButtonComponent } from '../../buttons/text-button/text-button.component';

describe('MultiListAndChipsComponent', () => {
  let component: MultiListAndChipsComponent;
  let fixture: ComponentFixture<MultiListAndChipsComponent>;

  beforeEach(() => {
    resetFakeAsyncZone();
  });

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        MultiListAndChipsComponent,

        MultiListComponent,
        ChipListComponent,
        ChipComponent,
        MockComponent(AvatarImageComponent),
        ListFooterComponent,
        TextButtonComponent,

        TrackByPropPipeStub,
        mockTranslatePipe,
        mockHighlightPipe,
      ],
      imports: [
        CommonModule,
        NoopAnimationsModule,
        ScrollingModule,
        NgLetModule,
      ],
      providers: [
        ListModelService,
        ListChangeService,
        { provide: ListKeyboardService, useValue: listKeyboardServiceStub },
        MobileServiceProvideMock(),
        TranslateServiceProvideMock(),
        DOMhelpersProvideMock(),
        MutationObservableServiceProvideMock(),
        WindowRefProvideMock(),
        NgZoneProvideMock(),
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(MultiListAndChipsComponent);
        component = fixture.componentInstance;

        component.inputOptions$ = [] as any;

        component.selectChange.subscribe(() => {});
        component.changed.subscribe(() => {});
        component.listOptions$.subscribe(() => {});
        component.otherList$.subscribe(() => {});

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
    ].forEach((s) => {
      s.complete();
    });
  });

  describe('Labels', () => {
    beforeEach(() => {
      component.listLabel = 'listLabel';
      component.otherLabel = 'chipsLabel';
      fixture.detectChanges();
    });

    it('Should display Multi-list label', () => {
      const listLabel = elementFromFixture(fixture, '.mlas-list-label');
      expect(listLabel.innerHTML).toContain('listLabel');
    });
    it('Should display Chips-list label', () => {
      const chipsLabel = elementFromFixture(
        fixture,
        '.chips-list .mlas-list-label'
      );
      expect(chipsLabel.innerHTML).toContain('chipsLabel');
    });
  });

  describe('Empty state', () => {
    let emptyStateEl: HTMLElement;

    beforeEach(() => {
      component.emptyState = {
        text: 'Choose a life',
        icon: Icons.toDos_link,
      };

      fixture.detectChanges();
    });

    it('Should display Empty State component, if empty state config is passed and no options are selected', () => {
      emptyStateEl = elementFromFixture(fixture, 'b-chip-list b-empty-state');
      expect(emptyStateEl).toBeTruthy();
    });

    it('Should not display Empty State component, if some options are selected', () => {
      component.inputOptions$ = [
        {
          groupName: 'Grosssup',
          options: [
            {
              id: 134,
              value: 'Option',
              selected: true,
            },
          ],
        },
      ] as any;

      component.ngOnInit();
      fixture.detectChanges();

      emptyStateEl = elementFromFixture(fixture, 'b-chip-list b-empty-state');
      expect(emptyStateEl).toBeFalsy();
    });
  });

  describe('Options & Chips', () => {
    let listOptions: HTMLElement[];
    let chipEls: HTMLElement[];

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

      listOptions = elementsFromFixture(
        fixture,
        '.mlas-list .option-select.option'
      );
    });

    it('Should display options', () => {
      expect(listOptions.length).toEqual(5);
    });

    it('Should add chip when an option was selected', () => {
      chipEls = elementsFromFixture(fixture, 'b-chip-list b-chip');
      expect(chipEls.length).toEqual(0);
      listOptions[1].click();
      fixture.detectChanges();

      chipEls = elementsFromFixture(fixture, 'b-chip-list b-chip');
      expect(chipEls.length).toEqual(1);
      expect(chipEls[0].innerText).toContain('Option1');
    });

    it('Should remove chips, if options were cleared', () => {
      listOptions[0].click();
      listOptions[1].click();
      listOptions[2].click();

      fixture.detectChanges();
      chipEls = elementsFromFixture(fixture, 'b-chip-list b-chip');
      expect(chipEls.length).toEqual(3);

      const clearButt = elementFromFixture(
        fixture,
        'b-multi-list .clear-button [role="button"]'
      );
      clearButt.click();

      fixture.detectChanges();
      chipEls = elementsFromFixture(fixture, 'b-chip-list b-chip');
      expect(chipEls.length).toEqual(0);
    });

    it('Should deselect options, if chips are removed', () => {
      listOptions[0].click();
      listOptions[1].click();
      listOptions[2].click();

      fixture.detectChanges();
      chipEls = elementsFromFixture(fixture, 'b-chip-list b-chip');
      expect(chipEls.length).toEqual(3);

      const removeButts = elementsFromFixture(fixture, 'b-chip .remove-button');
      removeButts[0].click();

      fixture.detectChanges();
      chipEls = elementsFromFixture(fixture, 'b-chip-list b-chip');
      expect(chipEls.length).toEqual(2);
      expect(chipEls[0].innerHTML).toContain('Option1');
    });
  });

  describe('Select all', () => {
    let listOptions: HTMLElement[];
    let chipEls: HTMLElement[];

    it('Should display single All chip, if all options of group are selected', () => {
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

      chipEls = elementsFromFixture(fixture, 'b-chip-list b-chip');

      expect(chipEls.length).toEqual(1);
      expect(chipEls[0].innerText.trim()).toEqual('Group1');
    });

    it('Should display single All chip, if all options of group were selected by user', () => {
      component.inputOptions$ = [
        {
          groupName: 'Group1',
          options: makeArray(3).map((itm, ind) => ({
            id: ind,
            value: 'Option' + ind,
            selected: false,
          })),
        },
      ] as any;

      component.ngOnInit();
      fixture.detectChanges();

      listOptions = elementsFromFixture(
        fixture,
        '.mlas-list .option-select.option'
      );
      chipEls = elementsFromFixture(fixture, 'b-chip-list b-chip');
      expect(listOptions.length).toEqual(3);
      expect(chipEls.length).toEqual(0);
      listOptions.forEach((o) => o.click());
      fixture.detectChanges();

      chipEls = elementsFromFixture(fixture, 'b-chip-list b-chip');
      expect(chipEls.length).toEqual(1);
      expect(chipEls[0].innerText.trim()).toEqual('Group1');
    });
  });

  describe('Avatar Chips', () => {
    let listOptions: HTMLElement[];
    let chipEls: HTMLElement[];

    beforeEach(() => {
      component.inputOptions$ = [
        {
          groupName: 'Group',
          options: makeArray(5).map((itm, ind) => ({
            id: ind,
            value: 'Option' + ind,
            selected: ind !== 4,
            prefixComponent: {
              component: AvatarImageComponent,
              attributes: {
                imageSource: emptyImgWithText('avatarImg' + ind),
              },
            },
          })),
        },
      ] as any;

      component.ngOnInit();
      fixture.detectChanges();

      listOptions = elementsFromFixture(
        fixture,
        '.mlas-list .option-select.option'
      );
    });

    it('Should display avatar chips', () => {
      chipEls = elementsFromFixture(fixture, 'b-chip-list b-chip');

      expect(chipEls.length).toEqual(4);

      expect(chipEls[2].innerHTML).toContain('avatarImg2');
      expect(chipEls[2].innerHTML).toContain('Option2');
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

    it('Should emit event when chip is removed', () => {
      const updatedOptions = cloneDeep(options);
      updatedOptions[0].options[3].selected = true;
      const listChange = new ListChange(updatedOptions);

      listOptions[0].click();
      listOptions[3].click();

      fixture.detectChanges();

      const removeButts = elementsFromFixture(fixture, 'b-chip .remove-button');
      removeButts[0].click();

      expect(component.selectChange.next).toHaveBeenCalledWith(listChange);
    });
  });
});
