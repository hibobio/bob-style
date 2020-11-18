import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { elementFromFixture, elementsFromFixture } from '../../services/utils/test-helpers';
import { Icons } from '../../icons/icons.enum';
import { CommonModule } from '@angular/common';
import { makeArray, simpleChange } from '../../services/utils/functional-utils';
import { cloneDeep } from 'lodash';
import { ListChange } from '../../lists/list-change/list-change';
import { AvatarImageComponent } from '../../avatar/avatar/avatar-image/avatar-image.component';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import {
  listKeyboardServiceStub,
  MobileServiceProvideMock,
  mockHighlightPipe,
  mockTranslatePipe,
  TrackByPropPipeStub,
  TranslateServiceProvideMock,
} from '../../tests/services.stub.spec';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MultiListComponent } from '../../lists/multi-list/multi-list.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ListModelService } from '../../lists/list-service/list-model.service';
import { ListChangeService } from '../../lists/list-change/list-change.service';
import { ListKeyboardService } from '../../lists/list-service/list-keyboard.service';
import { TextButtonComponent } from '../../buttons/text-button/text-button.component';
import { ListFooterComponent } from '../../lists/list-footer/list-footer.component';
import { ListRow, MultiListAndListComponent } from './multi-list-and-list.component';
import { SquareButtonComponent } from '../../buttons/square/square.component';
import { BasicListComponent } from '../../lists/basic-list/basic-list.component';

describe('MultiListAndListComponent', () => {
  let component: MultiListAndListComponent;
  let fixture: ComponentFixture<MultiListAndListComponent>;

  let multiListEl: HTMLElement;
  let chipsListEl: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        SquareButtonComponent,
        BasicListComponent,
        TrackByPropPipeStub,
        MultiListAndListComponent,
        AvatarImageComponent,
        MultiListComponent,
        ListFooterComponent,
        mockTranslatePipe,
        mockHighlightPipe,
        TextButtonComponent,
      ],
      imports: [CommonModule, NoopAnimationsModule, ScrollingModule],
      providers: [
        ListModelService,
        ListChangeService,
        { provide: ListKeyboardService, useValue: listKeyboardServiceStub },
        MobileServiceProvideMock(),
        TranslateServiceProvideMock(),
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideModule(BrowserDynamicTestingModule, {
        set: {
          entryComponents: [AvatarImageComponent],
        },
      })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(MultiListAndListComponent);
        component = fixture.componentInstance;

        spyOn(component.selectChange, 'emit');
        fixture.detectChanges();

        multiListEl = elementFromFixture(fixture, '.mlac-list');
        chipsListEl = elementFromFixture(fixture, '.mlac-chips');
      });
  }));

  describe('Labels', () => {
    it('Should display Multi-list label', () => {
      component.listLabel = 'listLabel';
      fixture.detectChanges();
      const listLabel = elementFromFixture(fixture, '.mlac-list-label');
      expect(listLabel.innerHTML).toContain('listLabel');
    });
    it('Should display list label', () => {
      component.selectedLabel = 'selectedLabel';
      fixture.detectChanges();
      const chipsLabel = elementFromFixture(fixture, '.mlac-list-label');
      expect(chipsLabel.innerHTML).toContain('selectedLabel');
    });
  });

  describe('Empty state', () => {
    let emptyStateEl: HTMLElement;

    beforeEach(() => {
      component.emptyStateConfig = {
        icon: Icons.toDos_link,
      };

      fixture.detectChanges();
    });

    it('Should display Empty State component, if empty state config is passed and no options are selected', () => {
      emptyStateEl = elementFromFixture(fixture, 'b-basic-list');
      expect(emptyStateEl).toBeTruthy();
    });

    it('Should not display Empty State component, if some options are selected', () => {
      component.ngOnChanges(
        simpleChange({
          options: [
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
          ],
        }),
      );
      fixture.detectChanges();
      emptyStateEl = elementFromFixture(fixture, 'b-basic-list b-empty-state');
      expect(emptyStateEl).toBeFalsy();
    });
  });

  describe('Options & List', () => {
    let listOptions: HTMLElement[];
    let listEle: HTMLElement[];

    beforeEach(() => {
      component.ngOnChanges(
        simpleChange({
          options: [
            {
              groupName: 'Group',
              options: makeArray(5).map((itm, ind) => ({
                id: ind,
                value: 'Option' + ind,
              })),
            },
          ],
        }),
      );

      fixture.detectChanges();

      listOptions = elementsFromFixture(
        fixture,
        '.mlac-list .option-select.option',
      );
    });

    it('Should display options', () => {
      expect(listOptions.length).toEqual(5);
    });

    it('Should add list item when an option was selected', () => {
      listEle = elementsFromFixture(fixture, 'b-basic-list tbody .bbl-list-item');
      expect(listEle.length).toEqual(0);
      listOptions[0].click();
      fixture.detectChanges();

      listEle = elementsFromFixture(fixture, 'b-basic-list tbody .bbl-list-item');
      expect(listEle.length).toEqual(1);
    });

    it('Should remove list, if options were cleared', () => {
      listOptions[0].click();
      listOptions[1].click();
      listOptions[2].click();

      fixture.detectChanges();
      listEle = elementsFromFixture(fixture, 'b-basic-list tbody .bbl-list-item');
      expect(listEle.length).toEqual(3);

      const clearButt = elementFromFixture(
        fixture,
        'b-multi-list .clear-button [role="button"]',
      );
      clearButt.click();

      fixture.detectChanges();
      listEle = elementsFromFixture(fixture, 'b-basic-list tbody .bbl-list-item');
      expect(listEle.length).toEqual(0);
    });
  });

  describe('Select all', () => {
    let selectedList: HTMLElement[];

    it('Should display All list, if all options of group are selected', () => {
      component.ngOnChanges(
        simpleChange({
          options: [
            {
              groupName: 'Group1',
              options: makeArray(3).map((itm, ind) => ({
                id: ind,
                value: 'Option' + ind,
                selected: true,
              })),
            },
          ],
        })
      );
      fixture.detectChanges();
      selectedList = elementsFromFixture(fixture, 'b-basic-list tbody .bbl-list-item');

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
      component.ngOnChanges(
        simpleChange({
          options: options,
        }),
      );

      fixture.detectChanges();

      listOptions = elementsFromFixture(
        fixture,
        '.mlac-list .option-select.option',
      );
    });

    it('Should emit event when option is selected', () => {
      const updatedOptions = cloneDeep(options);
      const listChange = new ListChange(updatedOptions);

      listOptions[4].click();
      fixture.detectChanges();
      expect(component.selectChange.emit).toHaveBeenCalledWith(listChange);
    });

    it('Should emit event when selectedList item is removed', () => {
      const updatedOptions = cloneDeep(options);
      const listChange = new ListChange(updatedOptions);

      listOptions[0].click();
      listOptions[3].click();

      component.onListRowRemove({ id: 3 as string | number } as ListRow);

      fixture.detectChanges();

      expect(component.selectChange.emit).toHaveBeenCalledTimes(3);
      expect(component.selectChange.emit).toHaveBeenCalledWith(listChange);
    });
  });
});
