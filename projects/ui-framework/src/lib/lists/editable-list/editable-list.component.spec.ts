import {
  async,
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  resetFakeAsyncZone,
} from '@angular/core/testing';
import { EditableListComponent } from './editable-list.component';
import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { NgxSmoothDnDModule } from 'ngx-smooth-dnd';
import { SelectOption } from '../list.interface';
import { EventManagerPlugins } from '../../services/utils/eventManager.plugins';
import { inputValue, fakeAsyncFlush } from '../../services/utils/test-helpers';
import { DOMhelpers } from '../../services/html/dom-helpers.service';
import { ListSortType } from './editable-list.enum';
import { cloneDeep } from 'lodash';
import { mockTranslatePipe } from '../../tests/services.stub.spec';
import { ButtonComponent } from '../../buttons/button/button.component';
import { InputMessageComponent } from '../../form-elements/input-message/input-message.component';
import { SquareButtonComponent } from '../../buttons/square/square.component';
import { simpleChange } from '../../services/utils/functional-utils';

describe('EditableListComponent', () => {
  let fixture: ComponentFixture<EditableListComponent>;
  let component: EditableListComponent;
  let selectOptionsMock: SelectOption[];
  const triggerChanges = () => {
    component.ngOnChanges(
      simpleChange({
        list: cloneDeep(selectOptionsMock),
      })
    );
  };

  DOMhelpers.prototype.injectStyles(`
    .html-reporter .result-message {
      white-space: pre-line !important;
      margin-bottom: 14px;
      line-height: 2;
      max-width: 700px;
    }
    .html-reporter .stack-trace {
      white-space: pre-line !important;
    }
  `);

  beforeEach(() => {
    resetFakeAsyncZone();
  });

  beforeEach(async(() => {
    selectOptionsMock = [
      {
        id: 1,
        value: 'Martial arts',
        selected: false,
      },
      {
        id: 2,
        value: 'Climbing',
        selected: false,
      },
      {
        id: 3,
        value: 'Football',
        selected: true,
      },
    ];

    TestBed.configureTestingModule({
      declarations: [
        EditableListComponent,
        mockTranslatePipe,
        ButtonComponent,
        SquareButtonComponent,
        InputMessageComponent,
      ],
      imports: [CommonModule, NgxSmoothDnDModule],
      providers: [EventManagerPlugins[0]],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(EditableListComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(EditableListComponent);
        component = fixture.componentInstance;
        component.ngOnInit = () => {};
      });
  }));

  describe('maxChars', () => {
    it('should accept 10 chars if max chars is 10', () => {
      component.maxChars = 10;
      triggerChanges();
      const input = fixture.debugElement.query(By.css('.bel-item-input'));
      expect(input.attributes.maxlength).toEqual('10');
    });
  });

  describe('Adding/Deleting items', () => {
    it('should have all items in the list', () => {
      triggerChanges();
      const list = fixture.debugElement.queryAll(
        By.css('.bel-item.b-icon-drag-alt')
      );
      expect(list.length).toEqual(3);
      expect(component.listState.list).toEqual(selectOptionsMock);
    });
    it('should have trash button if allowedActions.remove is true', () => {
      component.allowedActions = {
        remove: true,
      };
      triggerChanges();
      const del = fixture.debugElement.queryAll(
        By.css('.bel-trash-button button')
      );
      expect(del.length).toEqual(3);
    });
    it('should not have trash button if allowedActions.remove is false', () => {
      component.allowedActions = {
        remove: false,
      };
      triggerChanges();
      const del = fixture.debugElement.queryAll(
        By.css('.bel-trash-button button')
      );
      expect(del.length).toEqual(0);
    });
    it('should not have trash button if item has canBeDeleted=false', () => {
      selectOptionsMock[0].canBeDeleted = false;
      component.allowedActions = {
        remove: true,
      };
      triggerChanges();
      const del = fixture.debugElement.queryAll(
        By.css('.bel-trash-button button')
      );
      expect(del.length).toEqual(2);
    });
    it('should delete item from the list', fakeAsync(() => {
      triggerChanges();
      const del = fixture.debugElement.queryAll(
        By.css('.bel-trash-button button')
      );
      del[0].nativeElement.click();
      fixture.detectChanges();
      const remove = fixture.debugElement.query(
        By.css('.bel-remove-button button')
      );
      remove.nativeElement.click();
      tick(300);
      fixture.detectChanges();
      const list3 = fixture.debugElement.queryAll(
        By.css('.bel-item.b-icon-drag-alt')
      );
      expect(list3.length).toEqual(2);
      fakeAsyncFlush();
    }));

    it('should emit the right event when item was deleted', fakeAsync(() => {
      spyOn(component.changed, 'emit');
      triggerChanges();
      const del = fixture.debugElement.queryAll(
        By.css('.bel-trash-button button')
      );
      del[2].nativeElement.click();
      fixture.detectChanges();
      const remove = fixture.debugElement.queryAll(
        By.css('.bel-remove-button button')
      );
      remove[2].nativeElement.click();
      tick(300);
      fixture.detectChanges();
      const expectedParam = {
        delete: ['Football'],
        create: [],
        order: ['Martial arts', 'Climbing'],
        sortType: ListSortType.UserDefined,
        list: [
          {
            id: 1,
            value: 'Martial arts',
            selected: false,
          },
          {
            id: 2,
            value: 'Climbing',
            selected: false,
          },
        ],
      };
      expect(component.changed.emit).toHaveBeenCalledWith(expectedParam);
      fakeAsyncFlush();
    }));

    it('should add item to the list', () => {
      triggerChanges();
      const input = fixture.debugElement.query(By.css('.bel-item-input'));
      inputValue(input.nativeElement, 'Drawing');
      fixture.detectChanges();
      const done = fixture.debugElement.query(
        By.css('.bel-done-button button')
      );
      done.nativeElement.click();
      fixture.detectChanges();
      const list3 = fixture.debugElement.queryAll(
        By.css('.bel-item.b-icon-drag-alt')
      );
      expect(list3.length).toEqual(4);
    });

    it('should emit the right event when item was added', (done) => {
      triggerChanges();
      const input = fixture.debugElement.query(By.css('.bel-item-input'));
      const doneButton = fixture.debugElement.query(
        By.css('.bel-done-button button')
      );
      component.changed.subscribe((data) => {
        expect(data.create[0]).toEqual('abc');
        expect(data.order[0]).toEqual('abc');
        done();
      });
      inputValue(input.nativeElement, 'abc');
      fixture.detectChanges();
      doneButton.nativeElement.click();
      fixture.detectChanges();
    });

    it('should show an error if item is in the list already', fakeAsync(() => {
      triggerChanges();
      const input = fixture.debugElement.query(By.css('.bel-item-input'));
      inputValue(
        input.nativeElement,
        component.list[0].value.toUpperCase(),
        false,
        false
      );
      fixture.detectChanges();
      const done = fixture.debugElement.query(
        By.css('.bel-done-button button')
      );
      done.nativeElement.click();
      fixture.detectChanges();
      tick(100);
      const error = fixture.debugElement.query(
        By.css('[b-input-message] .error')
      );
      expect(error.nativeElement.innerText).toContain(
        selectOptionsMock[0].value
      );
      expect(error.nativeElement.innerText).toContain('already');
      fakeAsyncFlush();
    }));
  });

  describe('Sorting', () => {
    beforeEach(() => {
      triggerChanges();
    });
    it('should sort ascending when pressing Asc button ', () => {
      spyOn(component.changed, 'emit');
      const sort = fixture.debugElement.query(
        By.css('.bel-sort-button button')
      );
      sort.nativeElement.click();
      fixture.detectChanges();
      const expectedParam = {
        delete: [],
        create: [],
        order: ['Climbing', 'Football', 'Martial arts'],
        sortType: ListSortType.Asc,
        list: [
          {
            id: 2,
            value: 'Climbing',
            selected: false,
          },
          {
            id: 3,
            value: 'Football',
            selected: true,
          },
          {
            id: 1,
            value: 'Martial arts',
            selected: false,
          },
        ],
      };
      expect(component.changed.emit).toHaveBeenCalledWith(expectedParam);
    });

    it('should sort descending when pressing Desc button', () => {
      spyOn(component.changed, 'emit');
      const sort = fixture.debugElement.query(
        By.css('.bel-sort-button button')
      );
      sort.nativeElement.click();
      sort.nativeElement.click();
      fixture.detectChanges();
      const expectedParam = {
        delete: [],
        create: [],
        order: ['Martial arts', 'Football', 'Climbing'],
        sortType: ListSortType.Desc,
        list: [
          {
            id: 1,
            value: 'Martial arts',
            selected: false,
          },
          {
            id: 3,
            value: 'Football',
            selected: true,
          },
          {
            id: 2,
            value: 'Climbing',
            selected: false,
          },
        ],
      };
      expect(component.changed.emit).toHaveBeenCalledWith(expectedParam);
    });

    it('should sort ascending with sortType input ', () => {
      spyOn(component.changed, 'emit');
      component.ngOnChanges(
        simpleChange({
          sortType: ListSortType.Asc,
        })
      );
      const expectedParam = {
        delete: [],
        create: [],
        order: ['Climbing', 'Football', 'Martial arts'],
        sortType: ListSortType.Asc,
        list: [
          {
            id: 2,
            value: 'Climbing',
            selected: false,
          },
          {
            id: 3,
            value: 'Football',
            selected: true,
          },
          {
            id: 1,
            value: 'Martial arts',
            selected: false,
          },
        ],
      };
      expect(component.changed.emit).toHaveBeenCalledWith(expectedParam);
    });

    it('should sort descending with sortType input', () => {
      spyOn(component.changed, 'emit');
      component.ngOnChanges(
        simpleChange({
          sortType: ListSortType.Desc,
        })
      );

      const expectedParam = {
        delete: [],
        create: [],
        order: ['Martial arts', 'Football', 'Climbing'],
        sortType: ListSortType.Desc,
        list: [
          {
            id: 1,
            value: 'Martial arts',
            selected: false,
          },
          {
            id: 3,
            value: 'Football',
            selected: true,
          },
          {
            id: 2,
            value: 'Climbing',
            selected: false,
          },
        ],
      };
      expect(component.changed.emit).toHaveBeenCalledWith(expectedParam);
    });
  });
});
