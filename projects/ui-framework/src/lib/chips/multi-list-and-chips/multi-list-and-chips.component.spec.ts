import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  elementFromFixture,
  simpleChange,
  elementsFromFixture,
} from '../../services/utils/test-helpers';
import { MultiListAndChipsComponent } from './multi-list-and-chips.component';
import { Icons } from '../../icons/icons.enum';
import { MockComponent } from 'ng-mocks';
import { EmptyStateComponent } from '../../indicators/empty-state/empty-state.component';
import { IconComponent } from '../../icons/icon.component';
import { CommonModule } from '@angular/common';
import { ChipComponent } from '../chip/chip.component';
import { makeArray } from '../../services/utils/functional-utils';
import { MultiListModule } from '../../lists/multi-list/multi-list.module';
import { ChipListComponent } from '../chip-list/chip-list.component';
import { EventManagerPlugins } from '../../services/utils/eventManager.plugins';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { cloneDeep } from 'lodash';
import { ListChange } from '../../lists/list-change/list-change';
import { AvatarImageComponent } from '../../avatar/avatar/avatar-image/avatar-image.component';
import { ButtonComponent } from '../../buttons/button/button.component';

describe('MultiListAndChipsComponent', () => {
  let component: MultiListAndChipsComponent;
  let fixture: ComponentFixture<MultiListAndChipsComponent>;

  let multiListEl: HTMLElement;
  let chipsListEl: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MultiListAndChipsComponent,
        ChipListComponent,
        ChipComponent,
        EmptyStateComponent,
        MockComponent(ButtonComponent),
        AvatarImageComponent,
        MockComponent(IconComponent),
      ],
      imports: [CommonModule, MultiListModule],
      providers: [EventManagerPlugins[0]],
    })
      .overrideModule(BrowserDynamicTestingModule, {
        set: {
          entryComponents: [AvatarImageComponent],
        },
      })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(MultiListAndChipsComponent);
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
    it('Should display Chips-list label', () => {
      component.chipsLabel = 'chipsLabel';
      fixture.detectChanges();
      const chipsLabel = elementFromFixture(fixture, '.mlac-chips-label');
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
        })
      );
      fixture.detectChanges();
      emptyStateEl = elementFromFixture(fixture, 'b-chip-list b-empty-state');
      expect(emptyStateEl).toBeFalsy();
    });
  });

  describe('Options & Chips', () => {
    let listOptions: HTMLElement[];
    let chipEls: HTMLElement[];

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
        })
      );

      fixture.detectChanges();

      listOptions = elementsFromFixture(
        fixture,
        '.mlac-list .option-select.option'
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
      chipEls = elementsFromFixture(fixture, 'b-chip-list b-chip');

      expect(chipEls.length).toEqual(1);
      expect(chipEls[0].innerText.trim()).toEqual('Group1');
    });

    it('Should display single All chip, if all options of group were selected by user', () => {
      component.ngOnChanges(
        simpleChange({
          options: [
            {
              groupName: 'Group1',
              options: makeArray(3).map((itm, ind) => ({
                id: ind,
                value: 'Option' + ind,
                selected: false,
              })),
            },
          ],
        })
      );
      fixture.detectChanges();
      listOptions = elementsFromFixture(
        fixture,
        '.mlac-list .option-select.option'
      );
      chipEls = elementsFromFixture(fixture, 'b-chip-list b-chip');
      expect(listOptions.length).toEqual(3);
      expect(chipEls.length).toEqual(0);
      listOptions.forEach(o => o.click());
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
      component.ngOnChanges(
        simpleChange({
          options: [
            {
              groupName: 'Group',
              options: makeArray(5).map((itm, ind) => ({
                id: ind,
                value: 'Option' + ind,
                selected: ind !== 4,
                prefixComponent: {
                  component: AvatarImageComponent,
                  attributes: {
                    imageSource: 'image' + ind,
                  },
                },
              })),
            },
          ],
        })
      );

      fixture.detectChanges();

      listOptions = elementsFromFixture(
        fixture,
        '.mlac-list .option-select.option'
      );
    });

    it('Should display avatar chips', () => {
      chipEls = elementsFromFixture(fixture, 'b-chip-list b-chip');

      expect(chipEls.length).toEqual(4);

      expect(chipEls[2].innerHTML).toContain('image2');
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
      component.ngOnChanges(
        simpleChange({
          options: options,
        })
      );

      fixture.detectChanges();

      listOptions = elementsFromFixture(
        fixture,
        '.mlac-list .option-select.option'
      );
    });

    it('Should emit event when option is selected', () => {
      const updatedOptions = cloneDeep(options);
      updatedOptions[0].options[4].selected = true;
      const listChange = new ListChange(updatedOptions);

      listOptions[4].click();

      expect(component.selectChange.emit).toHaveBeenCalledWith(listChange);
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

      expect(component.selectChange.emit).toHaveBeenCalledTimes(3);
      expect(component.selectChange.emit).toHaveBeenCalledWith(listChange);
    });
  });
});
